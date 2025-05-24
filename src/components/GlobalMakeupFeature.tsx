"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NextImage from 'next/image';
import { API_CONFIG } from '../config';
import { AiOutlineCamera, AiOutlineUser, AiOutlinePicture } from 'react-icons/ai';
import { useToast } from '@/components/ui/use-toast';

const GlobalMakeupFeature = () => {
  const { toast } = useToast();
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSourceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransfer = async () => {
    if (!sourceImage || !referenceImage) {
      toast({
        title: "Error",
        description: "Please select both source and reference images",
        variant: "destructive",
      });
      return;
    }

    setIsTransferring(true);
    try {
      const formData = new FormData();
      formData.append('source', sourceImage);
      formData.append('reference', referenceImage);

      const response = await fetch(`${API_CONFIG.API_URL}/transfer/global`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transfer failed');
      }

      const result = await response.blob();
      const resultUrl = URL.createObjectURL(result);
      setResultImage(resultUrl);
      setShowPreview(true);
      
      toast({
        title: "Success",
        description: "Makeup transfer completed!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to transfer makeup",
        variant: "destructive",
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-8 text-white shadow-lg"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Global Makeup Transfer</h2>
        <p className="text-xl mb-6">
          Transform your look with our AI-powered global makeup transfer!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Source Image Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center p-4 bg-white/10 rounded-lg">
            <label htmlFor="sourceImage" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/50 rounded-lg">
                <AiOutlineUser className="w-12 h-12 mb-2" />
                <span className="text-lg">Your Photo</span>
              </div>
              <input
                id="sourceImage"
                type="file"
                accept="image/*"
                onChange={handleSourceImageChange}
                className="hidden"
              />
            </label>
          </div>
          {sourceImage && (
            <NextImage
              src={sourceImage}
              alt="Your photo"
              width={300}
              height={300}
              className="rounded-lg"
            />
          )}
        </div>

        {/* Reference Image Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-center p-4 bg-white/10 rounded-lg">
            <label htmlFor="referenceImage" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/50 rounded-lg">
                <AiOutlinePicture className="w-12 h-12 mb-2" />
                <span className="text-lg">Reference Photo</span>
              </div>
              <input
                id="referenceImage"
                type="file"
                accept="image/*"
                onChange={handleReferenceImageChange}
                className="hidden"
              />
            </label>
          </div>
          {referenceImage && (
            <NextImage
              src={referenceImage}
              alt="Reference photo"
              width={300}
              height={300}
              className="rounded-lg"
            />
          )}
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleTransfer}
          disabled={isTransferring || !sourceImage || !referenceImage}
          className="w-full bg-white text-purple-600 font-bold py-3 px-6 rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTransferring ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">🔄</span>
              Transferring...
            </span>
          ) : (
            'Transfer Makeup'
          )}
        </button>
      </div>

      {/* Preview Section */}
      {showPreview && resultImage && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Preview</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <NextImage
                src={sourceImage}
                alt="Before"
                width={200}
                height={200}
                className="rounded-lg"
              />
              <span className="absolute -top-3 -left-3 bg-white text-purple-600 px-2 py-1 rounded-full text-sm">
                Before
              </span>
            </div>
            <div className="relative">
              <NextImage
                src={resultImage}
                alt="After"
                width={200}
                height={200}
                className="rounded-lg"
              />
              <span className="absolute -top-3 -left-3 bg-white text-purple-600 px-2 py-1 rounded-full text-sm">
                After
              </span>
            </div>
            <div className="relative">
              <NextImage
                src={referenceImage}
                alt="Reference"
                width={200}
                height={200}
                className="rounded-lg"
              />
              <span className="absolute -top-3 -left-3 bg-white text-purple-600 px-2 py-1 rounded-full text-sm">
                Reference
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GlobalMakeupFeature;
