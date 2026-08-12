import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";

const SOUND_KEY = "gradpathway-click-sound";

export const shouldPlayClickSound = (enabled: boolean, reducedMotion: boolean, isDisabled: boolean) => enabled && !reducedMotion && !isDisabled;

function readEnabled() {
  try {
    return localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
}

export function SoundToggle() {
  const [enabled, setEnabled] = useState(readEnabled);

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_KEY, enabled ? "on" : "off");
    } catch {
      // Preference storage is optional.
    }
  }, [enabled]);

  return <button onClick={() => setEnabled(value => !value)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500" aria-pressed={enabled}>
    {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />} {enabled ? "Sound on" : "Sound off"}
  </button>;
}

export function ClickSoundController() {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest("button, [role='button']") : null;
      const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const isDisabled = !target || target.getAttribute("aria-disabled") === "true" || (target instanceof HTMLButtonElement && target.disabled);
      if (!shouldPlayClickSound(readEnabled(), reducedMotion, isDisabled)) return;
      try {
        const AudioContextConstructor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextConstructor) return;
        const context = new AudioContextConstructor();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(420, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(285, context.currentTime + 0.055);
        gain.gain.setValueAtTime(0.0001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.075);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.08);
        oscillator.addEventListener("ended", () => void context.close());
      } catch {
        // Audio is an enhancement; unsupported environments remain silent.
      }
    };
    document.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => document.removeEventListener("pointerdown", onPointerDown, { capture: true });
  }, []);
  return null;
}
