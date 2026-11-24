"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { Burst } from "./Burst";

export function ForeverQuestion({ onYes }: { onYes: () => void }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [yes, setYes] = useState(false);

  const evade = () => {
    const area = areaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const maxX = Math.max(0, Math.min(rect.width / 2 - 80, 150));
    const maxY = Math.max(0, Math.min(rect.height / 2 - 36, 75));
    const next = attempts + 1;
    setAttempts(next);
    setPosition({ x: (Math.random() * 2 - 1) * maxX, y: (Math.random() * 2 - 1) * maxY });
  };
  const accept = () => {
    setYes(true);
    window.setTimeout(onYes, 2200);
  };

  return (
    <section id="forever" className="question-section scene-section" aria-labelledby="forever-title">
      <div className="question-orbit" aria-hidden="true"><i /><i /><i /></div>
      <AnimatePresence mode="wait">
        {!yes ? (
          <motion.div key="question" className="question-content" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} exit={{ opacity: 0, scale: .96 }}>
            <p className="eyebrow">One important question</p>
            <h2 id="forever-title">Nisha, will you stay with me forever?</h2>
            <div className="question-actions" ref={areaRef}>
              <button className="primary-button yes-button" onClick={accept}>Obviously, yes <span aria-hidden="true">♥</span></button>
              <motion.button className="secondary-button think-button" animate={position} transition={{ type: "spring", stiffness: 380, damping: 24 }} onPointerEnter={evade} onPointerDown={(event) => { if (event.pointerType !== "mouse") { event.preventDefault(); evade(); } }} onClick={() => { /* Keyboard and assistive-tech users can always select this safely. */ setAttempts(3); setPosition({ x: 0, y: 0 }); }}>
                {attempts >= 3 ? "You already know the answer" : "Let me think"}
              </motion.button>
            </div>
            <p className="keyboard-hint">Keyboard note: both choices remain still while focused.</p>
          </motion.div>
        ) : (
          <motion.div key="accepted" className="accepted" initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }}>
            <Burst id={1} count={48} hearts />
            <span className="accepted-heart" aria-hidden="true">♥</span>
            <h2>Best decision ever.</h2><p>There’s something I’ve been meaning to give you…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
