"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 250,
    damping: 40,
    bounce: 0,
  });

  return (
    <motion.div
      style={{ scaleY }}
      className="fixed right-0 top-0 w-[6px] h-full bg-[#2b7fff] origin-top z-[60]"
    />
  );
}
