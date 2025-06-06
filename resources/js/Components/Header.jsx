import { Link } from '@inertiajs/react';
import React, { useState } from "react";

export default function Header() {
    const [showAbout, setShowAbout] = useState(false);

    return (
        <header className="flex justify-between items-center p-4 bg-purple-100 fixed top-0 left-0 right-0 z-50 text-purple-700 shadow-md shadow-purple-500/30">
<Link
  href="/"
  className="text-2xl font-bold text-purple-700 transition-transform duration-200 hover:-translate-y-1 active:scale-95 active:translate-y-1"
>
  SnapBooth
</Link>



            <nav className="space-x-4">
                <button
  className="px-4 py-2 rounded-full bg-purple-200 text-purple-700 hover:bg-purple-300 hover:-translate-y-1 transition-transform transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 font-semibold"
  onClick={() => setShowAbout(true)}
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
            {showAbout && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center relative">
                        <h2 className="text-2xl font-bold mb-4 text-purple-700">
                            📸 About This Photo Booth
                        </h2>
                        <p className="text-gray-700 mb-4 text-sm">
                            This web-based photo booth allows users to capture
                            and customize photos directly from their browser
                            using a webcam or image upload. Choose your layout,
                            apply filters, add stickers, and download your final
                            photo strip — all in just a few clicks. It’s perfect
                            for events, virtual gatherings, or just for fun!
                        </p>
                        <p className="text-gray-500 text-xs">
                            Developed by{" "}
                            <span className="font-semibold text-purple-600">
                                Clent
                            </span>{" "}
                            — June 2025.
                        </p>
                        <button
                            onClick={() => setShowAbout(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
