"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

function StaticGrid({ id }: { id: string }) {
  return (
    <svg className="w-full h-full">
      <defs>
        <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export function BackgroundEffects() {
  const mouseX = useMotionValue(-999);
  const mouseY = useMotionValue(-999);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 text-gray-400 opacity-[0.05]">
        <StaticGrid id="grid-base" />
      </div>
      <motion.div className="absolute inset-0 text-gray-400 opacity-40" style={{ maskImage, WebkitMaskImage: maskImage }}>
        <StaticGrid id="grid-reveal" />
      </motion.div>
      <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-orange-500/20 blur-[120px]" />
      <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-blue-500/15 blur-[100px]" />
      <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
    </div>
  );
}
