import React from "react";

const Hero = () => (
  <section className="relative h-[60vh] flex items-center justify-center text-center">
    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />

    <img
      src="https://images.unsplash.com/photo-1606813902779-b47c8b3e61b7"
      className="absolute inset-0 w-full h-full object-cover"
    />

    <div className="relative z-10 text-white max-w-3xl px-4">
      <h1 className="text-5xl font-bold mb-4">
        Shop Smarter. Live Better.
      </h1>
      <p className="text-lg mb-6 opacity-90">
        Discover trending products curated just for you
      </p>
      <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
        Explore Now
      </button>
    </div>
  </section>
);
export default Hero;