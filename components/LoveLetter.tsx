"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { content } from "@/lib/content";

export function LoveLetter({ onComplete }: { onComplete: () => void }) {
  const [opened, setOpened] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const complete = index >= content.letter.length;
  const visibleText = useMemo(() => content.letter.slice(0, index), [index]);

  useEffect(() => {
    if (!opened || paused || complete) return;
    const delay = content.letter[index] === "\n" ? 110 : /[.,]/.test(content.letter[index] ?? "") ? 65 : 20;
    const timer = window.setTimeout(() => setIndex((current) => current + 1), delay);
    return () => clearTimeout(timer);
  }, [complete, index, opened, paused]);

  const reveal = () => { setIndex(content.letter.length); setPaused(false); };
  return (
    <section id="letter" className={`letter-section scene-section ${opened ? "letter-opened" : ""}`} aria-labelledby="letter-title">
      <header className="section-heading"><p className="eyebrow">For you, always</p><h2 id="letter-title">A letter sealed with everything I feel</h2></header>
      <div className="letter-stage">
        <AnimatePresence>
          {!opened && (
            <motion.button className="envelope" onClick={() => setOpened(true)} aria-label="Open Nisha's love letter" initial={{ y: 30, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} exit={{ y: 100, opacity: 0 }} whileHover={{ y: -7, rotate: -1 }}>
              <span className="envelope-back" /><span className="envelope-paper-edge" /><span className="envelope-front" /><span className="envelope-flap" />
              <span className="wax-seal">N</span><small>Tap to open</small>
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {opened && (
            <motion.article className="letter-paper" initial={{ y: 170, opacity: 0, rotateX: 12 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              <Sparkles className="letter-sparkle" aria-hidden="true" />
              <div className="letter-text" aria-live="off">{visibleText}<span className={complete ? "hidden-caret" : "writing-caret"} aria-hidden="true" /></div>
              <span className="sr-only" aria-live="polite">{complete ? "The complete love letter is revealed." : "The letter is being written."}</span>
              <div className="letter-controls">
                {!complete && <button className="text-button" onClick={() => setPaused((value) => !value)}>{paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}{paused ? "Continue" : "Pause"}</button>}
                {!complete && <button className="text-button" onClick={reveal}>Reveal all</button>}
                {complete && <button className="primary-button letter-next" onClick={onComplete}>One last thing</button>}
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
