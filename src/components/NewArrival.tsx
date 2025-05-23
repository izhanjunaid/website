"use client";
import React, { useEffect, useState } from "react";
import { Playfair_Display } from "next/font/google";
import ProductCard from "./ProductCard";
import { IProduct, api } from "@/utils/api";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400"] });

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
        new Set(data.map((product) => product.category.toLowerCase()))
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
        (product) => product.category.toLowerCase() === category
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
      <div className="container pt-32 text-center">
        <h2 className="text-2xl">Loading products...</h2>
      </div>
    );
  }

  if (error && displayedProducts.length === 0) {
    return (
      <div className="container pt-32 text-center">
        <h2 className="text-2xl text-red-500">{error}</h2>
      </div>
    );
  }

  return (
    <div className="container pt-32">
      <div className="text-center">
        <h3 className={`${playfair.className} text-[40px] text-gray-500`}>
          For your beauty
        </h3>
        <h2 className="font-semibold text-5xl">New Arrival</h2>

        <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center pt-8 uppercase font-medium text-xl">
          {tabsData.map((text, index) => (
            <li
              key={text}
              className={`${
                selectedTab === index ? "text-accent" : ""
              } cursor-pointer hover:text-accent`}
              onClick={() => handleTab(index)}
            >
              {text}
            </li>
          ))}
        </ul>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-8">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <ProductCard key={product._id} {...product} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewArrival;
