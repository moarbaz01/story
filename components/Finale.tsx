"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Heart, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { content } from "@/lib/content";

export function Finale({ onReplay }: { onReplay: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();
  const [line, setLine] = useState(-1);
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCount(Number(localStorage.getItem("nisha-hearts") ?? 0)));
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      const frame = requestAnimationFrame(() => setLine(content.finale.length));
      return () => cancelAnimationFrame(frame);
    }
    const timers = content.finale.map((_, i) => window.setTimeout(() => setLine(i), 700 + i * 2100));
    timers.push(window.setTimeout(() => setLine(content.finale.length), 700 + content.finale.length * 2100));
    return () => timers.forEach(clearTimeout);
  }, [inView, reduced]);

  const sendHeart = () => {
    const next = count + 1;
    setCount(next);
    localStorage.setItem("nisha-hearts", String(next));
    const heart = { id: Date.now(), x: 18 + Math.random() * 64 };
    setHearts((current) => [...current.slice(-9), heart]);
    window.setTimeout(() => setHearts((current) => current.filter((item) => item.id !== heart.id)), 4300);
  };

  return (
    <section ref={ref} id="finale" className="finale scene-section" aria-labelledby="finale-title">
      <div className="final-moon moon" aria-hidden="true"><span /></div>
      <div className="shooting-star" aria-hidden="true" />
      <div className="fireflies" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>
      <svg className="heart-constellation" viewBox="0 0 220 190" aria-label="A heart-shaped constellation">
        <motion.path d="M110 166 C85 142 25 104 30 61 C34 26 82 21 110 55 C138 21 186 26 190 61 C195 104 135 142 110 166Z" fill="none" stroke="rgba(255,215,235,.55)" strokeWidth="1" strokeDasharray="4 8" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.4 }} />
        {[[110,166],[67,130],[36,79],[55,38],[91,42],[110,55],[132,39],[173,42],[190,76],[158,131]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill="#fff2c9" />)}
      </svg>
      <div className="sky-name" aria-hidden="true">NISHA</div>
      <div className="finale-copy" aria-live="polite">
        <AnimatePresence mode="wait">
          {line >= 0 && line < content.finale.length && <motion.p className="final-line" key={line} initial={{ opacity: 0, y: 12, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0)" }} exit={{ opacity: 0 }} transition={{ duration: .9 }}>{content.finale[line]}</motion.p>}
          {line >= content.finale.length && (
            <motion.div key="final-message" className="final-message" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="eyebrow">From my universe to yours</p>
              <h2 id="finale-title">I love you, Nisha.</h2>
              <p>In every version of my future, I hope there is a Nisha.</p>
              <div className="final-actions">
                <button className="secondary-button" onClick={onReplay}><RotateCcw size={17} aria-hidden="true" /> Replay Our Story</button>
                <button className="primary-button" onClick={sendHeart}><Heart size={17} aria-hidden="true" /> Send a Heart</button>
              </div>
              <span className="heart-count" aria-live="polite">{count} {count === 1 ? "heart" : "hearts"} sent into her sky</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="released-hearts" aria-hidden="true">{hearts.map((heart) => <motion.span key={heart.id} style={{ left: `${heart.x}%` }} initial={{ y: 80, opacity: 0, scale: .5 }} animate={{ y: -520, opacity: [0, 1, 1, 0], scale: [0.5, 1, .8] }} transition={{ duration: 4.1, ease: "easeOut" }}>♥</motion.span>)}</div>
    </section>
  );
}
