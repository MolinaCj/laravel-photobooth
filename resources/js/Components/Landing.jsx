import React, { useState } from 'react';
import Modal from './LandingModal';

export default function Landing() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="text-center text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-4">SnapBooth</h1>
      <nav className="mb-8">
        <button className="mx-2 underline" onClick={() => alert('About clicked')}>About</button>
        <button className="mx-2 underline" onClick={() => alert('Help clicked')}>Help</button>
      </nav>
      <h2 className="text-4xl font-bold mb-4">Welcome to SnapBooth!</h2>
      <p class="text-lg text-gray-700 mb-3">Capture the moment, your way — <span class="font-medium text-black">snap a selfie</span>, <span class="font-medium text-black">upload your best shot</span>, and customize your photo strip with fun layouts, colors, and emojis.</p>
        <p class="text-xl font-semibold text-indigo-600">Let’s create something unforgettable together!</p>
      <div className="space-x-4">
        <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-6 py-2 rounded-lg">Take a Picture</button>
        <button onClick={() => setShowModal(true)} className="bg-green-500 text-white px-6 py-2 rounded-lg">Upload a Picture</button>
      </div>

      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
}
