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
import React from "react";

const LandingModal = ({ onClose, onLayoutSelect }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-purple-50 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
                <h2 className="text-3xl font-extrabold mb-6 text-purple-700 drop-shadow-md">
                    Choose Layout
                </h2>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    {[2, 3, 4].map((count) => (
                        <button
                            key={count}
                            onClick={() => onLayoutSelect(count)}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold py-3 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-purple-300 transition-colors transition-transform hover:-translate-y-1"
                        >
                            {count} Photos
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="inline-block px-6 py-2 rounded-xl border border-purple-600 text-purple-600 font-semibold hover:bg-purple-100 hover:text-purple-700 transition-colors transition-transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-300"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default LandingModal;
