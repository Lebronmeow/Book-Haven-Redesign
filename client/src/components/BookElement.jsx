import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
import './Book3D.css';

export default function BookElement({ image, name, author, price, isbn, inCart, onAddToCart }) {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useContext(UserContext);

  async function AddToCart(product) {
    try {
      const response = await axios.post("api/cart/add", { username: user.username, product: product });
      if (response.data.success) {
        toast.success(response.data.success);
        onAddToCart();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function RemoveFromCart(product) {
    try {
      const response = await axios.post("api/cart/remove", { username: user.username, product: product });
      if (response.data.success) {
        toast.error(response.data.success);
        onAddToCart();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const formattedPrice = price - Math.floor(price) !== 0 ? price : price + ".00";

  return (
    <motion.div
      className="flex flex-col gap-y-3 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* 3D Book */}
      <motion.div
        className="book-3d-container"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={() => navigate("/details", { state: isbn })}
      >
        <div className="book-3d">
          <div className="book-3d-back" />
          <div className="book-3d-spine" />
          <div className="book-3d-front">
            <img
              src={(import.meta.env.VITE_APP_DOMAIN || 'https://bookhaven.ryanpereira.xyz') + image}
              alt={name + " cover"}
              className="w-full aspect-[2/3] object-cover"
              loading="lazy"
            />
          </div>
          <div className="book-3d-overlay">
            <p className="text-cream-50 text-sm font-serif font-semibold truncate">
              {name}
            </p>
            <p className="text-cream-200/60 text-xs truncate mt-0.5">
              {author}
            </p>
            <p className="text-gold-500 text-sm font-semibold mt-1">
              ${formattedPrice}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Book Info */}
      <div className="px-1">
        <h2
          className="text-cream-100 font-medium text-sm md:text-base truncate cursor-pointer hover:text-gold-400 transition-colors duration-200"
          onClick={() => navigate("/details", { state: isbn })}
        >
          {name}
        </h2>
        <p className="text-cream-300/60 text-xs md:text-sm truncate mt-0.5">
          {author}
        </p>
        <p className="text-gold-500 font-semibold text-sm md:text-base mt-1">
          ${formattedPrice}
        </p>
      </div>

      {/* Cart Button */}
      <div className="px-1">
        {inCart ? (
          <button
            className="w-full btn-outline-gold text-xs md:text-sm py-2 px-4 rounded-lg transition-all duration-200"
            onClick={() => RemoveFromCart(isbn)}
          >
            In Cart
          </button>
        ) : user ? (
          <button
            className="w-full btn-gold text-xs md:text-sm py-2 px-4 rounded-lg transition-all duration-200"
            onClick={() => AddToCart(isbn)}
          >
            Add to Cart
          </button>
        ) : (
          <button
            className="w-full btn-gold text-xs md:text-sm py-2 px-4 rounded-lg transition-all duration-200"
            onClick={() => navigate("/details", { state: isbn })}
          >
            Read More
          </button>
        )}
      </div>
    </motion.div>
  );
}
