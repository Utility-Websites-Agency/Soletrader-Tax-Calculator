"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame } from "framer-motion";

function GridPattern({ id, offsetX, offsetY }: { id: string; offsetX: any; offsetY: any }) {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse" x={offsetX} y={offsetY}>
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export function BackgroundEffects() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.5) % 40);
    gridOffsetY.set((gridOffsetY.get() + 0.5) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 text-gray-400 opacity-[0.05]">
        <GridPattern id="grid-static" offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      <motion.div className="absolute inset-0 text-gray-400 opacity-40" style={{ maskImage, WebkitMaskImage: maskImage }}>
        <GridPattern id="grid-reveal" offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>
      <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-orange-500/20 blur-[120px]" />
      <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-blue-500/15 blur-[100px]" />
      <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
    </div>
  );
}
