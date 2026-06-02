import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus, Minus, X, ShoppingBag, Tag, Truck, Receipt, CreditCard } from "lucide-react";

export default function Cart() {
  const { user, loading: userLoading } = useContext(UserContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let total = useRef(0);

  useEffect(() => {
    if (userLoading) return;

    if (user) {
      const fetchData = async () => {
        try {
          const response = await axios.post("/api/cart/load", { username: user.username });
          setData(response.data);
          setLoading(false);
          total.current = 0;
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

  async function handleIncrement(product) {
    try {
      const response = await axios.post("/api/cart/increment", { username: user.username, product: product });
      setData(response.data);
      total.current = 0;
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDecrement(product) {
    try {
      const response = await axios.post("/api/cart/decrement", { username: user.username, product: product });
      setData(response.data);
      total.current = 0;
    } catch (error) {
      console.log(error);
    }
  }

  function calculateTotal(price, quantity) {
    total.current = total.current + price * quantity;
  }

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-cream-300 font-serif text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center pt-20">
        <div className="glass-strong p-8 rounded-2xl text-center max-w-sm">
          <ShoppingBag className="w-12 h-12 text-cream-300/30 mx-auto mb-4" />
          <p className="text-cream-100 text-lg font-serif">Please sign in</p>
          <p className="text-cream-300/50 mt-2 text-sm">Log in to view your cart</p>
        </div>
      </div>
    );
  }

  if (data == null || data.length === 0) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center pt-20">
        <div className="glass-strong p-8 rounded-2xl text-center max-w-sm">
          <ShoppingBag className="w-16 h-16 text-cream-300/20 mx-auto mb-4" />
          <p className="text-cream-100 text-xl font-serif">Your cart is empty</p>
          <p className="text-cream-300/50 mt-2">Start exploring our collection!</p>
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="section-heading">Your Cart</h1>
          <p className="text-cream-300/50 mt-2">{data.length} {data.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {data.map((book, index) => {
              calculateTotal(book.price, book.quantity);
              return (
                <motion.div
                  key={book.isbn_13}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-xl p-4 flex items-center gap-4"
                >
                  {/* Book Image */}
                  <img
                    className="w-16 h-20 object-cover rounded-lg shadow-lg flex-shrink-0"
                    src={(import.meta.env.VITE_APP_DOMAIN || 'https://bookhaven.ryanpereira.xyz') + book.image_sm}
                    alt={book.title}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-cream-100 font-medium truncate">{book.title}</p>
                    <p className="text-cream-300/50 text-sm">{book.author}</p>
                    <p className="text-gold-500 font-semibold mt-1">${book.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full border border-cream-300/20 flex items-center justify-center text-cream-300 hover:border-gold-500 hover:text-gold-500 transition-colors"
                      onClick={() => handleDecrement(book.isbn_13)}
                    >
                      {book.quantity === 1 ? <X className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-cream-100 font-medium w-8 text-center">{book.quantity}</span>
                    <button
                      className="w-8 h-8 rounded-full border border-cream-300/20 flex items-center justify-center text-cream-300 hover:border-gold-500 hover:text-gold-500 transition-colors"
                      onClick={() => handleIncrement(book.isbn_13)}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <p className="text-cream-100 font-semibold w-20 text-right">
                    ${(book.price * book.quantity).toFixed(2)}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Checkout Card */}
          <div className="lg:w-80">
            <div className="glass-strong rounded-2xl p-6 sticky top-28">
              <h3 className="text-cream-100 font-serif text-lg font-semibold mb-5">Order Summary</h3>

              {/* Promo */}
              <div className="flex gap-2 mb-5">
                <input
                  className="input-premium flex-1 text-sm py-2"
                  placeholder="Promo code"
                />
                <button className="btn-outline-gold py-2 px-3 text-sm">
                  <Tag className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-cream-300/60 flex items-center gap-2">
                    <Receipt className="w-3.5 h-3.5" /> Subtotal
                  </span>
                  <span className="text-cream-100">${total.current.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream-300/60 flex items-center gap-2">
                    <Receipt className="w-3.5 h-3.5" /> Tax (13%)
                  </span>
                  <span className="text-cream-100">${(total.current * 0.13).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream-300/60 flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5" /> Shipping
                  </span>
                  <span className="text-cream-100">${(total.current * 0.05).toFixed(2)}</span>
                </div>

                <div className="border-t border-cream-300/10 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-cream-100 font-semibold text-base">Total</span>
                    <span className="text-gold-500 font-bold text-lg">
                      ${(total.current + total.current * 0.13 + total.current * 0.05).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button className="btn-gold w-full mt-6 flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" />
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
