import React from 'react';

// List of models to display
const models = [
  { id: 1, imgSrc: "/test.png", name: 'Model 1' },
  { id: 2, imgSrc: '/test.png', name: 'Model 2' },
  { id: 3, imgSrc: '/test.png', name: 'Model 3' },
  { id: 4, imgSrc: '/test.png', name: 'Model 4' },
  { id: 5, imgSrc: '/test.png', name: 'Model 5' },
  { id: 6, imgSrc: '/test.png', name: 'Model 6' },
];

const ModelSelectionModal = ({ closeModelSelection, selectModel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-2xl shadow-2xl w-[500px] max-w-full p-8 transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Select  Model</h2>

        {/* Display models for selection */}
        <div className="grid grid-cols-3 gap-4">
          {models.map((model) => (
            <div
              key={model.id}
              className="cursor-pointer text-center"
              onClick={() => selectModel(model.imgSrc)} // When a model is selected
            >
              <img
                src={model.imgSrc}
                alt={model.name}
                className="w-full h-auto rounded-lg hover:opacity-80 transition-opacity"
              />
              <p className="text-gray-500 mt-2">{model.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={closeModelSelection}
            className="text-red-500 font-semibold hover:text-red-700 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelSelectionModal;
