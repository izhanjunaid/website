"use client";

import React from "react";
import { Playfair_Display } from "next/font/google";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from "react-icons/fa";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"] });

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-white pt-24 pb-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/">
              <Image
                src="/logo-light.png"
                alt="Logo"
                width={120}
                height={40}
                className="mb-6"
              />
            </Link>
            <p className="text-gray-400 leading-relaxed">
              Experience the epitome of luxury beauty with our curated collection of premium products and innovative virtual try-on technology.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <FaFacebookF />, href: "#" },
                { icon: <FaTwitter />, href: "#" },
                { icon: <FaInstagram />, href: "#" },
                { icon: <FaPinterest />, href: "#" },
                { icon: <FaYoutube />, href: "#" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center 
                           hover:bg-accent transition-colors duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`${playfair.className} text-lg font-medium mb-6`}>Quick Links</h3>
            <ul className="space-y-4">
              {[
                { text: "About Us", href: "/about" },
                { text: "Our Products", href: "/products" },
                { text: "Virtual Try-On", href: "/virtual-try-on" },
                { text: "Beauty Blog", href: "/blog" },
                { text: "Contact Us", href: "/contact" }
              ].map((link) => (
                <li key={link.text}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-accent transition-colors duration-300"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className={`${playfair.className} text-lg font-medium mb-6`}>Categories</h3>
            <ul className="space-y-4">
              {[
                { text: "Makeup", href: "/category/makeup" },
                { text: "Skincare", href: "/category/skincare" },
                { text: "Tools & Brushes", href: "/category/tools" },
                { text: "Gift Sets", href: "/category/sets" },
                { text: "New Arrivals", href: "/new-arrivals" }
              ].map((link) => (
                <li key={link.text}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-accent transition-colors duration-300"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={`${playfair.className} text-lg font-medium mb-6`}>Newsletter</h3>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for exclusive offers and beauty tips.
            </p>
            <form className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-white/10 rounded-lg text-white placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-accent text-white rounded-lg font-medium 
                         hover:shadow-lg hover:shadow-accent/30 transition-all duration-300"
              >
                Subscribe Now
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Luxury Beauty. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {[
                { text: "Privacy Policy", href: "/privacy" },
                { text: "Terms of Service", href: "/terms" },
                { text: "Shipping Info", href: "/shipping" }
              ].map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-accent transition-colors duration-300"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
