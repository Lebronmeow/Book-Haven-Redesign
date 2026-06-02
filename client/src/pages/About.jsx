import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Users, Mail } from 'lucide-react';
import PerspectiveCard from '../components/PerspectiveCard';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const values = [
  {
    title: 'Passion for Reading',
    description:
      "We're dedicated to sharing the joy of reading with our customers.",
  },
  {
    title: 'Customer Satisfaction',
    description:
      'We strive to provide exceptional service, fast shipping, and hassle-free returns.',
  },
  {
    title: 'Community Building',
    description:
      'We aim to create a welcoming space for readers to connect, share, and discover new books.',
  },
  {
    title: 'Quality and Selection',
    description:
      'We offer a curated selection of books, including bestsellers, classics, and hidden gems.',
  },
];

export default function About() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="section-heading mb-4">About Book Haven</h1>
          <p className="text-cream-300 max-w-2xl mx-auto text-lg">
            At Book Haven, we're passionate about connecting readers with the
            books they love. Our online bookstore is dedicated to providing a
            vast selection of titles, competitive prices, and exceptional
            customer service.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Our Story */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={cardVariants}
          >
            <PerspectiveCard>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-gold-500/10">
                  <BookOpen className="text-gold-500" size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-serif text-cream-50">
                  Our Story
                </h2>
              </div>
              <p className="text-cream-300 leading-relaxed">
                Book Haven was founded by book lovers, for book lovers. We
                believe that reading has the power to transform lives, spark
                imagination, and foster a deeper understanding of the world
                around us. Our mission is to create a welcoming and inclusive
                space for book enthusiasts to discover new authors, explore
                different genres, and build a community of like-minded readers.
              </p>
            </PerspectiveCard>
          </motion.div>

          {/* Our Values */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={cardVariants}
          >
            <PerspectiveCard>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-gold-500/10">
                  <Heart className="text-gold-500" size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-serif text-cream-50">
                  Our Values
                </h2>
              </div>
              <ul className="space-y-3">
                {values.map((value, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-gold-500 mt-0.5 shrink-0">✦</span>
                    <div>
                      <span className="text-cream-100 font-medium">
                        {value.title}:
                      </span>{' '}
                      <span className="text-cream-300">{value.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </PerspectiveCard>
          </motion.div>

          {/* Meet the Creator */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={cardVariants}
          >
            <PerspectiveCard>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-gold-500/10">
                  <Users className="text-gold-500" size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-serif text-cream-50">
                  Meet the Creator
                </h2>
              </div>
              <div className="space-y-3 text-cream-300">
                <p className="text-cream-100 font-medium text-lg">
                  {import.meta.env.VITE_APP_NAME}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-gold-500/70" />
                  {import.meta.env.VITE_APP_EMAIL}
                </p>
                <p className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-gold-500/70"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <a
                    href={import.meta.env.VITE_APP_LINKEDIN}
                    className="text-gold-500 hover:text-gold-400 transition-colors gold-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ryan-pereira49
                  </a>
                </p>
              </div>
            </PerspectiveCard>
          </motion.div>

          {/* Get in Touch */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={cardVariants}
          >
            <PerspectiveCard>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-gold-500/10">
                  <Mail className="text-gold-500" size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-serif text-cream-50">
                  Get in Touch
                </h2>
              </div>
              <p className="text-cream-300 leading-relaxed mb-4">
                Thanks for visiting Book Haven! If you have any questions,
                feedback, or just want to chat about books, please don't
                hesitate to contact us.
              </p>
              <p className="text-cream-100 font-serif text-lg">
                Happy Reading! ✦
              </p>
            </PerspectiveCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
