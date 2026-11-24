"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export function LoveMeter() {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  const [holding, setHolding] = useState(false);
  const frameRef = useRef<number | null>(null);
  const previousRef = useRef(0);
  const valueRef = useRef(0);
  const complete = value >= 100;

  const stop = useCallback(() => {
    setHolding(false);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  const start = useCallback(() => {
    if (complete) return;
    setHolding(true);
    previousRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - previousRef.current;
      previousRef.current = now;
      const current = valueRef.current;
      const next = Math.min(100, current + elapsed / (reduced ? 8 : 27));
      valueRef.current = next;
      setValue(next);
      if (next >= 100) {
        setHolding(false);
        if (navigator.vibrate) navigator.vibrate([40, 35, 90]);
        frameRef.current = null;
        return;
      }
      if (Math.floor(next / 20) > Math.floor(current / 20) && navigator.vibrate) navigator.vibrate(12);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  }, [complete, reduced]);

  useEffect(() => () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); }, []);
  const circumference = 2 * Math.PI * 102;

  return (
    <section id="meter" className={`meter-section scene-section ${holding ? "is-holding" : ""} ${complete ? "is-infinite" : ""}`} aria-labelledby="meter-title">
      <div className="meter-particles" aria-hidden="true">{Array.from({ length: 22 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties}>{i % 4 === 0 ? "♥" : "•"}</i>)}</div>
      <header className="section-heading"><p className="eyebrow">One tiny experiment</p><h2 id="meter-title">How much do I love you?</h2></header>
      <div className="meter-wrap">
        <svg className="meter-ring" viewBox="0 0 240 240" aria-label={complete ? "Love meter: infinity" : `Love meter: ${Math.round(value)} percent`}>
          <circle cx="120" cy="120" r="102" className="meter-track" />
          <motion.circle cx="120" cy="120" r="102" className="meter-fill" strokeDasharray={circumference} strokeDashoffset={circumference} animate={{ strokeDashoffset: circumference * (1 - value / 100) }} transition={{ duration: 0.08 }} />
        </svg>
        <motion.div className="meter-value" animate={complete ? { scale: [1, 1.28, 1], rotate: [0, -3, 3, 0] } : {}}>
          {complete ? <span className="infinity">∞</span> : <><strong>{Math.round(value)}</strong><small>%</small></>}
        </motion.div>
        {complete && <span className="meter-break" aria-hidden="true" />}
      </div>
      {!complete ? (
        <button className="hold-button" onPointerDown={start} onPointerUp={stop} onPointerCancel={stop} onPointerLeave={stop} onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !e.repeat) { e.preventDefault(); start(); } }} onKeyUp={(e) => { if (e.key === "Enter" || e.key === " ") stop(); }}>
          <span>{holding ? "Keep holding…" : "Hold to find out"}</span>
        </button>
      ) : <motion.p className="meter-result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>Sorry, this thing wasn’t designed to measure infinity.</motion.p>}
    </section>
  );
}
