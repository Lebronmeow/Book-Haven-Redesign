import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Heart, Trash2, BookOpen } from "lucide-react";

export default function Wishlist() {
  const { user, loading: userLoading } = useContext(UserContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLoading) return;

    if (user) {
      const fetchData = async () => {
        try {
          const response = await axios.post("/api/wishlist/load", { username: user.username });
          setData(response.data);
          setLoading(false);
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
      setError(new Error("User not logged in"));
    }
  }, [user, userLoading]);

  async function handleRemove(product) {
    try {
      const response = await axios.post("/api/wishlist/remove", { username: user.username, product: product });
      setData(response.data);
      toast.error("Removed from wishlist");
    } catch (error) {
      console.log(error);
    }
  }

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-cream-300 font-serif text-lg">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center pt-20">
        <div className="glass-strong p-8 rounded-2xl text-center max-w-sm">
          <Heart className="w-12 h-12 text-cream-300/30 mx-auto mb-4" />
          <p className="text-cream-100 text-lg font-serif">Please sign in</p>
          <p className="text-cream-300/50 mt-2 text-sm">Log in to view your wishlist</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center pt-20">
        <div className="glass-strong p-8 rounded-2xl text-center max-w-sm">
          <Heart className="w-16 h-16 text-cream-300/20 mx-auto mb-4" />
          <p className="text-cream-100 text-xl font-serif">Your wishlist is empty</p>
          <p className="text-cream-300/50 mt-2">Start saving books you love!</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-surface-900 pt-24 pb-16 px-4 md:px-8 lg:px-16"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="section-heading">Your Wishlist</h1>
          <p className="text-cream-300/50 mt-2">{data.length} {data.length === 1 ? 'book' : 'books'} saved</p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((book, index) => (
            <motion.div
              key={book.isbn_13}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-xl p-4 flex gap-4 group hover:border-gold-500/20 transition-colors cursor-pointer"
              onClick={() => navigate("/details", { state: book.isbn_13 })}
            >
              {/* Book Image */}
              <img
                className="w-16 h-22 object-cover rounded-lg shadow-lg flex-shrink-0"
                src={import.meta.env.VITE_APP_DOMAIN + book.image_sm}
                alt={book.title}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-cream-100 font-medium truncate group-hover:text-gold-500 transition-colors">
                  {book.title}
                </p>
                <p className="text-cream-300/50 text-sm mt-1">{book.author}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-gold-500 font-semibold">${book.price}</span>
                  <button
                    className="p-2 rounded-full hover:bg-red-500/10 text-cream-300/40 hover:text-red-400 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(book.isbn_13);
                    }}
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
