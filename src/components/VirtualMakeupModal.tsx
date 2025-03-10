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
  // -----------------------------
  // State
  // -----------------------------
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const [isModelSelectionOpen, setIsModelSelectionOpen] = useState(false);
  const [isShadeModalOpen, setIsShadeModalOpen] = useState(false);

  const [selectedShade, setSelectedShade] = useState<ShadeOption | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);

  // -----------------------------
  // Shade Options
  // -----------------------------
  const shadeOptions: ShadeOption[] = [
    { name: 'Glossy', src: '/img1.png' },
    { name: 'Dark lip', src: '/img2.jpg' },
    { name: 'Smokey eyes', src: '/img3.jpg' },
    { name: 'Natural makeup', src: '/img4.jpg' },
    { name: 'Nude makeup', src: '/img5.png' },
    { name: 'No makeup look', src: '/img6.png' },
  ];

  // -----------------------------
  // Handlers
  // -----------------------------
  // Upload Photo
  const handleSourceUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setSourceImage(fileUrl);
      setReferenceImage(null);
      setSelectedShade(null);
    }
  };

  // Model Selected
  const handleModelSelected = (imgSrc: string) => {
    setSourceImage(imgSrc);
    setIsModelSelectionOpen(false);
    setReferenceImage(null);
    setSelectedShade(null);
  };

  // Fetch as Blob -> File
  const fetchImageAsBlob = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], 'image.jpg', { type: blob.type });
  };

  // Called when user picks a shade from the Shade Modal
  const handleShadeSelected = (shade: ShadeOption) => {
    setSelectedShade(shade);
    setIsShadeModalOpen(false);
    setReferenceImage(null); 
    // We do NOT transfer immediately; we wait for "Transfer Makeup" button click
  };

  // Actual Transfer (when user clicks "Transfer Makeup")
  const handleTransferMakeup = async () => {
    if (!sourceImage || !selectedShade) {
      alert('Please upload or select a source image and shade first.');
      return;
    }
    setIsTransferring(true);
    try {
      const sourceFile = await fetchImageAsBlob(sourceImage);
      const referenceFile = await fetchImageAsBlob(selectedShade.src);

      const formData = new FormData();
      formData.append('source', sourceFile);
      formData.append('reference', referenceFile);

      // Replace with your actual API URL
      const apiUrl = 'https://glamai.duckdns.org/predict';

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert('Error during makeup transfer: ' + errorData.error);
        setIsTransferring(false);
        return;
      }

      const resultBlob = await response.blob();
      const resultUrl = URL.createObjectURL(resultBlob);
      setReferenceImage(resultUrl);
    } catch (error) {
      console.error('Transfer failed', error);
      alert('Transfer failed: ' + error);
    } finally {
      setIsTransferring(false);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pink-100 p-4">
      {/* Main Container */}
      <div className="relative w-full max-w-md text-center p-6 rounded-lg bg-pink-100">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-black hover:text-gray-600 
                     transition-transform transform hover:scale-110 text-xl"
        >
          &#10005;
        </button>

        {/* 1) IF NO SOURCE IMAGE -> Show "Try It Now" Interface */}
        {!sourceImage ? (
          <div>
            {/* Large Headline */}
            <h1 className="text-5xl font-bold mb-6 text-black tracking-wide">
              TRY IT NOW
            </h1>

            {/* Description & Privacy */}
            <p className="text-sm text-black leading-5 mb-8 px-2">
              Your image will be used to provide you with the virtual try-on
              experience and to help with product selection. For information
              about our privacy practices, please read our{' '}
              <a href="#" className="underline font-medium hover:text-gray-700">
                Privacy Policy
              </a>
              .
            </p>

            {/* Buttons */}
            <div className="flex flex-col space-y-4">
              {/* Select a Model */}
              <button
                onClick={() => setIsModelSelectionOpen(true)}
                className="bg-black text-white py-3 rounded-md font-semibold 
                           uppercase tracking-wider hover:bg-gray-800 transition"
              >
                Select a Model
              </button>

              {/* Upload a Photo */}
              <label>
                <div
                  className="bg-black text-white py-3 rounded-md font-semibold 
                             uppercase tracking-wider text-center cursor-pointer 
                             hover:bg-gray-800 transition"
                >
                  Upload a Photo
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSourceUpload}
                />
              </label>
            </div>
          </div>
        ) : (
          /* 2) IF WE HAVE A SOURCE IMAGE -> Show side-by-side UI */
          <div className="bg-pink-100">
            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-black">
              Virtual Makeup Studio
            </h2>

            {/* Container for side-by-side images, center-aligned */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
              {/* Source Image */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-black">
                  Your Face Image
                </h3>
                <img
                  src={sourceImage}
                  alt="Your Face"
                  className="w-64 h-64 object-cover rounded border"
                />
              </div>

              {/* Reference Image (or "No shade selected" placeholder) */}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-black">
                  Reference Image
                </h3>
                {referenceImage ? (
                  <img
                    src={referenceImage}
                    alt="Result Makeup"
                    className="w-64 h-64 object-cover rounded border"
                  />
                ) : selectedShade ? (
                  <img
                    src={selectedShade.src}
                    alt={selectedShade.name}
                    className="w-64 h-64 object-cover rounded border"
                  />
                ) : (
                  <div className="w-64 h-64 flex items-center justify-center rounded border bg-white">
                    <span className="text-gray-500 text-sm">
                      No shade selected
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Buttons below the images */}
            <div className="flex flex-col items-center space-y-4">
              {/* If there's no shade chosen yet OR if we already have a referenceImage,
                  show "Select Shade" so user can pick/change the shade */}
              {(!selectedShade || referenceImage) && (
                <button
                  onClick={() => {
                    setIsShadeModalOpen(true);
                    setReferenceImage(null);
                    setSelectedShade(null);
                  }}
                  className="bg-black text-white py-3 px-6 rounded-md font-semibold 
                             uppercase tracking-wider hover:bg-gray-800 transition"
                >
                  Select Shade
                </button>
              )}

              {/* If we have a selectedShade but no final referenceImage, show "Transfer Makeup" */}
              {selectedShade && !referenceImage && (
                <button
                  onClick={handleTransferMakeup}
                  className="bg-black text-white py-3 px-6 rounded-md font-semibold 
                             uppercase tracking-wider hover:bg-gray-800 transition flex 
                             items-center justify-center"
                >
                  {isTransferring ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Transferring...
                    </>
                  ) : (
                    'Transfer Makeup'
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

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
            <button
              onClick={() => setIsShadeModalOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 font-semibold text-sm"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-center text-black">
              Select a Shade
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {shadeOptions.map((shade) => (
                <div key={shade.name} className="flex flex-col items-center">
                  <img
                    src={shade.src}
                    alt={shade.name}
                    className="cursor-pointer w-24 h-24 object-cover rounded-full border 
                               hover:opacity-80 transition"
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
  );
};

export default VirtualMakeupModal;