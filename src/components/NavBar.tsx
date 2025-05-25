"use client";

import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { AiOutlineShoppingCart, AiOutlineSearch, AiOutlineClose, AiOutlineUser } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = ({ setShowCart }: any) => {
  const cartCount = useAppSelector((state) => state.cartReducer.length);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainMenuItems = [
    { label: "New Arrivals", href: "/new" },
    { label: "Makeup", href: "/makeup" },
    { label: "Skincare", href: "/skincare" },
    { label: "Virtual Try-On", href: "/virtual-try-on" },
    { label: "Gifts", href: "/gifts" },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-accent text-white text-center py-2 text-sm font-light tracking-wider">
        FREE SHIPPING ON ALL ORDERS OVER $50 | JOIN OUR LOYALTY PROGRAM
      </div>
      
      {/* Main Navigation */}
      <div 
        className={`
          fixed w-full z-50 transition-all duration-300
          ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'}
          dark:bg-gray-900/95
        `}
      >
        <div className="container mx-auto px-4">
          {/* Upper Nav */}
          <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="lg:hidden text-2xl dark:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <AiOutlineClose /> : <RxHamburgerMenu />}
            </motion.button>

            <Link href="/" className="text-3xl font-serif text-gray-800 dark:text-white">
          GLAM AI
        </Link>

            <div className="flex items-center gap-6">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "300px" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="hidden lg:flex relative"
                  >
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 
                               dark:bg-gray-800 dark:text-white focus:outline-none focus:border-accent/50
                               focus:ring-2 focus:ring-accent/20"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-4 text-2xl">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-800 dark:text-white hidden lg:block"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  {isSearchOpen ? <AiOutlineClose /> : <AiOutlineSearch />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-800 dark:text-white"
                >
                  <AiOutlineUser />
                </motion.button>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
            className="relative cursor-pointer"
            onClick={() => setShowCart(true)}
          >
                  <AiOutlineShoppingCart className="text-gray-800 dark:text-white" />
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-accent w-5 h-5 rounded-full text-white 
                               text-xs grid place-items-center font-medium"
                    >
              {cartCount}
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Lower Nav - Desktop Menu */}
          <nav className="hidden lg:block">
            <ul className="flex justify-center items-center gap-12 py-4">
              {mainMenuItems.map((item) => (
                <motion.li
                  key={item.label}
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link 
                    href={item.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors
                             tracking-wide text-sm uppercase font-medium"
                  >
                    {item.label}
                  </Link>
                  <motion.div
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300
                             group-hover:w-full"
                  />
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="lg:hidden fixed inset-x-0 top-[140px] bg-white dark:bg-gray-900 shadow-xl"
              >
                <nav className="container mx-auto px-4 py-6">
                  <ul className="flex flex-col gap-4">
                    {mainMenuItems.map((item) => (
                      <motion.li
                        key={item.label}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link 
                          href={item.href}
                          className="text-gray-600 dark:text-gray-300 hover:text-accent transition-colors
                                   block py-2 text-lg font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Spacer for fixed header */}
      <div className="h-[140px]" />
    </>
  );
};

export default NavBar;
