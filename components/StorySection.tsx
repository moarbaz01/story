"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { content } from "@/lib/content";

function StoryArt({ kind }: { kind: string }) {
  const positions: Record<string, [number, number]> = {
    apart: [35, 165], talk: [68, 132], closer: [86, 114], comfort: [95, 105], falling: [96, 104], together: [99, 101],
  };
  const [left, right] = positions[kind] ?? positions.apart;
  return (
    <svg className="story-art" viewBox="0 0 200 150" role="img" aria-label="A minimalist illustration of two people growing closer">
      <defs><linearGradient id={`storyGlow-${kind}`} x1="0" x2="1"><stop stopColor="#ba78e8" /><stop offset="1" stopColor="#f59ab9" /></linearGradient></defs>
      <path d="M18 127 Q100 106 182 127" fill="none" stroke="rgba(255,255,255,.12)" />
      <motion.g initial={{ x: -18, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
        <circle cx={left} cy="79" r="10" fill="none" stroke="#e8d9ff" strokeWidth="2" />
        <path d={`M${left} 90 Q${left - 12} 109 ${left - 15} 126 M${left} 90 Q${left + 12} 109 ${left + 15} 126`} fill="none" stroke="#e8d9ff" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
      <motion.g initial={{ x: 18, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
        <circle cx={right} cy="79" r="10" fill="none" stroke="#ffdbe9" strokeWidth="2" />
        <path d={`M${right} 90 Q${right - 12} 109 ${right - 15} 126 M${right} 90 Q${right + 12} 109 ${right + 15} 126`} fill="none" stroke="#ffdbe9" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
      {kind !== "apart" && <motion.path d={`M${left + 10} 72 Q100 38 ${right - 10} 72`} fill="none" stroke={`url(#storyGlow-${kind})`} strokeWidth="1.5" strokeDasharray="3 5" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />}
      {(kind === "falling" || kind === "together") && <motion.path d="M100 44 C91 34 75 47 100 65 C125 47 109 34 100 44Z" fill="rgba(245,154,185,.25)" stroke="#f59ab9" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} />}
    </svg>
  );
}

export function StorySection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 65%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  return (
    <section ref={ref} id="story" className="story-section scene-section" aria-labelledby="story-title">
      <header className="section-heading">
        <p className="eyebrow">How our universe began</p>
        <h2 id="story-title">It started with two separate stories.</h2>
      </header>
      <div className="story-track" aria-hidden="true"><motion.span style={{ scaleY }} /></div>
      <div className="story-list">
        {content.story.map((stage, i) => (
          <motion.article className={`story-stage ${i % 2 ? "story-reverse" : ""}`} key={stage.title} initial={{ opacity: 0, y: 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.75 }}>
            <div className="story-number" aria-hidden="true"><span>{String(i + 1).padStart(2, "0")}</span></div>
            <div className="story-visual"><StoryArt kind={stage.kind} /></div>
            <div className="story-copy"><h3>{stage.title}</h3><p>{stage.text}</p></div>
          </motion.article>
        ))}
      </div>
      <motion.div className="story-ending" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        <p>And somewhere between all those little conversations…</p>
        <h3>You became the most beautiful part of my life.</h3>
      </motion.div>
    </section>
  );
}
