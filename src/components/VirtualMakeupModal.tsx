import React, { useState } from 'react';
import ModelSelectionModal from './ModelSelectionModal';

// Define the prop types for the VirtualMakeupModal component
interface VirtualMakeupModalProps {
  closeModal: () => void; // Define closeModal as a function that returns void
}

const VirtualMakeupModal: React.FC<VirtualMakeupModalProps> = ({ closeModal }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModelSelectionOpen, setIsModelSelectionOpen] = useState(false); // Manage second modal state

  // Handle image upload
  const handleUploadClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = URL.createObjectURL(event.target.files[0]);
      setSelectedImage(file); // Store the uploaded image in state
    }
  };

  // Handle selecting a model from ModelSelectionModal
  const handleModelSelected = (imgSrc: string) => {
    setSelectedImage(imgSrc); // Store the selected model image
    setIsModelSelectionOpen(false); // Close the model selection modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-2xl shadow-2xl w-[400px] max-w-full p-8 transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Try Virtual Makeup</h2>

        {/* Display selected image or model */}
        {selectedImage ? (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-center">Selected Image</h3>
            <img src={selectedImage} alt="Selected" className="w-full h-auto rounded-lg" />
          </div>
        ) : (
          <>
            {/* Symmetrical Upload Picture Button */}
            <div className="space-y-4">
              <label className="block w-full cursor-pointer">
                <div className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-gradient-to-l transition-colors duration-300 text-center">
                  Upload Picture
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadClick} // Trigger image upload
                />
              </label>

              {/* Symmetrical Use Model Button */}
              <button
                onClick={() => setIsModelSelectionOpen(true)} // Open Model Selection Modal
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-gradient-to-l transition-colors duration-300"
              >
                Select Model
              </button>
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={closeModal}
            className="text-red-500 font-semibold hover:text-red-700 transition-colors duration-300"
          >
            Close
          </button>
        </div>

        {/* Render ModelSelectionModal when 'Use Model' is clicked */}
        {isModelSelectionOpen && (
          <ModelSelectionModal
            closeModelSelection={() => setIsModelSelectionOpen(false)} // Close Model Selection Modal
            selectModel={handleModelSelected} // Handle selected model
          />
        )}
      </div>
    </div>
  );
};

export default VirtualMakeupModal;
