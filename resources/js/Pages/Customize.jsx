import React, { useEffect, useState } from 'react';

const Customize = () => {
  const [images, setImages] = useState([]);
  const [style, setStyle] = useState('normal'); // 'normal' or 'film'
  const [showDate, setShowDate] = useState(true);
  const [filter, setFilter] = useState('none');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [stripColor, setStripColor] = useState('#000000');
  const [isStripNone, setIsStripNone] = useState(true); // "None" checkbox initially checked
  const [selectedSticker, setSelectedSticker] = useState(null);

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem('photobooth-images')) || [];
    setImages(storedImages);
  }, []);

  const currentDate = new Date().toLocaleDateString();

  const filterClasses = {
    none: '',
    vintage: 'contrast-125 sepia',
    sepia: 'sepia',
    bw: 'grayscale',
  };

  const stickers = ['🎉', '🌟', '😎', '💖'];


  // Render a single photo with optional sticker overlay and filter
    const applySticker = (img, index) => (
  <div
    key={index}
    className="relative border-4 rounded-md"
    style={{
      borderColor: isStripNone ? 'transparent' : stripColor,
      width: '160px',
      margin: '8px 0',
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



    return (
      <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex flex-col md:flex-row items-center justify-center gap-10">
        {/* Preview Section */}
        <div
          className="p-4 w-fit relative"
          style={{
            backgroundColor:
              style === 'film' ? 'black' : bgColor || '#E9D8FD',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)', // strong custom shadow
          }}
        >


          {/* Left sprockets for film */}
            {style === 'film' && images.length > 0 && (
              <div className="absolute top-0 bottom-0 left-0 z-10 flex flex-col justify-between items-center px-1 py-4 h-full">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-4 bg-white"
                    style={{ borderRadius: '1px' }}
                  />
                ))}
              </div>
            )}

          {/* Image strip container */}
          <div
            className={`relative p-3 ${
              images.length === 6
                ? 'grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-3 gap-2'
                : 'flex flex-col items-center'
            }`}
          >
            {images.length === 0 ? (
              <p className="text-center text-gray-500">No images to display.</p>
            ) : (
              images.map((img, index) => applySticker(img, index))
            )}
          </div>

          {/* Right sprockets for film */}
          {/* Right sprockets for film */}
            {style === 'film' && images.length > 0 && (
              <div className="absolute top-0 bottom-0 right-0 z-10 flex flex-col justify-between items-center px-1 py-4 h-full">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-4 bg-white"
                    style={{ borderRadius: '1px' }}
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

        {/* Controls Section */}
        {/* Controls Section */}
<div className="w-full md:w-96 mx-auto space-y-8 bg-white p-6 rounded-xl shadow-lg border border-purple-100">
  {/* Style & Date Toggle */}
  <div className="space-y-4">
    <div className="font-semibold text-purple-800 text-sm">Template</div>
    <div className="flex items-center gap-6">
      <label className="cursor-pointer text-purple-700 font-medium flex items-center">
        <input
          type="radio"
          name="style"
          value="normal"
          checked={style === 'normal'}
          onChange={() => setStyle('normal')}
          className="mr-2 accent-purple-600"
        />
        Normal
      </label>
      <label className="cursor-pointer text-purple-700 font-medium flex items-center">
        <input
          type="radio"
          name="style"
          value="film"
          checked={style === 'film'}
          onChange={() => setStyle('film')}
          className="mr-2 accent-purple-600"
        />
        Film Strip
      </label>
    </div>

    <label className="flex items-center gap-2 text-purple-700 font-medium">
      <input
        type="checkbox"
        checked={showDate}
        onChange={() => setShowDate(!showDate)}
        className="accent-pink-600"
      />
      Show Date
    </label>
  </div>

  {/* Filters */}
  <div>
    <div className="font-semibold text-purple-800 mb-2 text-sm">Filter</div>
    <div className="flex flex-wrap gap-3">
      {['none', 'vintage', 'sepia', 'bw'].map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-1.5 rounded-full border text-sm transition-all duration-200 shadow-sm ${
            filter === f
              ? 'bg-pink-600 text-white border-pink-600'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          type="button"
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
        <label className="block text-sm font-medium text-purple-800 mb-1">Background</label>
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
  <label className="block text-sm font-medium text-purple-800 mb-1">Strip Border</label>
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
        isStripNone ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      aria-label="Select strip border color"
    />
    <label className="text-sm text-purple-700 flex items-center gap-1 cursor-pointer">
      <input
        type="checkbox"
        checked={isStripNone}
        onChange={(e) => {
          setIsStripNone(e.target.checked);
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
    <label className="block font-semibold text-purple-800 mb-2">Sticker</label>
    <div className="flex items-center flex-wrap gap-3">
      {stickers.map((emoji, index) => (
        <button
          key={index}
          onClick={() => setSelectedSticker(emoji)}
          className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${
            selectedSticker === emoji ? 'scale-110 drop-shadow' : ''
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
        className="ml-2 text-sm text-pink-600 underline hover:text-pink-700"
        type="button"
      >
        Clear
      </button>
    </div>
  </div>
</div>
      </div>
    );
};

export default Customize;
