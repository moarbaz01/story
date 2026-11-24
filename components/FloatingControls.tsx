"use client";

import { Gauge, Music2, RotateCcw, VolumeX } from "lucide-react";

export function FloatingControls({ muted, audioAvailable, intensity, progress, onMute, onIntensity, onRestart }: {
  muted: boolean; audioAvailable: boolean; intensity: "full" | "soft"; progress: number;
  onMute: () => void; onIntensity: () => void; onRestart: () => void;
}) {
  return (
    <aside className="floating-controls" aria-label="Experience controls">
      <span className="experience-progress" title={`${Math.round(progress)}% through the story`} aria-label={`${Math.round(progress)} percent through the story`}><i style={{ height: `${progress}%`, "--progress": progress / 100 } as React.CSSProperties} /></span>
      <button onClick={onMute} aria-label={muted ? "Turn music on" : "Turn music off"} title={audioAvailable ? (muted ? "Music on" : "Music off") : "Add music in public/audio"}>
        {muted || !audioAvailable ? <VolumeX aria-hidden="true" /> : <Music2 aria-hidden="true" />}
      </button>
      <button onClick={onIntensity} aria-label={`Set animation intensity to ${intensity === "full" ? "soft" : "full"}`} title={`Animation: ${intensity}`}><Gauge aria-hidden="true" /><span>{intensity === "full" ? "A" : "a"}</span></button>
      <button onClick={onRestart} aria-label="Restart experience" title="Restart"><RotateCcw aria-hidden="true" /></button>
    </aside>
  );
}
