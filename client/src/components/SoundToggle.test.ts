import { describe, expect, it } from "vitest";
import { shouldPlayClickSound } from "./SoundToggle";

describe("shouldPlayClickSound", () => {
  it("plays only for enabled, non-reduced-motion, active controls", () => {
    expect(shouldPlayClickSound(true, false, false)).toBe(true);
    expect(shouldPlayClickSound(false, false, false)).toBe(false);
    expect(shouldPlayClickSound(true, true, false)).toBe(false);
    expect(shouldPlayClickSound(true, false, true)).toBe(false);
  });
});
