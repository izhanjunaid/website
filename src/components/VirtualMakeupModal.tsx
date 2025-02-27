<<<<<<< HEAD
import React, { useState, ChangeEvent } from 'react';
import ModelSelectionModal from './ModelSelectionModal';

// Define a type for shade options
interface ShadeOption {
  name: string;
  src: string; // reference image source (e.g. from your public folder)
}

// Define the prop types for the VirtualMakeupModal component
interface VirtualMakeupModalProps {
  closeModal: () => void;
}

const VirtualMakeupModal: React.FC<VirtualMakeupModalProps> = ({ closeModal }) => {
  // State for the user's source (face) image
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  // State for the reference image (either from model selection or shade selection)
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  // Manage the second modal for selecting a model image
  const [isModelSelectionOpen, setIsModelSelectionOpen] = useState(false);
  // Shade selection state
  const shadeOptions: ShadeOption[] = [
    { name: "Ruby Red", src: "/images/ruby_red.png" },
    { name: "Coral", src: "/images/coral.png" },
    { name: "Nude", src: "/images/nude.png" }
  ];
  const [selectedShade, setSelectedShade] = useState<ShadeOption | null>(null);

  // Handle source image upload from user
  const handleSourceUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileUrl = URL.createObjectURL(event.target.files[0]);
      setSourceImage(fileUrl);
    }
  };

  // Handle model selection via the existing modal
  const handleModelSelected = (imgSrc: string) => {
    setReferenceImage(imgSrc);
    setIsModelSelectionOpen(false);
  };

  // Handle shade selection from the dropdown
  const handleShadeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const shadeName = event.target.value;
    const found = shadeOptions.find((option) => option.name === shadeName);
    setSelectedShade(found || null);
    if (found) {
      setReferenceImage(found.src);
    }
  };

  // Handle the makeup transfer action
  // This function would typically package the source and reference images
  // and send them to your cloud-based AI model API.
  const handleTransfer = async () => {
    if (!sourceImage || !referenceImage) {
      alert("Please upload a source image and select a reference image (model or shade).");
      return;
    }

    // For demonstration purposes, we convert the image URLs to File objects using fetch
    // In a real-world scenario, you might have the files already or use a different approach.
    try {
      const fetchImageAsBlob = async (url: string) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], "image.jpg", { type: blob.type });
      };

      const sourceFile = await fetchImageAsBlob(sourceImage);
      const referenceFile = await fetchImageAsBlob(referenceImage);

      // Create a FormData object to send both images to the cloud API
      const formData = new FormData();
      formData.append("source", sourceFile);
      formData.append("reference", referenceFile);

      // Call your cloud-based API endpoint (update the URL accordingly)
      const response = await fetch("https://your-api-endpoint.herokuapp.com/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Error during makeup transfer: " + (await response.json()).error);
        return;
      }

      // Convert the response into a Blob and create a local URL for display
      const resultBlob = await response.blob();
      const resultUrl = URL.createObjectURL(resultBlob);
      setReferenceImage(resultUrl); // Reuse the referenceImage state to display the result
    } catch (error) {
      console.error("Transfer failed", error);
      alert("Transfer failed: " + error);
    }
=======
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
>>>>>>> d3020857ad632300855e74ab84ffd9ef8611f632
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-2xl shadow-2xl w-[400px] max-w-full p-8 transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">Try Virtual Makeup</h2>

<<<<<<< HEAD
        {/* Display the source image if uploaded */}
        {sourceImage ? (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-center">Your Face Image</h3>
            <img src={sourceImage} alt="Your Face" className="w-full h-auto rounded-lg" />
          </div>
        ) : (
          <label className="block w-full cursor-pointer mb-4">
            <div className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-gradient-to-l transition-colors duration-300 text-center">
              Upload Your Face Image
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSourceUpload}
            />
          </label>
        )}

        {/* Display the reference image if available (from model selection or shade selection) */}
        {referenceImage ? (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-center">Reference Makeup Image</h3>
            <img src={referenceImage} alt="Reference" className="w-full h-auto rounded-lg" />
          </div>
        ) : (
          <div className="space-y-4 mb-4">
            {/* Button to select a model image */}
            <button
              onClick={() => setIsModelSelectionOpen(true)}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-gradient-to-l transition-colors duration-300"
            >
              Select Model
            </button>
            {/* Dropdown to select a shade */}
            <div>
              <label className="block text-center font-semibold mb-2">Or Select a Shade</label>
              <select
                onChange={handleShadeChange}
                className="w-full border rounded-lg py-2 px-3"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Shade
                </option>
                {shadeOptions.map((shade) => (
                  <option key={shade.name} value={shade.name}>
                    {shade.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Transfer Makeup Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleTransfer}
            className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors duration-300"
          >
            Transfer Makeup
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
=======
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
>>>>>>> d3020857ad632300855e74ab84ffd9ef8611f632
            onClick={closeModal}
            className="text-red-500 font-semibold hover:text-red-700 transition-colors duration-300"
          >
            Close
          </button>
        </div>

<<<<<<< HEAD
        {/* Render ModelSelectionModal if open */}
        {isModelSelectionOpen && (
          <ModelSelectionModal
            closeModelSelection={() => setIsModelSelectionOpen(false)}
            selectModel={handleModelSelected}
=======
        {/* Render ModelSelectionModal when 'Use Model' is clicked */}
        {isModelSelectionOpen && (
          <ModelSelectionModal
            closeModelSelection={() => setIsModelSelectionOpen(false)} // Close Model Selection Modal
            selectModel={handleModelSelected} // Handle selected model
>>>>>>> d3020857ad632300855e74ab84ffd9ef8611f632
          />
        )}
      </div>
    </div>
  );
};

export default VirtualMakeupModal;
