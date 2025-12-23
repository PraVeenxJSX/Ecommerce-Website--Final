import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-indigo-500 to-pink-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">M</div>
            <div>
              <h3 className="text-lg font-bold text-white">E-COMMERCE</h3>
              <p className="text-sm text-gray-400">Quality products — curated for you</p>
            </div>
          </div>

          <p className="text-sm text-gray-400">
            Shop a wide range of electronics, fashion, home essentials and more.
            Fast delivery · Easy returns · Secure payments
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Mobiles</li>
            <li>Laptops</li>
            <li>Home Appliances</li>
            <li>Fashion</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Help Center</li>
            <li>Shipping & Returns</li>
            <li>Payment Options</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Newsletter</h4>
          <p className="text-sm text-gray-400 mb-3">Get updates on new products and offers.</p>

          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-500">Subscribe</button>
          </form>

          <div className="mt-4 flex items-center gap-3">
            <a className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-gray-200">
                <path d="M22 2.07L11.93 13.14 9 10.2 2 17.2 4.93 20.13 9 16.07l2.93 2.93L23 3.07z" />
              </svg>
            </a>
            <a className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-gray-200">
                <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 2.86 8.15 6.83 9.48.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.61-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.9.83.09-.65.35-1.08.64-1.33-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0112 6.8c.85.004 1.71.11 2.51.32 1.9-1.29 2.74-1.02 2.74-1.02.56 1.37.21 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.93.36.31.68.93.68 1.88 0 1.36-.013 2.45-.013 2.79 0 .27.18.59.69.49A9.98 9.98 0 0022 12c0-5.5-4.46-9.96-9.96-9.96z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© {new Date().getFullYear()} MERN-Shop. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-3 md:mt-0">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
