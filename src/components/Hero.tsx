"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";
import { useContext } from "react";
import { AppContext } from "@/app/app";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif']
});

const Hero = () => {
  const { setShowVirtualMakeup, setShowGlobalTransfer } = useContext(AppContext);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial="initial"
            animate="animate"
            className="max-w-xl"
          >
            <motion.span 
              {...fadeIn}
              className="inline-block text-accent mb-4 tracking-widest uppercase text-sm font-medium"
            >
              Discover Your Beauty
            </motion.span>
            
            <motion.h1 
              {...fadeIn}
              transition={{ delay: 0.2 }}
              className={`${playfair.className} text-5xl lg:text-6xl xl:text-7xl font-medium leading-tight mb-6`}
            >
              Enhance Your Natural Beauty with AI
            </motion.h1>
            
            <motion.p
              {...fadeIn}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed"
            >
              Experience the future of beauty with our virtual try-on technology. Find your perfect match with AI-powered recommendations.
            </motion.p>

            <motion.div
              {...fadeIn}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGlobalTransfer(true)}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full 
                         font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
              >
                Try Virtual Makeup
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-200 dark:border-gray-800"
            >
              <div>
                <div className="text-3xl font-bold text-pink-500 mb-2">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-500 mb-2">50k+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-500 mb-2">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Products</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden">
              <Image
                src="/hero.png"
                alt="Hero Image"
                layout="fill"
                objectFit="cover"
                className="transform hover:scale-105 transition-transform duration-700"
                priority
              />
              
              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute bottom-8 left-8 right-8 bg-white/80 dark:bg-gray-900/80 
                         backdrop-blur-sm p-6 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-full p-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">Virtual Try-On</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Try makeup virtually before you buy
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-transparent 
                         rounded-full"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent 
                         rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
