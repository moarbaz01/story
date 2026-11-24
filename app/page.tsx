"use client";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { ConstellationSection } from "@/components/ConstellationSection";
import { Finale } from "@/components/Finale";
import { FloatingControls } from "@/components/FloatingControls";
import { FlowerSection } from "@/components/FlowerSection";
import { ForeverQuestion } from "@/components/ForeverQuestion";
import { LoveLetter } from "@/components/LoveLetter";
import { LoveMeter } from "@/components/LoveMeter";
import { OpeningScene } from "@/components/OpeningScene";
import { Starfield } from "@/components/Starfield";
import { StorySection } from "@/components/StorySection";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";
import { content } from "@/lib/content";

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [intensity, setIntensity] = useState<"full" | "soft">("full");
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll();
  const audio = useAmbientAudio(content.musicPath);

  useEffect(() => scrollYProgress.on("change", (value) => setProgress(value * 100)), [scrollYProgress]);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stored = localStorage.getItem("nisha-intensity");
    if (reduced || stored === "soft") {
      const frame = requestAnimationFrame(() => setIntensity("soft"));
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  const enter = () => {
    setEntered(true);
    void audio.activate();
    window.setTimeout(() => document.getElementById("story")?.scrollIntoView({ behavior: "smooth" }), 250);
  };
  const restart = () => {
    setEntered(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const toggleIntensity = () => {
    const next = intensity === "full" ? "soft" : "full";
    setIntensity(next);
    localStorage.setItem("nisha-intensity", next);
  };
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="universe" data-intensity={intensity}>
      <a className="skip-link" href={entered ? "#story" : "#opening"}>Skip to story</a>
      <Starfield intensity={intensity} interactive={entered} />
      <div className="grain" aria-hidden="true" />
      <AnimatePresence mode="wait">
        {!entered ? (
          <motion.div id="opening" key="opening" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04, filter: "blur(9px)" }} transition={{ duration: .8 }}>
            <OpeningScene onEnter={enter} />
          </motion.div>
        ) : (
          <motion.div key="experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <StorySection />
            <FlowerSection />
            <LoveMeter />
            <ConstellationSection />
            <ForeverQuestion onYes={() => scrollTo("letter")} />
            <LoveLetter onComplete={() => scrollTo("finale")} />
            <Finale onReplay={restart} />
          </motion.div>
        )}
      </AnimatePresence>
      {entered && <FloatingControls muted={audio.muted} audioAvailable={audio.available} intensity={intensity} progress={progress} onMute={() => void audio.setMuted(!audio.muted)} onIntensity={toggleIntensity} onRestart={restart} />}
    </main>
  );
}
