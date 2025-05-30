import React, { useState } from 'react';
import Modal from '../Components/LandingModal';
import PhotoBooth from '../components/PhotoBooth';

export default function Landing() {
  const [showModal, setShowModal] = useState(false);
  const [layout, setLayout] = useState(null);
  const [mode, setMode] = useState(null); // 'camera' or 'upload'

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
    <div className="text-center text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-4">SnapBooth</h1>

      {!layout && (
        <>
          <nav className="mb-8">
            <button className="mx-2 underline" onClick={() => alert('About clicked')}>About</button>
            <button className="mx-2 underline" onClick={() => alert('Help clicked')}>Help</button>
          </nav>
          <h2 className="text-4xl font-bold mb-4">Welcome to SnapBooth!</h2>
          <p className="text-lg text-gray-700 mb-3">
            Capture the moment, your way — <span className="font-medium text-black">snap a selfie</span>, <span className="font-medium text-black">upload your best shot</span>, and customize your photo strip with fun layouts, colors, and emojis.
          </p>
          <p className="text-xl font-semibold text-indigo-600">Let’s create something unforgettable together!</p>
          <div className="space-x-4 mt-6">
            <button
              onClick={() => {
                setMode('camera');
                setShowModal(true);
              }}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Take a Picture
            </button>
            <button
              onClick={() => {
                setMode('upload');
                setShowModal(true);
              }}
              className="bg-green-500 text-white px-6 py-2 rounded-lg"
            >
              Upload a Picture
            </button>
          </div>
        </>
      )}

      {showModal && <Modal onClose={() => setShowModal(false)} onLayoutSelect={handleLayoutSelect} />}

      {layout && (
        <div className="mt-10">
          <PhotoBooth layout={layout} mode={mode} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}
