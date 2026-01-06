// src/components/PageTransition.jsx

import React from "react";
import { motion as Motion } from "framer-motion";

const PageTransition = ({ children }) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </Motion.div>
  );
};

export default PageTransition;
