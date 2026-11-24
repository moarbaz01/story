"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { content } from "@/lib/content";

const petalTransforms = [
  "translate(160 102) rotate(0)", "translate(160 102) rotate(60)", "translate(160 102) rotate(120)",
  "translate(160 102) rotate(180)", "translate(160 102) rotate(240)", "translate(160 102) rotate(300)",
];

export function FlowerSection() {
  const [opened, setOpened] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<number | null>(null);
  const select = (index: number) => {
    setOpened((current) => new Set([...current, index]));
    setActive(index);
  };
  const complete = opened.size === 6;

  return (
    <section id="flower" className="flower-section scene-section" aria-labelledby="flower-title">
      <header className="section-heading">
        <p className="eyebrow">A flower made of little truths</p>
        <h2 id="flower-title">Six petals. Six reasons.</h2>
        <p>Touch each petal and let it tell you something I love.</p>
      </header>
      <div className={`flower-stage ${complete ? "flower-complete" : ""}`}>
        <div className="flower-halo" aria-hidden="true" />
        <motion.svg className="love-flower" viewBox="0 0 320 390" role="group" aria-label="Interactive flower with six petals" initial="closed" whileInView="open" viewport={{ once: true, amount: 0.35 }}>
          <defs>
            <radialGradient id="petalPaint"><stop stopColor="#fbc5dc" /><stop offset=".48" stopColor="#bc6bcf" /><stop offset="1" stopColor="#5b2e82" /></radialGradient>
            <linearGradient id="stemPaint" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#91b78c" /><stop offset="1" stopColor="#365d4e" /></linearGradient>
            <filter id="flowerGlow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <motion.path d="M160 162 C158 230 165 290 158 365" fill="none" stroke="url(#stemPaint)" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
          <path d="M159 280 Q115 245 91 280 Q132 309 159 290" fill="#52765d" opacity=".75" />
          <path d="M160 322 Q203 283 229 313 Q196 344 160 334" fill="#52765d" opacity=".68" />
          {content.petals.map((message, i) => {
            const isOpen = opened.has(i);
            return (
              <g key={message} transform={petalTransforms[i]}>
                <motion.path
                  d="M0 0 C23 -55 78 -66 92 -27 C103 5 58 31 0 0Z"
                  fill="url(#petalPaint)" stroke={isOpen ? "#ffe8a6" : "rgba(255,255,255,.45)"} strokeWidth={isOpen ? 2 : 1}
                  className="petal"
                  role="button" tabIndex={0} aria-label={`Petal ${i + 1}: ${isOpen ? message : "discover reason"}`} aria-pressed={isOpen}
                  initial={{ opacity: 0, scale: 0, rotate: -12 }}
                  whileInView={{ opacity: 1, scale: isOpen ? 1.08 : 1, rotate: isOpen ? -5 : 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ delay: 0.1 * i, type: "spring", stiffness: 100, damping: 14 }}
                  whileHover={{ scale: 1.045 }} whileFocus={{ scale: 1.045 }}
                  onClick={() => select(i)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(i); } }}
                  style={{ transformOrigin: "0px 0px", filter: isOpen ? "url(#flowerGlow)" : "none", outline: "none" }}
                />
              </g>
            );
          })}
          <motion.circle cx="160" cy="102" r="29" fill="#e7ab62" stroke="#ffe8ad" strokeWidth="2" animate={{ scale: complete ? [1, 1.17, 1.05] : 1 }} />
          <circle cx="160" cy="102" r="17" fill="#6e3e6e" opacity=".65" />
        </motion.svg>
        <div className="petal-progress" aria-live="polite">
          <span>{opened.size} of 6 petals discovered</span>
          <span className="progress-line"><i style={{ width: `${opened.size / 6 * 100}%` }} /></span>
        </div>
        <div className="reason-space" aria-live="polite">
          <AnimatePresence mode="wait">
            {active !== null && <motion.p key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>“{content.petals[active]}”</motion.p>}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {complete && <motion.p className="flower-final" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>And these are still only six reasons out of infinity.</motion.p>}
      </AnimatePresence>
    </section>
  );
}
