"use client";

import React, { useState, ChangeEvent, useEffect } from 'react';
import { API_CONFIG } from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import NextImage from 'next/image';  // renamed import here
import { AiOutlineShoppingCart } from 'react-icons/ai';
import * as faceapi from 'face-api.js';

interface ShadeOption {
  name: string;
  src: string;
}

interface VirtualMakeupModalProps {
  closeModal: () => void;
  shades: ShadeOption[];
  category?: string;
}

function getRegionByCategory(category: string = ''): 'lip' | 'eye' | 'skin' {
  const lips = ['lipstick'];
  const eyes = ['eyeshadow', 'mascara', 'eyeliner'];
  const skin = ['foundation', 'blush', 'concealer'];
  if (lips.includes(category.toLowerCase())) return 'lip';
  if (eyes.includes(category.toLowerCase())) return 'eye';
  if (skin.includes(category.toLowerCase())) return 'skin';
  return 'skin'; // default fallback
}

const VirtualMakeupModal: React.FC<VirtualMakeupModalProps> = ({ closeModal, shades, category }) => {
  // State for images and files
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [refLipFile, setRefLipFile] = useState<File | null>(null);
  const [refSkinFile, setRefSkinFile] = useState<File | null>(null);
  const [refEyeFile, setRefEyeFile] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [selectedShade, setSelectedShade] = useState<ShadeOption | null>(null);
  const [imgError, setImgError] = useState(false);

  // Saturation controls
  const [lipSat, setLipSat] = useState(1.0);
  const [skinSat, setSkinSat] = useState(1.0);
  const [eyeSat, setEyeSat] = useState(1.0);

  // Validation states for source image
  const [validationMessage, setValidationMessage] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load face-api models once
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        setValidationMessage('Models loaded. Please upload your photo.');
      } catch {
        setValidationMessage('Failed to load face detection models.');
      }
    };
    loadModels();
  }, []);

  // Generic file upload handler for other uploads (unchanged)
  const handleFileUpload = (setter: React.Dispatch<React.SetStateAction<File | null>>, setterImg?: React.Dispatch<React.SetStateAction<string | null>>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setter(file);
        if (setterImg) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) setterImg(e.target.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    };

  // Brightness check helper
  const checkBrightness = (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const imgData = ctx.getImageData(0, 0, image.width, image.height);
    const data = imgData.data;
    let colorSum = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      colorSum += brightness;
    }
    return colorSum / (image.width * image.height);
  };

  // Validated source image upload handler with face & lighting checks
  const handleSourceImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setValidationMessage('');
    if (!modelsLoaded) {
      setValidationMessage('Face detection models are still loading...');
      return;
    }
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image(); // This is the global browser Image constructor

    img.onload = async () => {
      if (img.width < 300 || img.height < 300) {
        setValidationMessage('Image resolution too low. Please upload a photo at least 300x300 pixels.');
        return;
      }
      if (checkBrightness(img) < 70) {
        setValidationMessage('Image is too dark. Please upload a well-lit photo.');
        return;
      }
      try {
        const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());
        if (detections.length === 0) {
          setValidationMessage('No face detected. Please upload a clear photo.');
          return;
        }
        if (detections.length > 1) {
          setValidationMessage('Multiple faces detected. Please upload only one face.');
          return;
        }
        const box = detections[0].box;
        const faceWidthRatio = box.width / img.width;
        const faceHeightRatio = box.height / img.height;
        if (faceWidthRatio < 0.3 || faceHeightRatio < 0.3) {
          setValidationMessage('Face too small. Please upload a close-up photo.');
          return;
        }
        setSourceFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) setSourceImage(e.target.result as string);
        };
        reader.readAsDataURL(file);
        setValidationMessage('Image is valid!');
      } catch {
        setValidationMessage('Error during face detection.');
      }
    };

    img.onerror = () => {
      setValidationMessage('Failed to load the image.');
    };
    img.src = url;
  };

  // Handle shade selection (unchanged)
  const handleShadeSelected = (shade: ShadeOption) => {
    setSelectedShade(shade);
    const region = getRegionByCategory(category);
    fetch(shade.src)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `${shade.name}.jpg`, { type: blob.type });
        if (region === 'lip') setRefLipFile(file);
        else if (region === 'eye') setRefEyeFile(file);
        else setRefSkinFile(file);
      });
  };

  // Transfer Makeup (unchanged)
  const handleTransferMakeup = async () => {
    if (!sourceFile || !selectedShade) {
      alert('Please upload a source image and select a shade.');
      return;
    }
    setIsTransferring(true);
    try {
      const region = getRegionByCategory(category);
      let refFile: File | null = null;
      if (region === 'lip') refFile = refLipFile;
      else if (region === 'eye') refFile = refEyeFile;
      else refFile = refSkinFile;

      if (!refFile) {
        alert('Reference file missing.');
        setIsTransferring(false);
        return;
      }

      const lipS = region === 'lip' ? lipSat : 0;
      const skinS = region === 'skin' ? skinSat : 0;
      const eyeS = region === 'eye' ? eyeSat : 0;

      const formData = new FormData();
      formData.append('source', sourceFile);
      formData.append('ref_lip', refFile);
      formData.append('ref_skin', refFile);
      formData.append('ref_eye', refFile);
      formData.append('lip_sat', lipS.toString());
      formData.append('skin_sat', skinS.toString());
      formData.append('eye_sat', eyeS.toString());

      const apiUrl = `${API_CONFIG.MAKEUP_API_URL}/transfer/region-specific`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert('Error during makeup transfer: ' + errorData.detail);
        setIsTransferring(false);
        return;
      }
      const blob = await response.blob();
      const resultUrl = URL.createObjectURL(blob);
      setResultImage(resultUrl);
    } catch (error) {
      alert('Transfer failed: ' + error);
    } finally {
      setIsTransferring(false);
    }
  };

  // Determine which saturation slider should be enabled
  const region = getRegionByCategory(category);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1, transition: { type: "spring", damping: 20, stiffness: 200, delay: 0.1 } }}
        exit={{ scale: 0.95, y: 30, opacity: 0, transition: { duration: 0.2 } }}
        className="relative w-full max-w-2xl text-center p-8 rounded-xl bg-white shadow-2xl dark:bg-neutral-800"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <motion.button
          whileHover={{ scale: 1.15, rotate: 90, backgroundColor: '#fecaca' }}
          whileTap={{ scale: 0.9 }}
          onClick={closeModal}
          className="absolute top-5 right-5 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors text-2xl p-2 rounded-full"
        >
          &#10005;
        </motion.button>

        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2, type: "spring", stiffness: 150 } }}
          className="text-3xl font-bold mb-8 text-neutral-800 dark:text-neutral-100"
        >
          Virtual Makeup Studio
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { delay: 0.3, type: "spring", stiffness: 120 } }}
            className="space-y-5"
          >
            <label className="block text-lg font-semibold text-neutral-700 dark:text-neutral-300 text-left">
              Your Photo
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleSourceImageUpload}
                className="hidden"
                id="source-upload"
              />
              <motion.label
                htmlFor="source-upload"
                whileHover={{ borderColor: '#f472b6' }}
                className="block w-full p-6 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl cursor-pointer hover:border-pink-400 dark:hover:border-pink-500 transition-colors group-hover:bg-pink-50 dark:group-hover:bg-neutral-700/50"
              >
                <div className="flex flex-col items-center">
                  <motion.svg
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 text-pink-500 dark:text-pink-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </motion.svg>
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Drop image or <span className="text-pink-600 dark:text-pink-400 font-semibold">Browse</span>
                  </span>
                </div>
              </motion.label>
            </div>

            {/* Validation message */}
            {validationMessage && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{validationMessage}</p>
            )}

            {sourceImage && !imgError ? (
              <motion.div className="relative w-full aspect-square mt-4 rounded-lg overflow-hidden shadow-md">
                <NextImage
                  src={sourceImage}
                  alt="Source"
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-105"
                  onError={() => setImgError(true)}
                />
              </motion.div>
            ) : (
              <div className="w-full h-64 bg-neutral-100 dark:bg-neutral-700 flex flex-col items-center justify-center text-neutral-400 rounded-lg">
                <AiOutlineShoppingCart className="text-5xl opacity-40" />
                <span className="mt-2 text-sm">No Image</span>
              </div>
            )}
          </motion.div>

          {/* Shades UI unchanged */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { delay: 0.4, type: "spring", stiffness: 120 } }}
            className="space-y-5"
          >
            <label className="block text-lg font-semibold text-neutral-700 dark:text-neutral-300 text-left">Select Shade</label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-60 overflow-y-auto pr-2">
              {shades.map((shade, index) => (
                <motion.div
                  key={shade.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.5 + index * 0.05, type: "spring", stiffness: 100 } }}
                  whileHover={{ scale: 1.08, y: -2, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShadeSelected(shade)}
                  className={`cursor-pointer p-1.5 rounded-lg transition-all duration-200 flex flex-col items-center space-y-1.5 ${
                    selectedShade?.name === shade.name
                      ? 'bg-pink-100 dark:bg-pink-700/50 ring-2 ring-pink-500 dark:ring-pink-400 shadow-md'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <motion.div className="relative w-10 h-10 sm:w-12 sm:h-12">
                    {shade.src && !imgError ? (
                      <NextImage
                        src={shade.src}
                        alt={shade.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 dark:bg-neutral-700 flex flex-col items-center justify-center text-neutral-400">
                        <AiOutlineShoppingCart className="text-5xl opacity-40" />
                        <span className="mt-2 text-sm">No Image</span>
                      </div>
                    )}
                  </motion.div>
                  <span className="text-xs text-neutral-600 dark:text-neutral-300 text-center block truncate w-full">{shade.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Saturation sliders unchanged */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.6, type: "spring", stiffness: 100 } }}
          className="space-y-5 mb-8"
        >
          {[ 
            { label: 'Lip Saturation', value: lipSat, setter: setLipSat, regionType: 'lip' },
            { label: 'Skin Saturation', value: skinSat, setter: setSkinSat, regionType: 'skin' },
            { label: 'Eye Saturation', value: eyeSat, setter: setEyeSat, regionType: 'eye' },
          ].map(control => (
            <div key={control.label} className="bg-neutral-50 dark:bg-neutral-700/60 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{control.label}</label>
                <span className="text-sm font-mono text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-600/30 px-2 py-0.5 rounded">{control.value.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={control.value}
                onChange={e => control.setter(Number(e.target.value))}
                disabled={region !== control.regionType}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-opacity duration-200 ${
                  region === control.regionType
                    ? 'bg-pink-200 dark:bg-pink-700 slider-thumb-pink'
                    : 'bg-neutral-200 dark:bg-neutral-600 opacity-60 slider-thumb-neutral'
                }`}
              />
            </div>
          ))}
        </motion.div>

        {/* Apply Makeup button unchanged */}
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0px 8px 25px rgba(236, 72, 153, 0.4)" }}
          whileTap={{ scale: 0.97 }}
          onClick={handleTransferMakeup}
          disabled={isTransferring || !sourceFile || !selectedShade}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white uppercase tracking-wider transition-all duration-200 flex items-center justify-center text-base shadow-md ${
            isTransferring || !sourceFile || !selectedShade
              ? 'bg-neutral-400 dark:bg-neutral-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 dark:from-pink-600 dark:to-purple-700 dark:hover:from-pink-700 dark:hover:to-purple-800'
          }`}
        >
          {isTransferring ? (
            <>
              <motion.svg 
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360, transition: { repeat: Infinity, duration: 1, ease: "linear" } }}
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </motion.svg>
              Processing...
            </>
          ) : (
            'Apply Makeup'
          )}
        </motion.button>

        {/* Result image display unchanged */}
        <AnimatePresence>
          {resultImage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.2, type: "spring", stiffness: 120 } }}
              exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
              className="mt-8"
            >
              <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100">Your Masterpiece!</h3>
              <motion.div className="relative w-full aspect-square">
                {resultImage && !imgError ? (
                  <NextImage
                    src={resultImage}
                    alt="Result"
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 group-hover:scale-105"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-100 dark:bg-neutral-700 flex flex-col items-center justify-center text-neutral-400">
                    <AiOutlineShoppingCart className="text-5xl opacity-40" />
                    <span className="mt-2 text-sm">No Image</span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default VirtualMakeupModal;
