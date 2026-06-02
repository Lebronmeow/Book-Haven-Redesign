# 🕊️ Book Haven — Where Every Book is a Masterpiece

Welcome to **Book Haven**, an ultra-premium, interactive e-commerce experience designed to elevate the way we discover and purchase literature. Built for Ryan Pereira, Book Haven is not just a bookstore—it's a digital sanctuary for bibliophiles.

---

## 📖 The Lore

In a world where books are often treated as mere commodities, **Book Haven** was forged with a different philosophy: *Every book is a masterpiece with wings, waiting to transport its reader to another realm.* 

Represented by the Golden Book with Angel Wings, Book Haven is an ethereal, high-end library that bridges the gap between classic literary elegance and cutting-edge digital modernism. It is a place where luxury meets literature, designed specifically for those who believe reading is a sacred experience.

---

## ✨ Interactive & Immersive Experience

Book Haven was meticulously crafted using state-of-the-art interactive UI components to ensure that browsing feels alive, dynamic, and magical. 

### 🌟 Key Features:
- **Liquid Glass Navbar:** A stunning frosted glass header with golden accents that beautifully blurs the content beneath it as you scroll, providing a premium Apple-like aesthetic.
- **3D Hero Typography:** The landing page features a staggered, rotating 3D text reveal powered by Framer Motion, demanding attention the moment you arrive.
- **Interactive Circular Carousel:** Forget boring grids. Books are displayed in a smooth, continuous 3D circular gallery that effortlessly tracks your mouse movements. Just hover to rotate through the collection!
- **3D Book Spines:** Book covers aren't flat images—they are rendered with 3D perspectives. When you hover over a book, the cover opens slightly, revealing a stylized book spine and pages, making you feel like you are actually pulling a book off a physical shelf.
- **Dynamic Contact Shader:** The contact page is backed by an animated liquid shader background that subtly reacts and flows, creating a calming, immersive atmosphere while you type.
- **Integrated Spotify Vinyl Player:** A fully functional, authenticated Spotify Web Player is anchored to the screen. 
  - Log in securely via Spotify.
  - Watch the album cover slide out into a spinning vinyl record complete with a custom "BOOK HEAVEN" golden center label.
  - Double-click the player to open a sleek popover and search for any song on Spotify without leaving the bookstore.
  - The entire player is collapsible with a smooth spring animation for uninterrupted reading.

---

## 🛠️ Tech Stack

Book Haven is a modern web application leveraging top-tier frameworks and libraries:

- **Frontend:** React, Vite, TailwindCSS
- **Animations:** Framer Motion, GSAP
- **UI Components:** Inspired by 21st.dev
- **Backend/API:** Node.js, Express, MongoDB (via `bookhaven.ryanpereira.xyz`)
- **Music Integration:** Spotify Web Playback SDK & PKCE Authorization Code Flow
- **Deployment:** Vercel

---

## 🚀 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Lebronmeow/Book-Haven-Redesign.git
   ```

2. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

*(Note: In local development, the Vite proxy routes `/api` requests to the live backend server. When deployed to Vercel, `vercel.json` handles these rewrites automatically).*