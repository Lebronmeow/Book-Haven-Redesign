import React, { useEffect, useState } from "react";
import BookElement from "../components/BookElement";
import HeroSection from "../components/HeroSection";
import { UserContext } from "../context/userContext";
import { useContext } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";

export default function Home() {
  const [data, setData] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(15);

  const { user, loading: userLoading } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/book/books");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [cart]);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await axios.post("/api/cart/fetch", { username: user.username });
          setCart(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchCart();
  }, [user]);

  const isInCart = (isbn) => {
    if (user && cart) {
      return cart.some(item => item.product === isbn);
    }
  };

  const handleAddToCart = async () => {
    if (user) {
      try {
        const response = await axios.post("/api/cart/fetch", { username: user.username });
        setCart(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const updatePostsPerPage = () => {
      if (window.innerWidth > 800) {
        setPostPerPage(15);
      } else {
        setPostPerPage(12);
      }
    };

    updatePostsPerPage();
    window.addEventListener("resize", updatePostsPerPage);

    return () => window.removeEventListener("resize", updatePostsPerPage);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-cream-300 font-serif text-lg">Loading your haven...</p>
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

  if (!data || !Array.isArray(data)) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-cream-300 font-serif text-lg">Loading your haven...</p>
        </div>
      </div>
    );
  }

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPosts = data.slice(firstPostIndex, lastPostIndex);

  return (
    <div className="bg-surface-900 min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Books Section */}
      <section id="books-section" className="relative px-4 md:px-8 lg:px-16 py-16 md:py-24">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-12 md:mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-gold-500" />
            <span className="text-gold-500 font-medium tracking-widest uppercase text-sm">
              Curated Collection
            </span>
            <Sparkles className="w-5 h-5 text-gold-500" />
          </div>
          <h2 className="section-heading text-center">
            Explore Our Library
          </h2>
          <p className="text-cream-300/60 mt-4 text-center max-w-xl">
            Thousands of titles across every genre, handpicked for the curious mind.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-8 md:gap-16 mb-12"
        >
          {[
            { icon: BookOpen, label: "Books", value: data.length + "+" },
            { icon: TrendingUp, label: "Categories", value: "20+" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <stat.icon className="w-5 h-5 text-gold-500" />
              <div>
                <p className="text-cream-50 font-bold text-lg">{stat.value}</p>
                <p className="text-cream-300/50 text-xs uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Book Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6 lg:gap-8">
          {currentPosts.map((book, index) => (
            <motion.div
              key={book.isbn_13}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
            >
              <BookElement
                image={book.image_sm}
                name={book.title}
                author={book.author}
                price={book.price}
                isbn={book.isbn_13}
                inCart={user ? isInCart(book.isbn_13) : false}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="py-12 flex justify-center">
          <Pagination
            totalPosts={data.length}
            postPerPage={postPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      </section>
    </div>
  );
}
