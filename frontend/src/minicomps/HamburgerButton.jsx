import React from 'react';
import { motion } from 'framer-motion';

const HamburgerButton = ({ isExpanded, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-md focus:outline-none"
      aria-label="Toggle navigation"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" className="text-text-secondary hover:text-text-primary">
        <motion.path
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          animate={isExpanded ? { d: "M 4 4 L 20 20" } : { d: "M 4 6 L 20 6" }}
        />
        <motion.path
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          d="M 4 12 L 20 12"
          animate={isExpanded ? { opacity: 0 } : { opacity: 1 }}
        />
        <motion.path
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          animate={isExpanded ? { d: "M 4 20 L 20 4" } : { d: "M 4 18 L 20 18" }}
        />
      </svg>
    </button>
  );
};

export default HamburgerButton;