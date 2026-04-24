import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Switch } from "../../registry/switch/switch";

/**
 * Switch unit tests — Phase 3 Plan 3-07, R4.7.
 *
 * jsdom assertions for the Radix Switch bundle:
 *   1. Renders a button with role=switch + aria-checked toggling.
 *   2. Track is EXACTLY 40×24 with --radius-pill corner (R4.7 authoritative).
 *   3. Thumb is EXACTLY 18×18 with translate-x-[2px] off / [20px] on.
 *   4. Off track → --gray-300; On track → --brand (token-only, no opacity hack).
 *   5. focus-visible maps to --shadow-focus; no native outline.
 *   6. Disabled uses soft opacity + cursor-not-allowed (Radix idiom).
 *   7. No dark: utilities (D-06), transitions bound to --dur-fast + --ease-standard.
 *   8. Ref forwards to the underlying Radix root button.
 *
 * Real click + Space-key toggling verified in the Playwright e2e spec.
 */

describe("Switch", () => {
  it("renders a button with role=switch and aria-checked reflects state", () => {
    render(<Switch aria-label="toggle" />);
    const sw = screen.getByRole("switch", { name: "toggle" });
    expect(sw).toBeInTheDocument();
    expect(sw.tagName).toBe("BUTTON");
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("reflects aria-checked=true when defaultChecked", () => {
    render(<Switch aria-label="toggle-on" defaultChecked />);
    const sw = screen.getByRole("switch", { name: "toggle-on" });
    expect(sw).toHaveAttribute("aria-checked", "true");
    expect(sw).toHaveAttribute("data-state", "checked");
  });

  it("applies EXACTLY 40×24 track + --radius-pill corner (R4.7 authoritative)", () => {
    render(<Switch aria-label="dim" />);
    const sw = screen.getByRole("switch", { name: "dim" });
    expect(sw.className).toContain("h-[24px]");
    expect(sw.className).toContain("w-[40px]");
    expect(sw.className).toContain("rounded-[var(--radius-pill)]");
  });

  it("uses --brand when checked and --gray-300 when unchecked (token-only)", () => {
    render(<Switch aria-label="state" />);
    const sw = screen.getByRole("switch", { name: "state" });
    expect(sw.className).toContain(
      "data-[state=checked]:bg-[hsl(var(--brand))]",
    );
    expect(sw.className).toContain(
      "data-[state=unchecked]:bg-[hsl(var(--gray-300))]",
    );
  });

  it("hover maps to --brand-hover (on) and --gray-400 (off)", () => {
    render(<Switch aria-label="hover" />);
    const sw = screen.getByRole("switch", { name: "hover" });
    expect(sw.className).toContain(
      "data-[state=checked]:hover:bg-[hsl(var(--brand-hover))]",
    );
    expect(sw.className).toContain(
      "data-[state=unchecked]:hover:bg-[hsl(var(--gray-400))]",
    );
  });

  it("applies --shadow-focus ring on focus-visible (keyboard only)", () => {
    render(<Switch aria-label="focus" />);
    const sw = screen.getByRole("switch", { name: "focus" });
    expect(sw.className).toContain(
      "focus-visible:shadow-[var(--shadow-focus)]",
    );
    expect(sw.className).toContain("focus-visible:outline-none");
  });

  it("renders a 18×18 thumb with translate-x-[2px] off / [20px] on", () => {
    const { container } = render(<Switch aria-label="thumb" />);
    const thumb = container.querySelector(
      '[data-state="unchecked"] > span',
    ) as HTMLElement | null;
    expect(thumb).not.toBeNull();
    expect(thumb!.className).toContain("h-[18px]");
    expect(thumb!.className).toContain("w-[18px]");
    expect(thumb!.className).toContain("rounded-[var(--radius-pill)]");
    expect(thumb!.className).toContain("bg-white");
    expect(thumb!.className).toContain(
      "data-[state=checked]:translate-x-[20px]",
    );
    expect(thumb!.className).toContain(
      "data-[state=unchecked]:translate-x-[2px]",
    );
  });

  it("thumb transitions are transform-based with --dur-fast + --ease-standard", () => {
    const { container } = render(<Switch aria-label="motion" />);
    const thumb = container.querySelector(
      '[data-state="unchecked"] > span',
    ) as HTMLElement | null;
    expect(thumb).not.toBeNull();
    expect(thumb!.className).toContain("transition-transform");
    expect(thumb!.className).toContain("duration-[var(--dur-fast)]");
    expect(thumb!.className).toContain("ease-[var(--ease-standard)]");
  });

  it("track transitions colors with --dur-fast + --ease-standard", () => {
    render(<Switch aria-label="track-motion" />);
    const sw = screen.getByRole("switch", { name: "track-motion" });
    expect(sw.className).toContain("transition-colors");
    expect(sw.className).toContain("duration-[var(--dur-fast)]");
    expect(sw.className).toContain("ease-[var(--ease-standard)]");
  });

  it("renders disabled with cursor-not-allowed + aria-disabled-ish", () => {
    render(<Switch aria-label="off" disabled />);
    const sw = screen.getByRole("switch", { name: "off" });
    expect(sw).toBeDisabled();
    expect(sw.className).toContain("disabled:cursor-not-allowed");
  });

  it("does NOT contain any dark: utilities (D-06 token-only theming)", () => {
    render(<Switch aria-label="dark" />);
    const sw = screen.getByRole("switch", { name: "dark" });
    expect(sw.className).not.toMatch(/\bdark:/);
  });

  it("merges caller-supplied className with base classes", () => {
    render(<Switch aria-label="custom" className="custom-switch" />);
    const sw = screen.getByRole("switch", { name: "custom" });
    expect(sw.className).toContain("custom-switch");
    expect(sw.className).toContain("h-[24px]");
    expect(sw.className).toContain("w-[40px]");
  });

  it("forwards ref to the underlying Radix root button", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Switch ref={ref} aria-label="ref" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("BUTTON");
  });
});
