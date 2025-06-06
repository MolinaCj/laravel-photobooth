import React, { useEffect, useState } from "react";
import Modal from "../Components/LandingModal";
import PhotoBooth from "../components/PhotoBooth";
import Layout from "../Layouts/Layout";

const stickers = ["📸", "⭐", "✨", "🎉", "📷", "💫", "🎞️"];

function getRandomFontSize() {
    return Math.random() * 2 + 3; // 3rem to 5rem
}

function getRandomPositionAvoidCenter() {
    function randPercentExcludeRange(start, end) {
        const lowerRange = Math.random() < 0.5;
        if (lowerRange) {
            return Math.random() * start;
        } else {
            return end + Math.random() * (100 - end);
        }
    }

    const top = randPercentExcludeRange(30, 70);
    const left = randPercentExcludeRange(30, 70);

    return {
        top: `${top}%`,
        left: `${left}%`,
        animationDelay: `${Math.random() * 3}s`,
        fontSize: `${getRandomFontSize()}rem`,
    };
}

export default function Landing() {
    const [showModal, setShowModal] = useState(false);
    const [layout, setLayout] = useState(null);
    const [mode, setMode] = useState(null);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        setPositions(stickers.map(() => getRandomPositionAvoidCenter()));
    }, []);

    const handleLayoutSelect = (selectedLayout) => {
        setLayout(selectedLayout);
        setShowModal(false);
    };

    const handleReset = () => {
        setLayout(null);
        setShowModal(false);
        setMode(null);
    };

    return (
        <Layout>
            <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 -z-10" />

            <div className="fixed inset-0 -z-10 pointer-events-none">
                {stickers.map((sticker, index) => {
                    const pos = positions[index] || {};
                    const sizeRem = parseFloat(pos.fontSize) || 3;
                    const sizePx = sizeRem * 16;
                    const style = {
                        position: "absolute",
                        animationDelay: pos.animationDelay,
                        fontSize: pos.fontSize,
                        top: pos.top,
                        left: pos.left,
                        userSelect: "none",
                    };

                    return (
                        <span
                            key={index}
                            className="animate-float"
                            style={style}
                            role="img"
                            aria-label="sticker"
                        >
                            {sticker}
                        </span>
                    );
                })}
            </div>

            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] px-6 text-center max-w-3xl mx-auto">
                {!layout && (
                    <>
                        <h2 className="text-5xl font-extrabold mb-6 text-purple-700 drop-shadow-md">
                            Welcome to SnapBooth!
                        </h2>
                        <p className="text-xl text-gray-700 mb-4 max-w-xl leading-relaxed">
                            Capture the moment, your way —{" "}
                            <span className="font-semibold text-purple-800">
                                snap a selfie
                            </span>
                            ,{" "}
                            <span className="font-semibold text-purple-800">
                                upload your best shot
                            </span>
                            , and customize your photo strip with fun layouts,
                            colors, and emojis.
                        </p>
                        <p className="text-2xl font-semibold text-pink-600 mb-10">
                            Let’s create something unforgettable together!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <button
                                onClick={() => {
                                    setMode("camera");
                                    setShowModal(true);
                                }}
                                className="bg-purple-600 hover:bg-purple-700 transition-colors duration-300 text-white px-8 py-3 rounded-full shadow-lg shadow-purple-300/50 font-semibold transform hover:-translate-y-1 transition-transform duration-300"
                            >
                                Take a Picture
                            </button>
                            <button
                                onClick={() => {
                                    setMode("upload");
                                    setShowModal(true);
                                }}
                                className="bg-pink-500 hover:bg-pink-600 transition-colors duration-300 text-white px-8 py-3 rounded-full shadow-lg shadow-pink-300/50 font-semibold transform hover:-translate-y-1 transition-transform duration-300"
                            >
                                Upload a Picture
                            </button>
                        </div>
                    </>
                )}

                {showModal && (
                    <Modal
                        onClose={() => setShowModal(false)}
                        onLayoutSelect={handleLayoutSelect}
                    />
                )}

                {layout && (
                    <div className="mt-10 w-full">
                        <PhotoBooth
                            layout={layout}
                            mode={mode}
                            onReset={handleReset}
                        />
                    </div>
                )}
            </div>

            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
        </Layout>
    );
}
