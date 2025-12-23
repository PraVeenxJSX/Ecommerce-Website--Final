import React from "react";

const deals = [
  {
    title: "Mobiles",
    offer: "Up to 40% Off",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
  {
    title: "Laptops",
    offer: "Exchange Offers",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  },
  {
    title: "Home Appliances",
    offer: "Starting ₹999",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
  },
  {
    title: "Fashion",
    offer: "Min 50% Off",
    image:
      "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47",
  },
];

const Deals = () => {
  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
      {deals.map((deal, i) => (
        <div
          key={i}
          className="relative rounded-lg overflow-hidden shadow hover:shadow-lg transition"
        >
          <img
            src={deal.image}
            alt={deal.title}
            className="h-48 w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
            <h3 className="font-semibold text-lg">{deal.title}</h3>
            <p className="text-sm">{deal.offer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Deals;
