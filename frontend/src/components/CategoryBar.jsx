import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useRef } from "react";
import { CATEGORIES } from "../constants/categories";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const CategoryBar = () => {
  const location = useLocation();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const scrollAmount = 200;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-white border-b sticky top-[64px] z-40">
      <div className="relative flex items-center">
        {/* LEFT ARROW */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 h-full px-2 bg-gradient-to-r from-white to-transparent rounded-r"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>

        {/* CATEGORY LIST */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-6 md:px-10 py-3 scrollbar-hide no-scrollbar touch-pan-x"
        >
          {CATEGORIES.map((cat) => {
            const isActive =
              location.pathname === `/category/${cat}`;

            return (
              <Link
                key={cat}
                to={`/category/${cat}`}
                className={`whitespace-nowrap font-medium pb-1 border-b-2 transition px-2 py-1 rounded ${
                  isActive
                    ? "text-blue-600 border-blue-600 bg-blue-50"
                    : "text-gray-700 border-transparent hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 h-full px-2 bg-gradient-to-l from-white to-transparent"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default CategoryBar;
