import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "../../registry/label/label";

/**
 * Label unit tests — Phase 3 Plan 3-08, R4.8.
 *
 * jsdom assertions for the Radix Label bundle:
 *   1. Renders an HTML <label> element.
 *   2. htmlFor passes through to the rendered element.
 *   3. Typography: text-sm + font-medium + leading-none + --foreground.
 *   4. Required prop renders an aria-hidden asterisk span.
 *   5. Asterisk uses --red-600 (the ONE permitted usage in Phase 3 — UI-SPEC §1.2).
 *   6. Without required, NO asterisk is rendered.
 *   7. No dark: utilities (D-06 token-only theming).
 *   8. Ref forwards to the underlying Radix root label element.
 *   9. peer-disabled cascade wired for pairing with disabled Input/etc.
 *
 * Click-to-focus cascade (htmlFor → id) is verified in the Playwright e2e
 * spec where a real Input can receive DOM focus.
 */

describe("Label", () => {
  it("renders an HTML <label> element", () => {
    render(<Label>ឈ្មោះពេញ</Label>);
    const label = screen.getByText("ឈ្មោះពេញ");
    expect(label.tagName).toBe("LABEL");
  });

  it("passes htmlFor through to the rendered element", () => {
    render(<Label htmlFor="full-name-input">ឈ្មោះពេញ</Label>);
    const label = screen.getByText("ឈ្មោះពេញ");
    expect(label).toHaveAttribute("for", "full-name-input");
  });

  it("applies 14px (text-sm) + weight-medium (font-medium) + --foreground", () => {
    render(<Label>label text</Label>);
    const label = screen.getByText("label text");
    expect(label.className).toContain("text-sm");
    expect(label.className).toContain("font-medium");
    expect(label.className).toContain("text-[hsl(var(--foreground))]");
  });

  it("applies leading-none + peer-disabled cascade (shadcn canonical)", () => {
    render(<Label>cascade</Label>);
    const label = screen.getByText("cascade");
    expect(label.className).toContain("leading-none");
    expect(label.className).toContain("peer-disabled:cursor-not-allowed");
    expect(label.className).toContain("peer-disabled:opacity-70");
  });

  it("renders an aria-hidden asterisk with --red-600 when required", () => {
    render(<Label required>ឈ្មោះពេញ</Label>);
    const label = screen.getByText(/ឈ្មោះពេញ/);
    const asterisk = label.querySelector('[aria-hidden="true"]');
    expect(asterisk).not.toBeNull();
    expect(asterisk!.textContent).toBe("*");
    expect(asterisk!.className).toContain("text-[hsl(var(--red-600))]");
    expect(asterisk!.className).toContain("ml-0.5");
  });

  it("does NOT render the asterisk when required is absent/false", () => {
    const { container } = render(<Label>optional</Label>);
    const asterisk = container.querySelector('[aria-hidden="true"]');
    expect(asterisk).toBeNull();
  });

  it("does NOT contain any dark: utilities (D-06 token-only theming)", () => {
    render(<Label required>dark</Label>);
    const label = screen.getByText(/dark/);
    expect(label.className).not.toMatch(/\bdark:/);
    const asterisk = label.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(asterisk.className).not.toMatch(/\bdark:/);
  });

  it("merges caller-supplied className with base classes", () => {
    render(<Label className="custom-label">custom</Label>);
    const label = screen.getByText("custom");
    expect(label.className).toContain("custom-label");
    expect(label.className).toContain("text-sm");
    expect(label.className).toContain("font-medium");
  });

  it("forwards ref to the underlying label element", () => {
    const ref = { current: null as HTMLLabelElement | null };
    render(
      <Label ref={ref} htmlFor="x">
        ref
      </Label>,
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("LABEL");
  });
});
