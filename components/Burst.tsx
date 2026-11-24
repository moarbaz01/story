"use client";

import { motion } from "framer-motion";

export function Burst({ id = 0, count = 24, hearts = false }: { id?: number; count?: number; hearts?: boolean }) {
  return (
    <div className="burst" aria-hidden="true" key={id}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + (i % 3) * 0.08;
        const distance = 70 + (i % 7) * 16;
        return (
          <motion.span
            className={hearts && i % 3 === 0 ? "burst-heart" : "burst-dot"}
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.2 }}
            animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, opacity: 0, scale: hearts ? 1 : 0.6 }}
            transition={{ duration: 1.25, ease: "easeOut", delay: (i % 4) * 0.025 }}
          >{hearts && i % 3 === 0 ? "♥" : ""}</motion.span>
        );
      })}
    </div>
  );
}
