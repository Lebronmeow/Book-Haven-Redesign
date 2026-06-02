import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Register from "../src/pages/Register";
import Navbar from "./components/Navbar";
import Details from "./pages/Details";
import Footer from "./components/Footer";
import { UserContextProvider } from "../src/context/userContext";
import Cart from "./pages/Cart";
import Contact from './pages/Contact';
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import { AnimatePresence, motion } from "framer-motion";

axios.defaults.withCredentials = true;

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/details' element={<Details />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <>
      <UserContextProvider>
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2000,
            style: {
              background: '#1A1A1D',
              color: '#FDF8E8',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#D4AF37',
                secondary: '#0A0A0B',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#0A0A0B',
              },
            },
          }}
        />
        <AnimatedRoutes />
        <Footer />
      </UserContextProvider>
    </>
  );
}

export default App;
