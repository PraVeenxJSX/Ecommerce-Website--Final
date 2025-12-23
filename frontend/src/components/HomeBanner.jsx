import React, { useState, useEffect } from "react";

const banners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    title: "Big Electronics Sale",
    subtitle: "Up to 50% off on Mobiles & Laptops",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    title: "Fashion Fest",
    subtitle: "Trending styles for Men & Women",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e17b",
    title: "Home Essentials",
    subtitle: "Upgrade your home today",
  },
];

const HomeBanner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[320px] w-full overflow-hidden">
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center">
            <div className="px-10 text-white">
              <h2 className="text-4xl font-bold mb-2">
                {banner.title}
              </h2>
              <p className="text-lg">{banner.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeBanner;
