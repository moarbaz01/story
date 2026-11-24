"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flower2, House, Moon, Music2, Sunrise } from "lucide-react";
import { useState } from "react";
import { content } from "@/lib/content";

const positions = [
  { left: "12%", top: "34%" }, { left: "32%", top: "67%" }, { left: "51%", top: "26%" }, { left: "69%", top: "62%" }, { left: "88%", top: "31%" },
];
const Icons = [Moon, Flower2, Music2, House, Sunrise];

export function ConstellationSection() {
  const [active, setActive] = useState(0);
  return (
    <section id="constellation" className="constellation-section scene-section" aria-labelledby="constellation-title">
      <header className="section-heading"><p className="eyebrow">Written across my sky</p><h2 id="constellation-title">Things that remind me of Nisha</h2><p>Five little lights I can never see the same way again.</p></header>
      <div className="constellation-map">
        <svg viewBox="0 0 1000 390" preserveAspectRatio="none" aria-hidden="true">
          <motion.path d="M120 135 L320 260 L510 100 L690 242 L880 120" fill="none" stroke="rgba(211,160,255,.4)" strokeWidth="1.5" strokeDasharray="5 9" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} />
        </svg>
        {content.constellation.map((item, i) => {
          const Icon = Icons[i];
          return (
            <motion.button key={item.label} className={`constellation-star ${active === i ? "active" : ""}`} style={positions[i]} onClick={() => setActive(i)} aria-label={`${item.label}: ${item.message}`} aria-pressed={active === i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.25 + i * 0.15, type: "spring" }}>
              <span className="star-pulse" /><Icon aria-hidden="true" size={22} strokeWidth={1.5} /><small>{item.label}</small>
            </motion.button>
          );
        })}
        <div className="constellation-message" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <span>{content.constellation[active].label}</span><p>{content.constellation[active].message}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
