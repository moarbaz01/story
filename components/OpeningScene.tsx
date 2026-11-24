"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { content } from "@/lib/content";
import { Burst } from "./Burst";

export function OpeningScene({ onEnter }: { onEnter: () => void }) {
  const reduced = useReducedMotion();
  const [line, setLine] = useState(0);
  const [ready, setReady] = useState(false);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (reduced) {
      const frame = requestAnimationFrame(() => { setLine(content.intro.length); setReady(true); });
      return () => cancelAnimationFrame(frame);
    }
    const timers = content.intro.map((_, i) => window.setTimeout(() => setLine(i), 900 + i * 2400));
    timers.push(window.setTimeout(() => { setLine(content.intro.length); setReady(true); }, 900 + content.intro.length * 2400));
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  const skip = () => { setLine(content.intro.length); setReady(true); };
  const enter = () => {
    setBurst(true);
    window.setTimeout(onEnter, reduced ? 50 : 750);
  };

  return (
    <section className="opening" aria-label="Opening scene">
      <div className="moon moon-opening" aria-hidden="true"><span /></div>
      {!ready && <button className="skip-intro" onClick={skip}>Skip intro</button>}
      <div className="opening-copy" aria-live="polite">
        <AnimatePresence mode="wait">
          {line < content.intro.length ? (
            <motion.p key={line} className="intro-line" initial={{ opacity: 0, y: 15, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 1 }}>
              {content.intro[line].split("").map((character, i) => (
                <motion.span key={`${character}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : i * 0.025 }}>{character === " " ? "\u00A0" : character}</motion.span>
              ))}
            </motion.p>
          ) : (
            <motion.div key="name" className="name-reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
              <p className="eyebrow">and her name is</p>
              <div className="name-stars" aria-label="Nisha">
                {content.name.split("").map((letter, i) => (
                  <motion.span key={letter + i} initial={{ opacity: 0, y: 20, scale: 0.7 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.16, duration: 0.8 }}>{letter}</motion.span>
                ))}
              </div>
              <svg className="name-constellation" viewBox="0 0 500 100" aria-hidden="true">
                <motion.path d="M18 63 L95 28 L173 63 L249 25 L330 68 L405 32 L482 58" fill="none" stroke="url(#nameLine)" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, delay: 0.5 }} />
                <defs><linearGradient id="nameLine"><stop stopColor="#d990ff" /><stop offset="1" stopColor="#ffc977" /></linearGradient></defs>
                {[18,95,173,249,330,405,482].map((x, i) => <circle key={x} cx={x} cy={[63,28,63,25,68,32,58][i]} r="3" fill="#fff3cf" />)}
              </svg>
              <div className="enter-wrap">
                {burst && <Burst count={36} hearts />}
                <button className="primary-button" onClick={enter}>Enter Nisha’s Universe</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="opening-horizon" aria-hidden="true" />
    </section>
  );
}
