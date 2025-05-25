"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { RiUploadCloud2Line } from "react-icons/ri";
import { API_CONFIG } from "@/config";
import { playfair } from "@/config/fonts";

interface GlobalMakeupTransferProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalMakeupTransfer = ({ isOpen, onClose }: GlobalMakeupTransferProps) => {
  // State for images and files
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Handle file uploads
  const handleSourceUpload = (file: File) => {
    setSourceFile(file);
    setSourceImage(URL.createObjectURL(file));
    if (activeStep === 1) setActiveStep(2);
  };

  const handleReferenceUpload = (file: File) => {
    setReferenceFile(file);
    setReferenceImage(URL.createObjectURL(file));
    if (activeStep === 2) setActiveStep(3);
  };

  // Transfer Makeup
  const handleTransferMakeup = async () => {
    if (!sourceFile || !referenceFile) {
      alert('Please upload both source and reference images.');
      return;
    }

    setIsTransferring(true);
    try {
      const formData = new FormData();
      formData.append('source', sourceFile);
      formData.append('reference', referenceFile);

      const apiUrl = `${API_CONFIG.MAKEUP_API_URL}/transfer/global`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert('Error during makeup transfer: ' + errorData.detail);
        return;
      }
      
      const blob = await response.blob();
      const resultUrl = URL.createObjectURL(blob);
      setResultImage(resultUrl);
      setActiveStep(4);
    } catch (error) {
      alert('Transfer failed: ' + error);
    } finally {
      setIsTransferring(false);
    }
  };

  const FileUploadBox = ({ 
    onFileSelect, 
    title, 
    subtitle 
  }: { 
    onFileSelect: (file: File) => void, 
    title: string, 
    subtitle: string 
  }) => (
    <div className="relative border-2 border-dashed border-pink-200 dark:border-pink-800 
                    rounded-xl p-8 text-center hover:border-pink-300 dark:hover:border-pink-700 
                    transition-colors cursor-pointer group">
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
      <RiUploadCloud2Line className="w-12 h-12 mx-auto mb-4 text-pink-400 
                                   group-hover:text-pink-500 transition-colors" />
      <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {subtitle}
      </p>
    </div>
  );

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
            className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl 
                     overflow-hidden max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                       dark:hover:text-gray-200 z-10"
            >
              <IoClose className="w-6 h-6" />
            </button>

            <div className="grid md:grid-cols-2 h-full">
              {/* Left Section - Preview */}
              <div className="p-8 border-r border-gray-200 dark:border-gray-700">
                <h2 className={`${playfair.className} text-3xl font-medium mb-6 text-gray-800 dark:text-white`}>
                  Global Makeup Transfer
                </h2>

                {/* Steps Progress */}
                <div className="flex items-center justify-between mb-8">
                  {[
                    { number: 1, title: "Source" },
                    { number: 2, title: "Reference" },
                    { number: 3, title: "Transfer" },
                    { number: 4, title: "Result" }
                  ].map((step, index) => (
                    <div key={step.number} className="flex items-center">
                      <div className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-sm
                        ${activeStep >= step.number 
                          ? 'bg-pink-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}
                      `}>
                        {step.number}
                      </div>
                      {index < 3 && (
                        <div className={`
                          w-12 h-0.5 mx-2
                          ${activeStep > step.number 
                            ? 'bg-pink-500' 
                            : 'bg-gray-200 dark:bg-gray-700'}
                        `} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Upload Section */}
                <div className="space-y-6">
                  {activeStep === 1 && (
                    <FileUploadBox
                      onFileSelect={handleSourceUpload}
                      title="Upload Source Image"
                      subtitle="This is your base photo"
                    />
                  )}

                  {activeStep === 2 && (
                    <FileUploadBox
                      onFileSelect={handleReferenceUpload}
                      title="Upload Reference Image"
                      subtitle="This is the makeup style you want to transfer"
                    />
                  )}

                  {activeStep >= 3 && (
                    <button
                      onClick={handleTransferMakeup}
                      disabled={isTransferring || !sourceFile || !referenceFile}
                      className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white 
                               rounded-xl font-medium hover:shadow-lg hover:shadow-pink-500/30 
                               transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isTransferring ? 'Transferring Makeup...' : 'Transfer Makeup'}
                    </button>
                  )}
                </div>

                {/* Tips */}
                <div className="mt-8 p-4 bg-pink-50 dark:bg-pink-950/30 rounded-xl">
                  <h4 className="text-base font-medium mb-2 text-gray-800 dark:text-white">
                    Tips for best results:
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• Use high-quality, well-lit photos</li>
                    <li>• Ensure faces are clearly visible</li>
                    <li>• Choose reference photos with similar face angles</li>
                    <li>• Avoid extreme expressions</li>
                  </ul>
                </div>
              </div>

              {/* Right Section - Image Preview */}
              <div className="p-8">
                <div className="grid grid-cols-2 gap-4 h-full">
                  {/* Source Image */}
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                    {sourceImage ? (
                      <Image
                        src={sourceImage}
                        alt="Source"
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        Source Image
                      </div>
                    )}
                  </div>

                  {/* Reference Image */}
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                    {referenceImage ? (
                      <Image
                        src={referenceImage}
                        alt="Reference"
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        Reference Image
                      </div>
                    )}
                  </div>

                  {/* Result Image */}
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden col-span-2">
                    {resultImage ? (
                      <Image
                        src={resultImage}
                        alt="Result"
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        Result will appear here
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalMakeupTransfer; 