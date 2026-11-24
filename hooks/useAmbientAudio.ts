"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useAmbientAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const [muted, setMutedState] = useState(true);
  const [available, setAvailable] = useState(true);
  const [activated, setActivated] = useState(false);
  const checkedRef = useRef(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMutedState(localStorage.getItem("nisha-muted") === "true"));
    return () => {
      cancelAnimationFrame(frame);
      audioRef.current?.pause();
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    };
  }, []);

  const ensureAudio = useCallback(async () => {
    if (audioRef.current) return audioRef.current;
    if (checkedRef.current && !available) return null;
    checkedRef.current = true;
    try {
      const response = await fetch(src, { method: "HEAD", cache: "no-store" });
      if (!response.ok) { setAvailable(false); return null; }
      const audio = new Audio(src);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0;
      audio.addEventListener("error", () => setAvailable(false), { once: true });
      audioRef.current = audio;
      return audio;
    } catch {
      setAvailable(false);
      return null;
    }
  }, [available, src]);

  const fade = useCallback((target: number) => {
    const audio = audioRef.current;
    if (!audio || !available) return;
    if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    const step = () => {
      const diff = target - audio.volume;
      if (Math.abs(diff) < 0.025) { audio.volume = target; if (target === 0) audio.pause(); return; }
      audio.volume = Math.max(0, Math.min(1, audio.volume + Math.sign(diff) * 0.025));
      fadeRef.current = requestAnimationFrame(step);
    };
    step();
  }, [available]);

  const activate = useCallback(async () => {
    setActivated(true);
    if (!available || muted) return;
    const audio = await ensureAudio();
    if (!audio) return;
    try { await audio.play(); fade(0.24); } catch { setAvailable(false); }
  }, [available, ensureAudio, fade, muted]);

  const setMuted = useCallback(async (next: boolean) => {
    setMutedState(next);
    localStorage.setItem("nisha-muted", String(next));
    if (!available) return;
    if (next) { fade(0); return; }
    if (activated) {
      const audio = await ensureAudio();
      if (!audio) return;
      try { await audio.play(); fade(0.24); } catch { setAvailable(false); }
    }
  }, [activated, available, ensureAudio, fade]);

  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio || muted || !activated) return;
      if (document.hidden) audio.pause();
      else void audio.play().then(() => fade(0.24)).catch(() => setAvailable(false));
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [activated, fade, muted]);

  return { muted, available, activate, setMuted };
}
