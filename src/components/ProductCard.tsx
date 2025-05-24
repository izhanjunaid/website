import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AiOutlineShoppingCart, AiOutlineHeart, AiFillStar } from "react-icons/ai";
import { useAppDispatch } from "@/redux/hooks";
import { addToCart } from "@/redux/features/cartSlice";
import { toast } from "react-hot-toast";
import { API_CONFIG } from "@/config";

interface ProductCardProps {
  _id: string;
  name: string;
  img?: string;
  mainImage?: string;
  price: {
    $numberInt: string;
  } | number | string;
  sale?: boolean;
  rating?: number;
  category?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  name,
  img,
  mainImage,
  price,
  sale,
  rating = 0,
  category,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dispatch = useAppDispatch();

  const formatPrice = (price: any) => {
    if (typeof price === 'object' && price.$numberInt) {
      return (Number(price.$numberInt) / 100).toFixed(2);
    }
    if (typeof price === 'string') {
      return (Number(price) / 100).toFixed(2);
    }
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    return '0.00';
  };

  const getImageUrl = () => {
    // If img is a MongoDB ObjectId, use the GridFS endpoint
    if (typeof img === 'string' && img.length === 24) {
      return `${API_CONFIG.API_URL}/images/${img}`;
    }
    // If mainImage is a MongoDB ObjectId, use the GridFS endpoint
    if (typeof mainImage === 'string' && mainImage.length === 24) {
      return `${API_CONFIG.API_URL}/images/${mainImage}`;
    }
    // If no valid image ID is found, return empty string to trigger error handling
    return '';
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: _id,
        name,
        img: getImageUrl(),
        price,
        quantity: 1,
      })
    );
    toast.success("Added to cart");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {sale && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-accent text-white text-xs font-medium px-2.5 py-1 rounded-full">
            Sale
          </span>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-300"
      >
        <AiOutlineHeart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </motion.button>

      <Link href={`/details/${_id}`}>
        <div className="relative aspect-square overflow-hidden">
          {!imageError ? (
            <Image
              src={getImageUrl()}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="transform transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <AiOutlineShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center mb-2">
            <div className="flex items-center text-yellow-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <AiFillStar
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.floor(rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({rating})
            </span>
          </div>

          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2 line-clamp-2">
            {name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="text-accent font-semibold">
              ${formatPrice(price)}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              className="p-2 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-full transition-all duration-300"
            >
              <AiOutlineShoppingCart className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 20
        }}
        className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent"
      >
        <p className="text-sm text-white line-clamp-2">
          {category && `Category: ${category}`}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
