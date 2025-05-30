// import React from 'react';

// export default function Modal({ onClose }) {
//   const options = [2, 3, 4, 6];

//   const selectOption = (count) => {
//     window.location.href = `/photobooth?layout=${count}`;
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-6 w-[300px]">
//         <h2 className="text-xl font-bold mb-4">Choose Number of Pictures</h2>
//         <div className="flex flex-wrap gap-4 justify-center">
//           {options.map(n => (
//             <button key={n} onClick={() => selectOption(n)} className="bg-blue-600 text-white px-4 py-2 rounded-md">{n}</button>
//           ))}
//         </div>
//         <button onClick={onClose} className="mt-6 block mx-auto text-red-500 underline">Close</button>
//       </div>
//     </div>
//   );
// }

// resources/js/Components/LandingModal.jsx
import React from 'react';

const LandingModal = ({ onClose, onLayoutSelect }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Choose Layout</h2>
        <div className="space-x-3 mb-4">
          {[2, 3, 4, 6].map((count) => (
            <button
              key={count}
              onClick={() => onLayoutSelect(count)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              {count} Photos
            </button>
          ))}
        </div>
        <button onClick={onClose} className="text-gray-500 underline">Cancel</button>
      </div>
    </div>
  );
};

export default LandingModal;

