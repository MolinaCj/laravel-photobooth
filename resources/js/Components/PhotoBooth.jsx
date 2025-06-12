import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { router } from "@inertiajs/react"; // Inertia router
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage"; // we'll create this helper

const PhotoBooth = ({ layout, mode, onReset }) => {
    const [currentMode, setCurrentMode] = useState(null);
    const [imageSrcs, setImageSrcs] = useState([]);
    const webcamRef = useRef(null);
    const [autoCapturing, setAutoCapturing] = useState(false);

    const [countdown, setCountdown] = useState(null);
    const captureIntervalRef = useRef(null);
    const countdownRef = useRef(null);

    // FOR CROPPING
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);


    useEffect(() => {
        setCurrentMode(mode);
    }, [mode]);

    const capture = () => {
        if (imageSrcs.length >= layout) return;

        const screenshot = webcamRef.current.getScreenshot();
        if (!screenshot) return;

        // Create a canvas and flip the image horizontally
        const image = new Image();
        image.src = screenshot;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;

            const ctx = canvas.getContext("2d");

            // Flip horizontally
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);

            ctx.drawImage(image, 0, 0);

            const flippedImage = canvas.toDataURL("image/jpeg");

            setImageSrcs((prev) => [...prev, flippedImage]);
        };
    };

    const startAutoCapture = () => {
        if (autoCapturing || imageSrcs.length >= layout) return;
        setAutoCapturing(true);
        let currentCount = 3;

        const captureNext = () => {
            if (imageSrcs.length >= layout) {
                setAutoCapturing(false);
                setCountdown(null);
                return;
            }

            currentCount = 3;
            setCountdown(currentCount);

            countdownRef.current = setInterval(() => {
                currentCount--;
                if (currentCount > 0) {
                    setCountdown(currentCount);
                } else {
                    clearInterval(countdownRef.current);
                    setCountdown(null);
                    capture(); // perform capture
                    setTimeout(captureNext, 1000); // wait before next round
                }
            }, 1000);
        };

        captureNext();
    };

    useEffect(() => {
        return () => clearInterval(countdownRef.current); // cleanup on unmount
    }, []);

    const handleUpload = (e) => {
        const files = Array.from(e.target.files).slice(0, layout - imageSrcs.length);
        if (files.length === 0) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setCurrentImage(reader.result);  // temporarily store uploaded image
            setShowCropper(true);            // open cropper
        };
        reader.readAsDataURL(files[0]); // handle one at a time for cropping
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
        setAutoCapturing(false); // stop any auto capture in progress
        setCountdown(null); // hide countdown if showing
        clearInterval(countdownRef.current); // clear any ongoing countdown
    };

    const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropSave = async () => {
    try {
        const croppedImage = await getCroppedImg(currentImage, croppedAreaPixels);
        setImageSrcs((prev) => [...prev, croppedImage]);
        setShowCropper(false);
        setCurrentImage(null);
    } catch (error) {
        console.error("Cropping failed:", error);
        alert("Something went wrong while cropping.");
    }
};



    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-4">
                📸 Photobooth — {layout} Photo{layout > 1 ? "s" : ""}
            </h1>

            <div className="mb-4 flex gap-2">
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium shadow transition-all duration-200 transition-transform hover:-translate-y-1 active:scale-95"
                >
                    ← <span>Back</span>
                </button>

                {currentMode === "camera" && imageSrcs.length > 0 && (
                    <button
                        onClick={handleResetImages}
                        className="bg-yellow-400 text-white px-4 py-2 rounded transition-transform hover:-translate-y-1 transition-all duration-200 active:scale-95"
                    >
                        🔁 Retake
                    </button>
                )}

                {currentMode === "upload" && imageSrcs.length > 0 && (
                    <button
                        onClick={handleResetImages}
                        className="bg-blue-400 text-white px-4 py-2 rounded transition-transform hover:-translate-y-1 transition-all duration-200 active:scale-95"
                    >
                        🔁 Re-upload
                    </button>
                )}

                {imageSrcs.length === layout && (
                    <button
                        onClick={handleEdit}
                        className="bg-purple-600 text-white px-4 py-2 rounded transition-transform hover:-translate-y-1 transition-all duration-200 active:scale-95"
                    >
                        ✏️ Edit Photo
                    </button>
                )}
            </div>

            {currentMode === "camera" && imageSrcs.length < layout && (
                <div className="relative flex flex-col items-center gap-4">
                    <div
                        className="relative"
                        style={{ width: "2in", height: "2in" }}
                    >
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                                width: 480,
                                height: 480, // Force a square resolution
                                facingMode: "user", // Front camera for mobile
                            }}
                            className="rounded-xl border-2 border-purple-500 shadow-md transition-all duration-300 transform scale-x-[-1] object-cover"
                            style={{ width: "2in", height: "2in" }}
                        />

                        {/* Countdown Overlay */}
                        {countdown && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-6xl font-bold text-white drop-shadow-lg pointer-events-none">
                                    {countdown}
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={startAutoCapture}
                        disabled={autoCapturing || imageSrcs.length >= layout}
                        className="flex items-center gap-2 px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow transition-all duration-200 transition-transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>📸</span>
                        <span>
                            {autoCapturing ? "Capturing..." : "Capture"}
                        </span>
                    </button>
                </div>
            )}

            {currentMode === "upload" && imageSrcs.length < layout && (
                <div className="flex flex-col items-center gap-4">
                    <label
                        htmlFor="photo-upload"
                        className="cursor-pointer px-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-medium shadow transition-all duration-200 transition-transform hover:-translate-y-1 active:scale-95"
                    >
                        ➕ Upload Photos
                    </label>

                    <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleUpload}
                        className="hidden"
                    />
                    <p className="text-sm text-gray-500">
                        You can upload up to {layout} images
                    </p>
                </div>
            )}

            {imageSrcs.length > 0 && (
                <div className="mt-6 w-full max-w-4xl flex flex-wrap gap-4 justify-center items-center">
                    {imageSrcs.map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            alt={`Preview ${i + 1}`}
                            className="rounded border w-24 h-20 object-cover"
                        />
                    ))}
                </div>
            )}

            {imageSrcs.length >= layout && (
                <p className="mt-4 text-green-600 font-semibold">
                    ✅ All {layout} photos captured!
                </p>
            )}

            {showCropper && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
                    <div className="bg-white p-4 rounded-lg w-full max-w-md sm:max-w-lg">
                        <div className="relative w-full aspect-square">
                            <Cropper
                                image={currentImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                            <button
                                onClick={() => setShowCropper(false)}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded hover:bg-gray-400  text-black font-medium shadow transition-all duration-200 transition-transform hover:-translate-y-1 active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCropSave}
                                className="w-full sm:w-auto px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 text-white font-medium shadow transition-all duration-200 transition-transform hover:-translate-y-1 active:scale-95"
                            >
                                Crop & Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoBooth;
