// HomeTab.jsx

import React from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion for animations

const HomeTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial animation state
      animate={{ opacity: 1 }} // Animation when component is mounted
      exit={{ opacity: 0 }} // Animation when component is unmounted
      transition={{ duration: 0.5 }} // Transition duration
      className="home-tab-container"
    >
      {/* Your home tab content with cool graphics */}
      <div className="home-hero-section">
        <span className="home-text">
          <span className="home-text01">Analysis and insights </span>
          <span>into your </span>
          <span className="home-text03">presentation skills</span>
        </span>
        <div className="home-container1"></div>
        <div className="home-illustration">
          <img src="path/to/your/image.png" alt="Your Image" className="home-image21" />
        </div>
      </div>
      <div className="home-community">
        {/* Add more cool graphics and animations here */}
      </div>
    </motion.div>
  );
};

export default HomeTab;
