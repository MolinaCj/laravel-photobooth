// resources/js/components/PhotoBooth.jsx

import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

const PhotoBooth = () => {
  const [mode, setMode] = useState(null); // 'camera' or 'upload'
  const [imageSrc, setImageSrc] = useState(null);
  const webcamRef = useRef(null);

  const capture = () => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageSrc(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">🎉 Photobooth</h1>

      {/* Mode Selection */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setMode('camera')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Use Camera
        </button>
        <button
          onClick={() => setMode('upload')}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Upload Image
        </button>
      </div>

      {/* Render Webcam or Upload */}
      {mode === 'camera' && (
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

      {mode === 'upload' && (
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="mb-4"
        />
      )}

      {/* Image Preview */}
      {imageSrc && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Preview:</h2>
          <img src={imageSrc} alt="Captured or Uploaded" className="border rounded max-w-md" />
        </div>
      )}
    </div>
  );
};

export default PhotoBooth;
