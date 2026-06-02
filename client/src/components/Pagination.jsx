import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ totalPosts, postPerPage, setCurrentPage, currentPage }) {
  const totalPages = Math.ceil(totalPosts / postPerPage);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  }, [totalPages, currentPage]);

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 py-4" aria-label="Pagination">
      {/* Previous Button */}
      <button
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-full glass text-cream-100 transition-all duration-200 hover:border hover:border-gold-500/50 hover:shadow-[0_0_12px_rgba(212,175,55,0.15)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-transparent disabled:hover:shadow-none"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center text-cream-200/40 text-sm font-sans select-none"
              >
                ···
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <motion.button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`relative w-10 h-10 rounded-full text-sm font-sans font-medium transition-all duration-200 ${
                isActive
                  ? 'text-surface-900'
                  : 'glass text-cream-100 hover:border hover:border-gold-500/50 hover:shadow-[0_0_12px_rgba(212,175,55,0.15)]'
              }`}
              whileTap={{ scale: 0.92 }}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {isActive && (
                <motion.span
                  layoutId="activePage"
                  className="absolute inset-0 rounded-full bg-gold-500"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{page}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-full glass text-cream-100 transition-all duration-200 hover:border hover:border-gold-500/50 hover:shadow-[0_0_12px_rgba(212,175,55,0.15)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-transparent disabled:hover:shadow-none"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
