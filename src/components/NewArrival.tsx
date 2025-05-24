"use client";
import React, { useEffect, useState } from "react";
import { Playfair_Display } from "next/font/google";
import ProductCard from "./ProductCard";
import { IProduct, api } from "@/utils/api";
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"] });

const NewArrival = () => {
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [tabsData, setTabsData] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setAllProducts(data);
      setDisplayedProducts(data);

      // Extract unique categories from products
      const categories = Array.from(
        new Set(data.map((product) => product.category?.toLowerCase() || 'Uncategorized'))
      );

      // Create tabs array with "All" first + unique categories with capitalization
      const tabs = ["All", ...categories.map(capitalize)];
      setTabsData(tabs);

      if (data.length === 0) {
        setError("No products available at the moment");
      } else {
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch products");
      console.error("Error fetching products:", err);
      setAllProducts([]);
      setDisplayedProducts([]);
      setTabsData(["All"]);
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1);

  const handleTab = (index: number) => {
    setSelectedTab(index);
    const category = tabsData[index].toLowerCase();

    if (category === "all") {
      setDisplayedProducts(allProducts);
      setError(null);
    } else {
      // Filter products locally by category
      const filtered = allProducts.filter(
        (product) => product.category?.toLowerCase() === category
      );
      setDisplayedProducts(filtered);

      if (filtered.length === 0) {
        setError(`No ${category} products available at the moment`);
      } else {
        setError(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="container min-h-[400px] pt-32 flex items-center justify-center">
        <FiLoader className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  if (error && displayedProducts.length === 0) {
    return (
      <div className="container pt-32 text-center">
        <h2 className="text-2xl text-red-500 font-medium">{error}</h2>
      </div>
    );
  }

  return (
    <div className="container pt-32 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h3 className={`${playfair.className} text-[40px] text-gray-500 mb-3`}>
          For your beauty
        </h3>
        <h2 className="font-semibold text-5xl mb-12">New Arrival</h2>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
          {tabsData.map((text, index) => (
            <motion.button
              key={text}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTab(index)}
              className={`
                px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
                ${selectedTab === index 
                  ? "bg-accent text-white shadow-lg shadow-accent/30" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {text}
            </motion.button>
          ))}
        </div>

        <motion.div 
          layout
          className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NewArrival;
