"use client";

import React from "react";
import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600"] });

const data = [
  {
    img: "/category__makeup.jpg",
    type: "Makeup",
    desc: "Discover our collection of luxury makeup products",
    color: "from-pink-500/90",
    link: "/category/makeup"
  },
  {
    img: "/category__skincare.jpg",
    type: "Skincare",
    desc: "Advanced formulas for radiant, healthy skin",
    color: "from-purple-500/90",
    link: "/category/skincare"
  },
  {
    img: "/category__tools.jpg",
    type: "Tools",
    desc: "Professional beauty tools and accessories",
    color: "from-blue-500/90",
    link: "/category/tools"
  },
  {
    img: "/category__sets.jpg",
    type: "Gift Sets",
    desc: "Curated collections for the perfect present",
    color: "from-rose-500/90",
    link: "/category/sets"
  }
];

const Category = () => {
  return (
    <div className="relative py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h3 className={`${playfair.className} text-accent text-lg uppercase tracking-wider mb-4`}>
            Our Collections
          </h3>
          <h2 className={`${playfair.className} text-4xl lg:text-5xl font-medium mb-6`}>
            Explore Beauty Categories
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Discover our curated collection of luxury beauty products, each designed to enhance your natural beauty.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((category, index) => (
            <motion.div
              key={category.type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <Link href={category.link}>
                <div className="relative h-[400px] rounded-2xl overflow-hidden">
                  <Image
                    src={category.img}
                    alt={category.type}
                    layout="fill"
                    objectFit="cover"
                    className="transform transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} to-transparent 
                                opacity-60 group-hover:opacity-70 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <h3 className={`${playfair.className} text-2xl font-medium text-white mb-2`}>
                        {category.type}
        </h3>
                      <p className="text-white/90 text-sm mb-6">
                        {category.desc}
                      </p>

                      <div className="flex items-center text-white/90 text-sm font-medium group-hover:text-white transition-colors">
                        Explore Collection
                        <svg
                          className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>

                      {/* Decorative Line */}
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-[1px] bg-white/30 my-4"
                      />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
