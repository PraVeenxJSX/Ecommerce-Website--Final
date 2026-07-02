const axios = require("axios");
const Product = require("../models/Product");

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@vortex.shop";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const writeSse = (res, payload) => {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
};

const chunkText = (text, size = 18) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};

const buildProductContext = (products) =>
  products
    .map(
      (product) =>
        `- ${product.name} | ₹${product.price} | ${product.category} | ${
          product.countInStock > 0 ? `${product.countInStock} in stock` : "out of stock"
        }\n  ${product.description}`
    )
    .join("\n");

const getLocalReply = (message, products) => {
  const lower = message.toLowerCase();

  if (/(order|tracking|track|status|delivery|delivered)/i.test(lower)) {
    return `I can help with orders, but I can’t look up an order without an order ID or your account details here. If you’re signed in, check My Orders, or contact ${SUPPORT_EMAIL}.`;
  }

  if (/(return|refund|exchange)/i.test(lower)) {
    return `The store currently shows 30-day returns on unused items. For damaged items or refund help, contact ${SUPPORT_EMAIL}.`;
  }

  if (/(shipping|ship|delivery time|delivery times|dispatch)/i.test(lower)) {
    return "Free shipping is shown on orders above ₹499, but shipping time is not listed in the current app data.";
  }

  if (/(payment|pay|upi|gpay|paytm|visa|mastercard|card)/i.test(lower)) {
    return "Accepted payment methods shown in the store are Visa, Mastercard, UPI, GPay, and PayTM.";
  }

  if (/(support|contact|email|human|agent)/i.test(lower)) {
    return `You can reach support at ${SUPPORT_EMAIL}.`;
  }

  if (products.length > 0) {
    return "I found some catalog matches for you. Open any product card to view details.";
  }

  return "I’m ready to help with products, orders, shipping, returns, and payments.";
};

const streamText = async (res, text, products = []) => {
  res.status(200);
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  if (products.length > 0) {
    writeSse(res, {
      type: "meta",
      products,
    });
  }

  for (const chunk of chunkText(text)) {
    writeSse(res, {
      type: "delta",
      content: chunk,
    });
  }

  writeSse(res, { type: "done" });
  res.end();
};

exports.streamChat = async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  const history = Array.isArray(req.body?.history) ? req.body.history : [];

  if (!message) {
    return res.status(400).json({ message: "Message is required" });
  }

  const products = await Product.find(
    { $text: { $search: message } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(4)
    .lean();

  const catalogContext = buildProductContext(products);
  const systemPrompt = [
    "You are the customer support and shopping assistant for VORTEX Commerce.",
    "Be warm, concise, and helpful.",
    "Answer product, order, shipping, return, payment, and general shopping questions.",
    "Never invent store policies, prices, stock levels, or order details.",
    `If a policy or detail is unavailable, say so plainly and direct the user to ${SUPPORT_EMAIL} when human help is needed.`,
    "Store policies known from the site: free shipping is shown above ₹499, returns are 30 days on unused items, and accepted payments shown in the app are Visa, Mastercard, UPI, GPay, and PayTM.",
    "If product matches are provided, use them naturally and keep the response focused on helping the shopper choose or learn more.",
  ].join(" ");

  const messages = [
    { role: "system", content: systemPrompt },
    ...(history || [])
      .filter((item) => item && typeof item.content === "string" && typeof item.role === "string")
      .slice(-8)
      .map((item) => ({
        role: item.role === "assistant" ? "assistant" : "user",
        content: item.content,
      })),
    catalogContext
      ? { role: "system", content: `Relevant catalog matches:\n${catalogContext}` }
      : null,
    { role: "user", content: message },
  ].filter(Boolean);

  if (!OPENAI_API_KEY) {
    return streamText(res, getLocalReply(message, products), products);
  }

  try {
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: OPENAI_MODEL,
        messages,
        temperature: 0.6,
        stream: true,
      },
      {
        responseType: "stream",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    res.status(200);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    if (products.length > 0) {
      writeSse(res, { type: "meta", products });
    }

    let buffer = "";
    let closed = false;

    req.on("close", () => {
      closed = true;
      openaiResponse.data.destroy();
    });

    openaiResponse.data.on("data", (chunk) => {
      if (closed) return;

      buffer += chunk.toString("utf8");
      const parts = buffer.split("\n");
      buffer = parts.pop() || "";

      for (const line of parts) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;

        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") {
          writeSse(res, { type: "done" });
          res.end();
          return;
        }

        try {
          const parsed = JSON.parse(payload);
          const content = parsed?.choices?.[0]?.delta?.content;
          if (content) {
            writeSse(res, { type: "delta", content });
          }
        } catch (error) {
          console.error("OpenAI stream parse error:", error.message);
        }
      }
    });

    openaiResponse.data.on("end", () => {
      if (!closed) {
        writeSse(res, { type: "done" });
        res.end();
      }
    });

    openaiResponse.data.on("error", async (error) => {
      const status = error?.response?.status || error?.status;
      if (status === 429) {
        console.warn("OpenAI rate limit hit; falling back to local reply.");
      } else {
        console.error("OpenAI stream error:", error.message);
      }
      if (!res.headersSent) {
        return streamText(res, getLocalReply(message, products), products);
      }
      if (!closed) {
        writeSse(res, { type: "done" });
        res.end();
      }
    });
  } catch (error) {
    const status = error?.response?.status || error?.status;
    if (status === 429) {
      console.warn("OpenAI rate limit hit; using local fallback reply.");
    } else {
      console.error("Chat completion error:", error.message);
    }
    return streamText(res, getLocalReply(message, products), products);
  }
};
