import React from "react";

export default function Header() {
  return (
<header className="flex justify-between items-center p-4 bg-purple-100 fixed top-0 left-0 right-0 z-50 text-purple-700 shadow-md shadow-purple-500/30">
  <h1 className="text-2xl font-bold text-purple-700">SnapBooth</h1>
  <nav className="space-x-4">
    <button
      className="px-4 py-2 rounded-full bg-purple-200 text-purple-700 hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors font-semibold"
      onClick={() => alert("About clicked")}
    >
      About
    </button>
    {/* <button
      className="px-4 py-2 rounded-full bg-purple-200 text-purple-700 hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors font-semibold"
      onClick={() => alert("Help clicked")}
    >
      Help
    </button> */}
  </nav>
</header>
  );
}

