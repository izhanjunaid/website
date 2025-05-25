"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { BsCamera } from "react-icons/bs";
import { RiUploadCloud2Line } from "react-icons/ri";
import { FiCheck } from "react-icons/fi";
import { API_CONFIG } from "@/config";
import { playfair } from "@/config/fonts";
import * as faceapi from 'face-api.js';

interface ShadeOption {
  name: string;
  src: string;
}

interface VirtualMakeupModalProps {
  isOpen: boolean;
  onClose: () => void;
  shades?: ShadeOption[];
  category?: string;
}

function getRegionByCategory(category: string = ''): 'lip' | 'eye' | 'skin' {
  const lips = ['lipstick'];
  const eyes = ['eyeshadow', 'mascara', 'eyeliner'];
  const skin = ['foundation', 'blush', 'concealer'];
  if (lips.includes(category?.toLowerCase())) return 'lip';
  if (eyes.includes(category?.toLowerCase())) return 'eye';
  if (skin.includes(category?.toLowerCase())) return 'skin';
  return 'skin'; // default fallback
}

const VirtualMakeupModal = ({ isOpen, onClose, shades = [], category }: VirtualMakeupModalProps) => {
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

  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Validation states
  const [validationMessage, setValidationMessage] = useState('');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Load face-api models
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

  // Camera functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please make sure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setSourceImage(imageDataUrl);
        // Convert data URL to File
        fetch(imageDataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
            setSourceFile(file);
          });
        setActiveStep(2);
        stopCamera();
      }
    }
  };

  // Handle shade selection
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

  // Transfer Makeup
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
      setActiveStep(3);
    } catch (error) {
      alert('Transfer failed: ' + error);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          {/* Backdrop */}
      <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden 
                     max-h-[90vh] md:max-h-[800px]"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                       dark:hover:text-gray-200 z-10"
            >
              <IoClose className="w-6 h-6" />
            </button>

            <div className="flex flex-col md:grid md:grid-cols-2 h-full overflow-hidden">
              {/* Left Section - Preview */}
              <div className="relative h-[300px] md:h-[600px] bg-gradient-to-br from-pink-100 to-purple-50 
                            dark:from-pink-950 dark:to-purple-950">
                {showCamera ? (
                  <div className="relative h-full">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <button
                      onClick={capturePhoto}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                               bg-pink-500 text-white px-6 py-2 rounded-full 
                               hover:bg-pink-600 transition-colors"
                    >
                      Capture Photo
                    </button>
                </div>
                ) : resultImage ? (
                  <Image
                    src={resultImage}
                    alt="Result"
                    layout="fill"
                    objectFit="cover"
                  />
                ) : sourceImage ? (
                  <Image
                  src={sourceImage}
                    alt="Preview"
                  layout="fill"
                  objectFit="cover"
                />
            ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <BsCamera className="w-12 h-12 mx-auto mb-4 text-pink-300" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Your preview will appear here
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Section - Controls */}
              <div className="p-4 md:p-8 overflow-y-auto">
                <h2 className={`${playfair.className} text-2xl md:text-3xl font-medium mb-4 md:mb-6 text-gray-800 dark:text-white`}>
                  Virtual Makeup Studio
                </h2>

                {/* Steps Progress */}
                <div className="flex items-center justify-between mb-6 md:mb-12">
                  {[
                    { number: 1, title: "Upload Photo" },
                    { number: 2, title: "Choose Shade" },
                    { number: 3, title: "Result" }
                  ].map((step, index) => (
                    <div key={step.number} className="flex items-center">
                      <div className={`
                        flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full text-sm md:text-base
                        ${activeStep >= step.number 
                          ? 'bg-pink-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}
                      `}>
                        {activeStep > step.number ? <FiCheck /> : step.number}
                      </div>
                      {index < 2 && (
                        <div className={`
                          w-8 md:w-12 h-0.5 mx-1 md:mx-2
                          ${activeStep > step.number 
                            ? 'bg-pink-500' 
                            : 'bg-gray-200 dark:bg-gray-700'}
                        `} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Upload Section */}
                {activeStep === 1 && !showCamera && (
                  <div className="space-y-4 md:space-y-6">
                    <div className="relative border-2 border-dashed border-pink-200 dark:border-pink-800 
                                  rounded-xl p-4 md:p-8 text-center hover:border-pink-300 dark:hover:border-pink-700 
                                  transition-colors cursor-pointer group">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSourceFile(file);
                            setSourceImage(URL.createObjectURL(file));
                            setActiveStep(2);
                          }
                        }}
                      />
                      <RiUploadCloud2Line className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-4 text-pink-400 
                                                   group-hover:text-pink-500 transition-colors" />
                      <h3 className="text-base md:text-lg font-medium mb-1 md:mb-2 text-gray-800 dark:text-white">
                        Upload Your Photo
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        Drop your image here or click to browse
                      </p>
                    </div>

                    <div className="text-center">
                      <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        or
                      </span>
                    </div>

                    <button
                      onClick={startCamera}
                      className="w-full py-3 md:py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white 
                               rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/30 
                               transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <BsCamera className="w-4 h-4 md:w-5 md:h-5" />
                      Take a Photo
                    </button>
                  </div>
                )}

                {/* Step 2 & 3: Shade Selection and Controls */}
                {(activeStep === 2 || activeStep === 3) && (
                  <div className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-3 gap-2 md:gap-4 max-h-[200px] md:max-h-[300px] overflow-y-auto">
                      {shades.map((shade) => (
                        <div
                  key={shade.name}
                  onClick={() => handleShadeSelected(shade)}
                          className={`cursor-pointer p-1 md:p-2 rounded-lg transition-all ${
                    selectedShade?.name === shade.name
                              ? 'ring-2 ring-pink-500 bg-pink-50'
                              : 'hover:bg-gray-50'
                  }`}
                >
                          <div className="relative aspect-square mb-1 md:mb-2">
                            <Image
                        src={shade.src}
                        alt={shade.name}
                        layout="fill"
                        objectFit="cover"
                              className="rounded-lg"
                            />
                          </div>
                          <p className="text-xs md:text-sm text-center truncate">{shade.name}</p>
                      </div>
              ))}
            </div>

                    {/* Saturation Controls */}
                    <div className="space-y-3 md:space-y-4 px-1">
                      {getRegionByCategory(category) === 'lip' && (
                        <div>
                          <label className="text-xs md:text-sm text-gray-600 block mb-1">Lip Saturation</label>
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={lipSat}
                            onChange={(e) => setLipSat(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                                     dark:bg-gray-700 accent-pink-500"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0</span>
                            <span>1</span>
                            <span>2</span>
                          </div>
                        </div>
                      )}
                      {getRegionByCategory(category) === 'skin' && (
                        <div>
                          <label className="text-xs md:text-sm text-gray-600 block mb-1">Skin Saturation</label>
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={skinSat}
                            onChange={(e) => setSkinSat(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                                     dark:bg-gray-700 accent-pink-500"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0</span>
                            <span>1</span>
                            <span>2</span>
        </div>
              </div>
                      )}
                      {getRegionByCategory(category) === 'eye' && (
                        <div>
                          <label className="text-xs md:text-sm text-gray-600 block mb-1">Eye Saturation</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                            value={eyeSat}
                            onChange={(e) => setEyeSat(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                                     dark:bg-gray-700 accent-pink-500"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0</span>
                            <span>1</span>
                            <span>2</span>
                          </div>
                        </div>
                      )}
            </div>

                    <button
          onClick={handleTransferMakeup}
                      disabled={isTransferring || !selectedShade}
                      className="w-full py-3 md:py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white 
                               rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/30 
                               transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                               text-sm md:text-base"
                    >
                      {isTransferring ? 'Applying Makeup...' : activeStep === 3 ? 'Try Again' : 'Apply Makeup'}
                    </button>
                  </div>
                )}

                {/* Tips */}
                {activeStep === 1 && (
                  <div className="mt-4 md:mt-8 p-3 md:p-4 bg-pink-50 dark:bg-pink-950/30 rounded-xl">
                    <h4 className="text-sm md:text-base font-medium mb-2 text-gray-800 dark:text-white">
                      Tips for best results:
                    </h4>
                    <ul className="text-xs md:text-sm text-gray-600 dark:text-gray-400 space-y-1 md:space-y-2">
                      <li>• Ensure good lighting</li>
                      <li>• Face the camera directly</li>
                      <li>• Use a plain background</li>
                      <li>• Remove glasses if possible</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
  );
};

export default VirtualMakeupModal;
