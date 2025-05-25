"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { FaRegComment, FaRegCalendarAlt } from "react-icons/fa";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600"] });

const data = [
  {
    img: "/post__1.jpg",
    title: "The Ultimate Guide to Skincare Routines",
    desc: "Discover the essential steps for a perfect skincare routine that will transform your skin.",
    date: "Sep 27, 2023",
    comment: 8,
    category: "Skincare",
  },
  {
    img: "/post__2.jpg",
    title: "Trending Makeup Looks for Fall 2023",
    desc: "Explore the hottest makeup trends that will dominate this fall season.",
    date: "Sep 25, 2023",
    comment: 1,
    category: "Makeup",
  },
  {
    img: "/post__3.jpg",
    title: "Natural Beauty Tips for Glowing Skin",
    desc: "Learn how to achieve naturally glowing skin using simple ingredients from your kitchen.",
    date: "Sep 30, 2023",
    comment: 6,
    category: "Beauty Tips",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const BlogSection = () => {
  return (
    <div className="container pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h3 className={`${playfair.className} text-accent text-2xl mb-4`}>
          Our Blog
        </h3>
        <h2 className={`${playfair.className} text-4xl font-semibold mb-4`}>
          Latest Beauty Tips & News
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Stay updated with the latest trends, tips, and news from the beauty world.
          Our experts share their knowledge to help you look and feel your best.
      </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {data.map((post) => (
          <motion.article
            key={post.title}
            variants={item}
            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Link href={`/blog/${post.title.toLowerCase().replace(/ /g, "-")}`}>
              <div className="relative h-[240px] overflow-hidden">
                <Image
                  src={post.img}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  className="transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-accent/90 text-white text-sm px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <FaRegCalendarAlt />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegComment />
                    <span>{post.comment} Comments</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                  {post.desc}
                </p>

                <div className="mt-6 flex items-center text-accent font-medium text-sm group-hover:gap-2 transition-all duration-300">
                  Read More
                  <svg
                    className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1"
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
              </div>
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
};

export default BlogSection;
