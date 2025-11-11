import React from "react";

export default function Header() {
  return (
    <header
      className="flex items-center justify-center gap-3 bg-white/30 backdrop-blur-md fixed top-0 left-0 w-full shadow-sm py-2 z-50 cursor-pointer"
      onClick={() => (window.location.href = "/")}
    >
      <img
        src="/College_Logo_GDC.png"
        alt="GDC Logo"
        className="w-10 h-10 rounded-lg"
      />
      <h1 className="text-xl font-bold text-[#004aad] tracking-wide">
        GDC-2039
      </h1>
    </header>
  );
}
