import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { router } from "@inertiajs/react"; // Inertia router

const PhotoBooth = ({ layout, mode, onReset }) => {
    const [currentMode, setCurrentMode] = useState(null);
    const [imageSrcs, setImageSrcs] = useState([]);
    const webcamRef = useRef(null);

    useEffect(() => {
        setCurrentMode(mode);
    }, [mode]);

    const capture = () => {
        if (imageSrcs.length >= layout) return;
        const image = webcamRef.current.getScreenshot();
        setImageSrcs((prev) => [...prev, image]);
    };

    const handleUpload = (e) => {
        const files = Array.from(e.target.files).slice(
            0,
            layout - imageSrcs.length
        );
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrcs((prev) => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleEdit = () => {
        // Save images and layout to localStorage before navigating
        localStorage.setItem("photobooth-images", JSON.stringify(imageSrcs));
        localStorage.setItem("photobooth-layout", layout.toString());

        router.visit("/customize", {
            preserveState: true,
        });
    };

    const handleResetImages = () => {
        setImageSrcs([]);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-4">
                📸 Photobooth — {layout} Photo{layout > 1 ? "s" : ""}
            </h1>

            <div className="mb-4 flex gap-2">
                <button
                    onClick={onReset}
                    className="bg-gray-200 px-4 py-2 rounded"
                >
                    ← Back
                </button>

                {currentMode === "camera" && imageSrcs.length > 0 && (
                    <button
                        onClick={handleResetImages}
                        className="bg-yellow-400 text-white px-4 py-2 rounded"
                    >
                        🔁 Retake
                    </button>
                )}

                {currentMode === "upload" && imageSrcs.length > 0 && (
                    <button
                        onClick={handleResetImages}
                        className="bg-blue-400 text-white px-4 py-2 rounded"
                    >
                        🔁 Re-upload
                    </button>
                )}

                {imageSrcs.length === layout && (
                    <button
                        onClick={handleEdit}
                        className="bg-purple-600 text-white px-4 py-2 rounded"
                    >
                        ✏️ Edit Photo
                    </button>
                )}
            </div>

            {currentMode === "camera" && imageSrcs.length < layout && (
                <>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={320}
                        height={240}
                        className="mb-4 border rounded"
                    />
                    <button
                        onClick={capture}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        📸 Capture
                    </button>
                </>
            )}

            {currentMode === "upload" && imageSrcs.length < layout && (
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUpload}
                    className="mb-4"
                />
            )}

            {imageSrcs.length > 0 && (
                <div className="mt-6 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {imageSrcs.map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            alt={`Preview ${i + 1}`}
                            className="border rounded w-full"
                        />
                    ))}
                </div>
            )}

            {imageSrcs.length >= layout && (
                <p className="mt-4 text-green-600 font-semibold">
                    ✅ All {layout} photos captured!
                </p>
            )}
        </div>
    );
};

export default PhotoBooth;
