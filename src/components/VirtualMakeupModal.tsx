import React, { useState, ChangeEvent } from 'react';
import ModelSelectionModal from './ModelSelectionModal';

interface ShadeOption {
  name: string;
  src: string; // reference image source (from your public folder)
}

interface VirtualMakeupModalProps {
  closeModal: () => void;
}

const VirtualMakeupModal: React.FC<VirtualMakeupModalProps> = ({ closeModal }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isModelSelectionOpen, setIsModelSelectionOpen] = useState(false);
  const [isShadeModalOpen, setIsShadeModalOpen] = useState(false);

  const shadeOptions: ShadeOption[] = [
    { name: "Ruby Red", src: '/eye.jpg' },
    { name: "Coral", src: '/eye.jpg' },
    { name: "Nude", src: '/eye.jpg' },
    { name: "Rose", src: '/eye.jpg' }
  ];

  const handleSourceUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileUrl = URL.createObjectURL(event.target.files[0]);
      setSourceImage(fileUrl);
    }
  };

  const handleModelSelected = (imgSrc: string) => {
    setSourceImage(imgSrc);
    setIsModelSelectionOpen(false);
  };

  const fetchImageAsBlob = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], "image.jpg", { type: blob.type });
  };

  const handleShadeSelected = async (shade: ShadeOption) => {
    setReferenceImage(shade.src);
    setIsShadeModalOpen(false);

    if (!sourceImage) {
      alert("Please upload or select a source image first.");
      return;
    }

    try {
      const sourceFile = await fetchImageAsBlob(sourceImage);
      const referenceFile = await fetchImageAsBlob(shade.src);

      const formData = new FormData();
      formData.append("source", sourceFile);
      formData.append("reference", referenceFile);

      // Replace with your DigitalOcean API URL
      const apiUrl = "https://glamai.duckdns.org/predict";

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Error during makeup transfer: " + (await response.json()).error);
        return;
      }

      const resultBlob = await response.blob();
      const resultUrl = URL.createObjectURL(resultBlob);
      setReferenceImage(resultUrl);
    } catch (error) {
      console.error("Transfer failed", error);
      alert("Transfer failed: " + error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
        {/* Modal Title */}
        <h2 className="text-2xl font-bold mb-4 text-center">Virtual Makeup Studio</h2>
        
        {/* Close Button (top-right corner for convenience) */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-4 text-red-500 hover:text-red-700 font-semibold text-sm"
        >
          ✕
        </button>

        {/* If no source image, show upload and model buttons */}
        {!sourceImage ? (
          <div className="flex flex-col space-y-4 items-center">
            <label className="w-full">
              <div className="bg-blue-600 text-white py-2 px-4 rounded font-bold text-center cursor-pointer hover:bg-blue-700 transition">
                Upload Your Face Image
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSourceUpload}
              />
            </label>
            <button
              onClick={() => setIsModelSelectionOpen(true)}
              className="bg-green-500 text-white py-2 px-4 rounded font-bold hover:bg-green-600 transition"
            >
              Select Model (as Source)
            </button>
          </div>
        ) : (
          // If user has a source image
          <div>
            {/* Container for side-by-side images */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-around gap-6 mb-6">
              {/* Source Image */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 text-center md:text-left">
                  Your Face Image
                </h3>
                <img
                  src={sourceImage}
                  alt="Your Face"
                  className="w-full max-h-80 object-cover rounded border"
                />
              </div>

              {/* Result Image */}
              {referenceImage && (
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-center md:text-left">
                    Result Image
                  </h3>
                  <img
                    src={referenceImage}
                    alt="Result Makeup"
                    className="w-full max-h-80 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            {/* Select Shade Button (only if we haven’t shown result yet) */}
            {!referenceImage && (
              <div className="text-center">
                <button
                  onClick={() => setIsShadeModalOpen(true)}
                  className="bg-purple-500 text-white py-2 px-6 rounded font-bold hover:bg-purple-600 transition"
                >
                  Select Shade
                </button>
              </div>
            )}
          </div>
        )}

        {/* Model Selection Modal */}
        {isModelSelectionOpen && (
          <ModelSelectionModal
            closeModelSelection={() => setIsModelSelectionOpen(false)}
            selectModel={handleModelSelected}
          />
        )}

        {/* Shade Selection Modal */}
        {isShadeModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-80 relative">
              <h3 className="text-xl font-bold mb-4 text-center">
                Select a Shade
              </h3>
              <button
                onClick={() => setIsShadeModalOpen(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 font-semibold text-sm"
              >
                ✕
              </button>
              <div className="grid grid-cols-2 gap-4">
                {shadeOptions.map((shade) => (
                  <div key={shade.name} className="flex flex-col items-center">
                    <img
                      src={shade.src}
                      alt={shade.name}
                      className="cursor-pointer w-24 h-24 object-cover rounded-full border hover:opacity-80 transition"
                      onClick={() => handleShadeSelected(shade)}
                    />
                    <span className="mt-2 text-sm font-medium text-gray-700">
                      {shade.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualMakeupModal;
