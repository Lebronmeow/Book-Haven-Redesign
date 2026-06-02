import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useContext } from "react";
import axios from "axios";
import CircularGallery from "../components/CircularGallery";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  HeartOff,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Building2,
  Hash,
  Layers,
  ArrowLeft,
} from "lucide-react";

export default function Details() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useContext(UserContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recom, setRecom] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [InWishlist, SetInWishlist] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/book/details", { isbn: state });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [state]);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await axios.post("/api/cart/fetch", { username: user.username });
          const cartData = response.data;
          setInCart(cartData.some((item) => item.product === state));
        } catch (error) {
          console.log(error);
        }
      }
    };

    if (user) {
      fetchCart();
    }
  }, [user, state]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await axios.post("/api/wishlist/get", { username: user.username });
          const wishlistData = response.data;
          SetInWishlist(wishlistData.some((item) => item === state));
        } catch (error) {
          console.log(error);
        }
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user, state]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (data) {
        try {
          const response = await axios.post("/api/book/recommendation", {
            category: data.category,
            isbn: data.isbn_13,
          });
          setRecom(response.data);
        } catch (error) {
          setError(error);
        }
      }
    };

    fetchRecommendations();
  }, [data]);

  async function AddToCart(product) {
    try {
      const response = await axios.post("/api/cart/add", { username: user.username, product: product });
      if (response.data.success) {
        toast.success(response.data.success);
        setInCart(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function RemoveFromCart(product) {
    try {
      const response = await axios.post("/api/cart/remove", { username: user.username, product: product });
      if (response.data.success) {
        toast.error(response.data.success);
        setInCart(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function AddToWishlist(product) {
    try {
      const response = await axios.post("/api/wishlist/add", { username: user.username, product: product });
      if (response.data.success) {
        toast.success(response.data.success);
        SetInWishlist(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function RemoveFromWishlist(product) {
    try {
      const response = await axios.post("/api/wishlist/remove_min", { username: user.username, product: product });
      if (response.data.success) {
        toast.error(response.data.success);
        SetInWishlist(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-cream-300 font-serif text-lg">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="glass-strong p-8 rounded-2xl text-center">
          <p className="text-red-400 text-lg">Something went wrong</p>
          <p className="text-cream-300 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  const metaItems = [
    { icon: Hash, label: "ISBN 13", value: data.isbn_13 },
    { icon: Hash, label: "ISBN 10", value: data.isbn_10 },
    { icon: Layers, label: "Category", value: data.category },
    { icon: Building2, label: "Publisher", value: data.publisher },
    { icon: BookOpen, label: "Pages", value: data.page_count },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-surface-900 pt-24 pb-16"
    >
      {/* Back button */}
      <div className="px-4 md:px-8 lg:px-16 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cream-300/60 hover:text-gold-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Book Cover */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0 flex justify-center lg:justify-start"
          >
            <div className="perspective-1000">
              <div
                className="relative preserve-3d transition-transform duration-700 hover:rotate-y-[-12deg]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img
                  className="w-64 md:w-80 rounded-r-lg shadow-2xl"
                  src={import.meta.env.VITE_APP_DOMAIN + data.image_sm}
                  alt={data.title + " cover"}
                  style={{
                    boxShadow: '8px 8px 30px rgba(0,0,0,0.5), -2px -2px 10px rgba(212,175,55,0.05)',
                  }}
                />
                {/* Spine effect */}
                <div
                  className="absolute top-0 left-0 w-5 h-full rounded-l-sm"
                  style={{
                    background: 'linear-gradient(180deg, #C9A84C 0%, #856F24 50%, #C9A84C 100%)',
                    transform: 'translateX(-20px)',
                    boxShadow: '-2px 0 8px rgba(0,0,0,0.3)',
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Book Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col flex-1"
          >
            {/* Category badge */}
            <span className="inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-medium bg-gold-500/10 text-gold-500 border border-gold-500/20 mb-4">
              {data.category}
            </span>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-cream-50 leading-tight">
              {data.title}
            </h1>

            {/* Author */}
            <p className="text-cream-300/70 text-lg mt-3 font-light">
              by <span className="text-cream-200 font-medium">{data.author}</span>
            </p>

            {/* Price */}
            <p className="text-gold-500 text-3xl font-bold mt-4 font-serif">
              ${data.price - Math.floor(data.price) !== 0 ? data.price : data.price + ".00"}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              {inCart ? (
                <button
                  className="btn-outline-gold flex items-center justify-center gap-2"
                  onClick={() => RemoveFromCart(data.isbn_13)}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Remove From Cart
                </button>
              ) : (
                <button
                  className="btn-gold flex items-center justify-center gap-2"
                  onClick={() => user ? AddToCart(data.isbn_13) : toast.error("Please login to use cart")}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              )}
              {InWishlist ? (
                <button
                  className="btn-outline-gold flex items-center justify-center gap-2 border-red-400/40 text-red-400 hover:bg-red-400/10"
                  onClick={() => RemoveFromWishlist(data.isbn_13)}
                >
                  <HeartOff className="w-4 h-4" />
                  Remove from Wishlist
                </button>
              ) : (
                <button
                  className="btn-outline-gold flex items-center justify-center gap-2"
                  onClick={() => user ? AddToWishlist(data.isbn_13) : toast.error("Please login to use wishlist")}
                >
                  <Heart className="w-4 h-4" />
                  Add to Wishlist
                </button>
              )}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-cream-100 font-serif text-xl font-semibold mb-3">Description</h3>
              <div className="glass rounded-xl p-5">
                <motion.div
                  animate={{ height: expanded ? "auto" : "120px" }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-cream-300/80 leading-relaxed">
                    {data.overview}
                  </p>
                </motion.div>
                <button
                  className="flex items-center gap-1 text-gold-500 text-sm mt-3 hover:text-gold-400 transition-colors"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <>Show less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>Read more <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-8">
              {metaItems.map((item, i) => (
                <div key={i} className="glass rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="w-3.5 h-3.5 text-gold-500/70" />
                    <span className="text-cream-300/50 text-xs uppercase tracking-wider">{item.label}</span>
                  </div>
                  <p className="text-cream-100 text-sm font-medium truncate">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Read More — Circular Gallery */}
      {recom && recom.length > 0 && (
        <section className="mt-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-heading text-center mb-4">Read More</h2>
            <p className="text-cream-300/50 text-center mb-10">Books you might enjoy next</p>
            <CircularGallery
              items={recom}
              onItemClick={(isbn) => navigate("/details", { state: isbn })}
            />
          </motion.div>
        </section>
      )}
    </motion.div>
  );
}
