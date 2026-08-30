"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface AnimatedAuthWrapperProps {
  children: React.ReactNode;
  logoSrc: StaticImageData;
}

export default function AnimatedAuthWrapper({ children, logoSrc }: AnimatedAuthWrapperProps) {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center py-5 justify-center bg-gray-50 gap-8">
      <motion.div
        layout // Automatically animates positional changes in the DOM
        initial={{ scale: 1.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex size-20 items-center justify-center"
      >
        <Link href={"/"}>
          <Image 
            src={logoSrc} 
            alt={"KOA Warrior Face"} 
            className="drop-shadow-2xl"
          />
        </Link>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}