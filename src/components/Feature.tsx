"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const data = [
  {
    img: "/icon__natural.png",
    title: "Clean Beauty",
    desc: "Ethically sourced, naturally derived ingredients for your skin",
    color: "from-pink-500/80",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  {
    img: "/icon__ai.png",
    title: "AI-Powered",
    desc: "Advanced technology for personalized beauty recommendations",
    color: "from-purple-500/80",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    img: "/icon__virtual.png",
    title: "Virtual Try-On",
    desc: "Experience makeup virtually before making a purchase",
    color: "from-blue-500/80",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  }
];

const Feature = () => {
  return (
    <div className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h3 className={`${playfair.className} text-accent text-lg uppercase tracking-wider mb-4`}>
            Why Choose Us
          </h3>
          <h2 className={`${playfair.className} text-4xl lg:text-5xl font-medium mb-6`}>
            The Future of Beauty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Experience the perfect blend of technology and beauty with our innovative features designed to enhance your beauty journey.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {data.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 h-full 
                            shadow-lg hover:shadow-xl transition-all duration-300
                            border border-gray-100 dark:border-gray-700"
              >
                {/* Feature Icon */}
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 
                                 rounded-xl bg-gradient-to-br ${feature.color} to-transparent 
                                 text-white p-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                </div>

                {/* Feature Content */}
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {feature.desc}
                </p>

                {/* Learn More Link */}
                <motion.div
                  whileHover="hover"
                  className="inline-flex items-center text-accent font-medium"
                >
                  Learn More
                  <motion.span
                    variants={{
                      hover: { x: 8 }
                    }}
                    className="ml-2"
                  >
                    →
                  </motion.span>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent/5 to-transparent 
                              rounded-br-2xl pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feature;
