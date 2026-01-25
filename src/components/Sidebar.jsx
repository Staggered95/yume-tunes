import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Placeholder icons
const HomeIcon = () => <svg>...</svg>; 
const SongsIcon = () => <svg>...</svg>;

const navItems = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Songs', icon: <SongsIcon /> },
];

const Sidebar = ({ isExpanded }) => {
  return (
    <motion.div
      initial={{ x: '-100%' }} 
      // Animate properties based on the isExpanded prop
      animate={{
        // On mobile, slide in and out from the left
        x: isExpanded ? 0 : '-100%',
        // On desktop, expand and collapse width
        width: isExpanded ? '16rem' : '5rem',
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="
        fixed top-22 bottom-30 left-0 bg-background-secondary p-4 rounded-r-xl
        flex flex-col z-20 
        lg:translate-x-0
      "
    >
      {/* Navigation Links */}
      <nav>
        <ul className="space-y-4 mt-10">
          {navItems.map((item) => (
            <li key={item.name}>
              <a href="#" className="flex items-center gap-4 p-2 rounded-md text-text-secondary hover:bg-background-hover hover:text-text-primary">
                <div className="w-8 h-8 flex-shrink-0">{item.icon}</div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;