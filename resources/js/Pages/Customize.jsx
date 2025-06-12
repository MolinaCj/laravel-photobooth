import React, { useEffect, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import html2canvas from "html2canvas";

import Layout from "../Layouts/Layout";

const Customize = () => {
    const [images, setImages] = useState([]);
    const [style, setStyle] = useState("normal"); // 'normal' or 'film'
    const [showDate, setShowDate] = useState(true);
    const [filter, setFilter] = useState("none");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [stripColor, setStripColor] = useState("#000000");
    const [isStripNone, setIsStripNone] = useState(true); // "None" checkbox initially checked
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [showMobilePreview, setShowMobilePreview] = useState(false);

    const [stickers, setStickers] = useState([
        "🎉",
        "🌟",
        "😎",
        "💖",
        "🔥",
        "🍀",
        "✨",
        "💥",
        "🐱",
        "🥷",
        "🌈",
        "🎈",
        "🍓",
        "🎵",
    ]);
    const [newSticker, setNewSticker] = useState("");

    useEffect(() => {
        const storedImages =
            JSON.parse(localStorage.getItem("photobooth-images")) || [];
        setImages(storedImages);
    }, []);

    const currentDate = new Date().toLocaleDateString();

    const filterClasses = {
        none: "",
        vintage: "contrast-125 sepia",
        sepia: "sepia",
        bw: "grayscale",
        retro1: "contrast-125 saturate-150 hue-rotate-[-10deg] brightness-110",
        retro2: "sepia-[0.5] contrast-110 brightness-95",
        retro3: "hue-rotate-[15deg] saturate-75 brightness-105",
        warm: "sepia-[0.3] brightness-110 hue-rotate-[-10deg]",
        cool: "contrast-110 hue-rotate-[180deg] saturate-125",
        cold: "brightness-95 hue-rotate-[220deg] saturate-75",
    };

    const filterStyles = {
        none: "",
        vintage: "contrast(1.25) sepia(1)",
        sepia: "sepia(1)",
        bw: "grayscale(1)",
        retro1: "contrast(1.25) saturate(1.5) hue-rotate(-10deg) brightness(1.1)",
        retro2: "sepia(0.5) contrast(1.1) brightness(0.95)",
        retro3: "hue-rotate(15deg) saturate(0.75) brightness(1.05)",
        warm: "sepia(0.3) brightness(1.1) hue-rotate(-10deg)",
        cool: "contrast(1.1) hue-rotate(180deg) saturate(1.25)",
        cold: "brightness(0.95) hue-rotate(220deg) saturate(0.75)",
    };

    // const stickers = ["🎉", "🌟", "😎", "💖"];

    // Render a single photo with optional sticker overlay and filter
    const applySticker = (img, index) => (
        <div
            key={index}
            className="relative border-4 rounded-md"
            style={{
                borderColor: isStripNone ? "transparent" : stripColor,
                width: "160px",
                margin: "8px 0",
            }}
        >
            <img
                src={img}
                alt={`Captured ${index}`}
                className={`w-full ${filterClasses[filter]}`}
            />
            {selectedSticker && (
                <div className="absolute top-1 left-1 text-2xl pointer-events-none">
                    {selectedSticker}
                </div>
            )}
        </div>
    );

    // For download
const handleDownload = () => {
    const original = document.querySelector(".p-4.relative");
    if (!original) return;

    const cloneWrapper = original.closest(".preview-scale-wrapper");
    if (!cloneWrapper) return;

    const clone = cloneWrapper.cloneNode(true);

    // Re-apply filters to all image elements
    const originalImages = cloneWrapper.querySelectorAll("img");
    const clonedImages = clone.querySelectorAll("img");

    originalImages.forEach((img, index) => {
        const originalFilter = img.style.filter;
        if (clonedImages[index]) {
            clonedImages[index].style.filter = originalFilter;
        }
    });

    const replaceImagesWithCanvas = async (container) => {
        const imgElements = container.querySelectorAll("img");

        await Promise.all(
            Array.from(imgElements).map((img) => {
                return new Promise((resolve) => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    const width = img.naturalWidth;
                    const height = img.naturalHeight;

                    canvas.width = width;
                    canvas.height = height;

                    ctx.filter = img.style.filter || "none";
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.style.width = img.style.width || img.width + "px";
                    canvas.style.height = img.style.height || img.height + "px";
                    canvas.style.objectFit = img.style.objectFit || "contain";

                    img.replaceWith(canvas);
                    resolve();
                });
            })
        );
    };

    const hiddenContainer = document.createElement("div");
    hiddenContainer.style.position = "fixed";
    hiddenContainer.style.top = "-10000px";
    hiddenContainer.style.left = "-10000px";
    hiddenContainer.style.zIndex = "-1";

    // 🔍 Set the clone to match the on-screen pixel width of the preview
    const pixelWidth = cloneWrapper.getBoundingClientRect().width + "px";
    hiddenContainer.style.width = pixelWidth;
    clone.style.width = pixelWidth; // Apply to inner content

    hiddenContainer.appendChild(clone);
    document.body.appendChild(hiddenContainer);

    // Fix Date Font/Layout
    const dateInClone = clone.querySelector(".text-xs.font-cursive");
    if (dateInClone) {
        const computed = getComputedStyle(dateInClone);
        dateInClone.style.fontFamily = computed.fontFamily;
        dateInClone.style.fontSize = computed.fontSize;
        dateInClone.style.color = computed.color;
        dateInClone.style.backgroundColor = computed.backgroundColor;
        dateInClone.style.padding = computed.padding;
        dateInClone.style.boxShadow = computed.boxShadow;
        dateInClone.style.textAlign = "center";
        dateInClone.style.marginTop = "0";
        dateInClone.style.position = "relative";
        dateInClone.style.top = "-6px";
        dateInClone.style.transform = "translateY(4px)";
    }

    const dateWrapper = clone.querySelector(".mt-4.flex.justify-center");
    if (dateWrapper) {
        dateWrapper.style.marginTop = "0";
        dateWrapper.style.height = "2rem";
        dateWrapper.style.overflow = "hidden";
        dateWrapper.style.display = "flex";
        dateWrapper.style.justifyContent = "center";
    }

    const waitForImages = (container) => {
        const imgs = container.querySelectorAll("img");
        return Promise.all(
            Array.from(imgs).map((img) =>
                img.complete && img.naturalHeight !== 0
                    ? Promise.resolve()
                    : new Promise((resolve) => {
                          img.onload = img.onerror = () => resolve();
                      })
            )
        );
    };

    requestAnimationFrame(() => {
        waitForImages(clone)
            .then(() => replaceImagesWithCanvas(clone))
            .then(() =>
                html2canvas(clone, {
                    scale: 5,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: null,
                    width: clone.offsetWidth,
                    windowWidth: clone.offsetWidth,
                })
            )
            .then((canvas) => {
                const dataUrl = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = "photostrip.png";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((err) => {
                console.error("html2canvas error:", err);
                alert("Failed to capture image.");
            })
            .finally(() => {
                if (hiddenContainer.parentNode) {
                    document.body.removeChild(hiddenContainer);
                }
            });
    });
};

    //For Print
    // const handlePrint = () => {
    //     const original = document.querySelector(".p-4.w-fit.relative");
    //     if (!original) return;

    //     const cloneWrapper = original.closest(".preview-scale-wrapper");
    //     const clone = cloneWrapper.cloneNode(true);

    //     // Remove scale classes to avoid distortions
    //     clone.classList.remove(
    //         "scale-[0.6]",
    //         "scale-[0.75]",
    //         "scale-[0.9]",
    //         "scale-100"
    //     );

    //     const hiddenContainer = document.createElement("div");
    //     hiddenContainer.style.position = "fixed";
    //     hiddenContainer.style.top = "-10000px";
    //     hiddenContainer.style.left = "-10000px";
    //     hiddenContainer.style.zIndex = "-1";
    //     hiddenContainer.appendChild(clone);
    //     document.body.appendChild(hiddenContainer);

    //     requestAnimationFrame(() => {
    //         html2canvas(clone, { scale: 2 }).then((canvas) => {
    //             const dataUrl = canvas.toDataURL("image/png");

    //             const printWindow = window.open("", "_blank");

    //             if (!printWindow) {
    //                 alert("Please allow popups for this site to print.");
    //                 document.body.removeChild(hiddenContainer);
    //                 return;
    //             }

    //             printWindow.document.write(`
    //             <html lang="en">
    //                 <head>
    //                     <style>
    //                         @page {
    //                             margin: 0;
    //                         }
    //                         html, body {
    //                             margin: 0;
    //                             padding: 0;
    //                             background: white;
    //                             width: 100vw;
    //                             height: 100vh;
    //                         }
    //                         body {
    //                             padding: 0;
    //                         }
    //                         img {
    //                             display: block;
    //                             width: auto;
    //                             height: auto;
    //                             max-width: 80vw;
    //                             max-height: 80vh;
    //                             box-shadow: none !important;
    //                         }
    //                     </style>
    //                 </head>
    //                 <body>
    //                     <img src="${dataUrl}" onload="window.focus(); window.print(); window.onafterprint = () => window.close();" />
    //                 </body>
    //             </html>
    //         `);
    //             printWindow.document.close();

    //             document.body.removeChild(hiddenContainer);
    //         });
    //     });
    // };


    return (
        <Layout>
            <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex flex-col items-center justify-start pt-10 pb-16 px-4 md:px-6 overflow-y-auto">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-6 text-center">
                    🎨 Customize Your Strip
                </h1>

                {/* Content Section (Preview + Controls) */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-fit mx-auto">
                    {/* Controls Section */}
                    <div className="w-full md:w-96 mx-auto bg-white p-6 rounded-xl shadow-lg border border-purple-100">
                        {/* Style & Date Toggle */}
                        <div className="space-y-4">
                            <div className="font-semibold text-purple-800 text-sm">
                                Template
                            </div>
                            <div className="flex items-center gap-6">
                                <label className="cursor-pointer text-purple-700 font-medium flex items-center">
                                    <input
                                        type="radio"
                                        name="style"
                                        value="normal"
                                        checked={style === "normal"}
                                        onChange={() => setStyle("normal")}
                                        className="mr-2 accent-purple-600"
                                    />
                                    Normal
                                </label>
                                <label className="cursor-pointer text-purple-700 font-medium flex items-center">
                                    <input
                                        type="radio"
                                        name="style"
                                        value="film"
                                        checked={style === "film"}
                                        onChange={() => setStyle("film")}
                                        className="mr-2 accent-purple-600"
                                    />
                                    Film Strip
                                </label>
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer select-none text-purple-800 font-semibold">
                                <input
                                    type="checkbox"
                                    checked={showDate}
                                    onChange={() => setShowDate(!showDate)}
                                    className="w-5 h-5 rounded-md accent-pink-600 shadow-sm transition duration-200 ease-in-out focus:ring-2 focus:ring-pink-400"
                                />
                                <span className="text-lg">Show Date</span>
                            </label>
                        </div>

                        {/* Filters */}
                        <div>
                            <div className="font-semibold text-purple-800 mb-2 text-sm">
                                Filter
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    "none",
                                    "vintage",
                                    "sepia",
                                    "bw",
                                    "retro1",
                                    "retro2",
                                    "retro3",
                                    "warm",
                                    "cool",
                                    "cold",
                                ].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        type="button"
                                        className={`px-4 py-1.5 rounded-full border text-sm transition-transform duration-300 shadow-sm
                                            ${
                                                filter === f
                                                    ? "bg-pink-600 text-white border-pink-600"
                                                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:-translate-y-1"
                                            }
                                          `}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Pickers */}
                        <div className="flex gap-6">
                            {/* Background Color Picker – UNCHANGED */}
                            <div>
                                <label className="block text-sm font-medium text-purple-800 mb-1">
                                    Background
                                </label>
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="w-12 h-8 border rounded cursor-pointer"
                                    aria-label="Select background color"
                                />
                            </div>

                            {/* Strip Border Color Picker with "None" option */}
                            <div>
                                <label className="block text-sm font-medium text-purple-800 mb-1">
                                    Strip Border
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={stripColor}
                                        onChange={(e) => {
                                            const newColor = e.target.value;
                                            setStripColor(newColor);
                                            setIsStripNone(false); // uncheck "None" when color is picked
                                        }}
                                        disabled={isStripNone}
                                        className={`w-12 h-8 border rounded cursor-pointer ${
                                            isStripNone
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                        aria-label="Select strip border color"
                                    />
                                    <label className="text-sm text-purple-700 flex items-center gap-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isStripNone}
                                            onChange={(e) => {
                                                setIsStripNone(
                                                    e.target.checked
                                                );
                                            }}
                                            className="accent-purple-600"
                                        />
                                        None
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Stickers */}
                        <div>
                            <label className="block font-semibold text-purple-800 mb-2">
                                Sticker
                            </label>

                            <div className="flex items-center flex-wrap gap-3 mb-3">
                                {stickers.map((emoji, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setSelectedSticker(emoji)
                                        }
                                        className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${
                                            selectedSticker === emoji
                                                ? "scale-110 drop-shadow"
                                                : ""
                                        }`}
                                        type="button"
                                        aria-pressed={selectedSticker === emoji}
                                        aria-label={`Select sticker ${emoji}`}
                                    >
                                        {emoji}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setSelectedSticker(null)}
                                    type="button"
                                    className="ml-2 text-sm text-blue-600 underline transition-colors duration-300 hover:text-red-800 hover:-translate-y-1 focus:outline-none"
                                >
                                    Clear
                                </button>
                            </div>

                            {/* Input + Add button for new sticker */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    maxLength={2}
                                    value={newSticker}
                                    onChange={(e) =>
                                        setNewSticker(e.target.value)
                                    }
                                    placeholder="Add emoji"
                                    aria-label="Add new emoji"
                                    className="border border-gray-300 rounded-md px-2 py-1 text-base w-full focus:ring-2 focus:ring-pink-400 focus:outline-none"
                                />
                                <button
                                    onClick={() => {
                                        if (
                                            newSticker.trim() &&
                                            !stickers.includes(
                                                newSticker.trim()
                                            )
                                        ) {
                                            setStickers([
                                                ...stickers,
                                                newSticker.trim(),
                                            ]);
                                            setNewSticker("");
                                        }
                                    }}
                                    type="button"
                                    className="bg-pink-600 text-white rounded-md px-3 py-1 text-sm hover:bg-pink-700 transition focus:outline-none focus:ring-2 focus:ring-pink-500"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons: Download, Preview, Retake */}
                        <div className="pt-4 border-t border-purple-100 space-y-3">
                            {/* Download Button */}
                            <button
                                type="button"
                                onClick={handleDownload}
                                className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg shadow
             hover:bg-purple-700 transition-transform transform hover:-translate-y-1
             active:scale-95"
                            >
                                Download Strip
                            </button>

                            {/* Print Button */}
                            {/* <button
                                type="button"
                                onClick={handlePrint}
                                className="w-full py-2 px-4 bg-blue-400 text-white font-semibold rounded-lg shadow hover:bg-blue-500 transition mt-2"
                            >
                                Print Strip
                            </button> */}

                            {/* Preview Button (Mobile Modal) */}
                            <button
                                type="button"
                                onClick={() => setShowMobilePreview(true)}
                                className="w-full py-2 px-4 bg-pink-500 text-white font-semibold rounded-lg shadow
             hover:bg-pink-600 transition-transform transform hover:-translate-y-1
             active:scale-95"
                            >
                                Preview
                            </button>

                            {/* Retake Button */}
                            <button
                                type="button"
                                onClick={() => router.visit("/")} // Redirects to Landing page
                                className="w-full py-2 px-4 bg-yellow-400 text-purple-800 font-semibold rounded-lg shadow
             hover:bg-yellow-500 transition-transform transform hover:-translate-y-1
             active:scale-95"
                            >
                                Create New
                            </button>
                        </div>
                    </div>

                    {/* Preview Section Wrapper */}
                    <div className="w-full flex justify-center px-4">
                        <div className="preview-scale-wrapper mx-auto"
                        style={{
                                width: "200px", // consistent download + layout
                                maxWidth: "100%", // responsive fallback
                            }}
                            >
                            <div
                                className="p-4 relative"
                                style={{
                                    backgroundColor:
                                        style === "film"
                                            ? "black"
                                            : bgColor || "#E9D8FD",
                                    boxShadow:
                                        "0 20px 40px rgba(0, 0, 0, 0.35)",
                                }}
                            >
                                {/* Left sprockets for film */}
                                {style === "film" && images.length > 0 && (
                                    <div className="absolute top-0 bottom-0 left-0 z-10 flex flex-col justify-between items-center px-1 py-4 h-full">
                                        {[...Array(12)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-4 bg-white"
                                                style={{ borderRadius: "1px" }}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Image strip container */}
                                <div className="relative px-4 py-3 flex flex-col items-center gap-4">
                                    {images.length === 0 ? (
                                        <p className="text-center text-gray-500">
                                            No images to display.
                                        </p>
                                    ) : (
                                        images.map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-white rounded overflow-hidden shadow"
                                                style={{
                                                    border: isStripNone
                                                        ? "none"
                                                        : `4px solid ${stripColor}`,
                                                    transition:
                                                        "border 0.2s ease-in-out",
                                                }}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Image ${index + 1}`}
                                                    className={`w-full h-full object-contain`}
                                                    style={{
                                                        filter: filterStyles[
                                                            filter
                                                        ],
                                                    }}
                                                />

                                                {/* Sticker overlay */}
                                                {selectedSticker && (
                                                    <div
                                                        className="absolute text-2xl pointer-events-none select-none"
                                                        aria-hidden="true"
                                                        style={{
                                                            top: "4px",
                                                            left: "4px",
                                                            position:
                                                                "absolute",
                                                            pointerEvents:
                                                                "none",
                                                        }}
                                                    >
                                                        {selectedSticker}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Right sprockets for film */}
                                {style === "film" && images.length > 0 && (
                                    <div className="absolute top-0 bottom-0 right-0 z-10 flex flex-col justify-between items-center px-1 py-4 h-full">
                                        {[...Array(12)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-4 bg-white"
                                                style={{ borderRadius: "1px" }}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Date display */}
                                {showDate && (
                                    <div className="mt-4 flex justify-center">
                                        <div className="bg-white px-4 py-1 shadow text-xs font-cursive text-black select-none">
                                            {currentDate}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Preview Section Wrapper with Responsive Scale */}
                </div>
            </div>

            {/* PREVIEW MODAL */}
            {showMobilePreview && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-2">
                    <div className="relative max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowMobilePreview(false)}
                            className="absolute top-2 right-2 text-white text-2xl z-50"
                            title="Close"
                        >
                            ✖
                        </button>

                        {/* Scaled Preview */}
                        <div className="w-full inline-block origin-top scale-[0.6] sm:scale-[0.75] md:scale-[0.9] lg:scale-100">
                            <div
                                className="p-4 w-full relative"
                                style={{
                                    backgroundColor:
                                        style === "film"
                                            ? "black"
                                            : bgColor || "#E9D8FD",
                                    boxShadow:
                                        "0 20px 40px rgba(0, 0, 0, 0.35)",
                                }}
                            >
                                {/* Left sprockets for film */}
                                {style === "film" && images.length > 0 && (
                                    <div className="absolute top-0 bottom-0 left-0 z-10 flex flex-col justify-between items-center px-1 py-4 h-full">
                                        {[...Array(12)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-4 bg-white"
                                                style={{ borderRadius: "1px" }}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Image strip container */}
                                <div className="relative px-4 py-3 flex flex-col items-center gap-4">
                                    {images.length === 0 ? (
                                        <p className="text-center text-gray-500">
                                            No images to display.
                                        </p>
                                    ) : (
                                        images.map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-white rounded overflow-hidden shadow"
                                                style={{
                                                    border: isStripNone
                                                        ? "none"
                                                        : `4px solid ${stripColor}`,
                                                    transition:
                                                        "border 0.2s ease-in-out",
                                                }}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Image ${index + 1}`}
                                                    className={`w-full h-full object-contain ${filterClasses[filter]}`}
                                                />

                                                {/* Sticker overlay */}
                                                {selectedSticker && (
                                                    <div
                                                        className="absolute top-1 left-1 text-2xl pointer-events-none select-none"
                                                        aria-hidden="true"
                                                    >
                                                        {selectedSticker}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Right sprockets for film */}
                                {style === "film" && images.length > 0 && (
                                    <div className="absolute top-0 bottom-0 right-0 z-10 flex flex-col justify-between items-center px-1 py-4 h-full">
                                        {[...Array(12)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-4 bg-white"
                                                style={{ borderRadius: "1px" }}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Date display */}
                                {showDate && (
                                    <div className="mt-4 flex justify-center">
                                        <div className="bg-white px-4 py-1 shadow text-xs font-cursive text-black select-none">
                                            {currentDate}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Customize;
