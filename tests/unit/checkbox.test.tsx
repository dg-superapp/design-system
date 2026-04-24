import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Checkbox } from "../../registry/checkbox/checkbox";

/**
 * Checkbox unit tests — Phase 3 Plan 3-05, R4.5.
 *
 * jsdom renders Radix Checkbox as a native-like button; these tests
 * assert:
 *   1. Root button renders with accessible role.
 *   2. DGC-tokenized classes (state matrix) are present.
 *   3. No forbidden utilities (opacity-50, dark:).
 *   4. Disabled + checked + indeterminate props wire through Radix.
 *   5. Ref forwards to the underlying Radix root.
 *
 * Real click + Space-key toggling + focus-visible shadow are covered in
 * the Playwright e2e spec against a real browser.
 */

function renderCheckbox(
  extraProps: React.ComponentProps<typeof Checkbox> = {},
) {
  return render(<Checkbox aria-label="accept" {...extraProps} />);
}

describe("Checkbox", () => {
  it("renders a button with role=checkbox + accessible label", () => {
    renderCheckbox();
    const box = screen.getByRole("checkbox", { name: "accept" });
    expect(box).toBeInTheDocument();
    expect(box.tagName).toBe("BUTTON");
  });

  it("applies 20×20px box + --radius-xs corner + 1.5px border via DGC tokens", () => {
    renderCheckbox();
    const box = screen.getByRole("checkbox");
    expect(box.className).toContain("h-[20px]");
    expect(box.className).toContain("w-[20px]");
    expect(box.className).toContain("rounded-[var(--radius-xs)]");
    expect(box.className).toContain("border-[1.5px]");
    expect(box.className).toContain("border-[hsl(var(--gray-300))]");
  });

  it("uses --card background unchecked (Input parity, token-only)", () => {
    renderCheckbox();
    const box = screen.getByRole("checkbox");
    expect(box.className).toContain("bg-[hsl(var(--card))]");
  });

  it("flips to --brand bg + --brand border + white indicator on data-state=checked", () => {
    renderCheckbox({ checked: true });
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("data-state", "checked");
    expect(box.className).toContain(
      "data-[state=checked]:bg-[hsl(var(--brand))]",
    );
    expect(box.className).toContain(
      "data-[state=checked]:border-[hsl(var(--brand))]",
    );
    expect(box.className).toContain("data-[state=checked]:text-white");
  });

  it("flips to --brand bg on data-state=indeterminate", () => {
    renderCheckbox({ checked: "indeterminate" });
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("data-state", "indeterminate");
    expect(box.className).toContain(
      "data-[state=indeterminate]:bg-[hsl(var(--brand))]",
    );
    expect(box.className).toContain(
      "data-[state=indeterminate]:border-[hsl(var(--brand))]",
    );
  });

  it("applies --shadow-focus ring on focus-visible (keyboard only)", () => {
    renderCheckbox();
    const box = screen.getByRole("checkbox");
    expect(box.className).toContain(
      "focus-visible:shadow-[var(--shadow-focus)]",
    );
    expect(box.className).toContain("focus-visible:outline-none");
  });

  it("hover flips border to --brand + bg to --blue-050", () => {
    renderCheckbox();
    const box = screen.getByRole("checkbox");
    expect(box.className).toContain("hover:border-[hsl(var(--brand))]");
    expect(box.className).toContain("hover:bg-[hsl(var(--blue-050))]");
  });

  it("renders disabled with cursor-not-allowed + --gray-100 bg + --gray-200 border (not opacity-50)", () => {
    renderCheckbox({ disabled: true });
    const box = screen.getByRole("checkbox");
    expect(box).toBeDisabled();
    expect(box.className).toContain("disabled:cursor-not-allowed");
    expect(box.className).toContain(
      "disabled:bg-[hsl(var(--gray-100))]",
    );
    expect(box.className).toContain(
      "disabled:border-[hsl(var(--gray-200))]",
    );
    expect(box.className).not.toContain("opacity-50");
  });

  it("does NOT contain any dark: utilities (D-06 token-only theming)", () => {
    renderCheckbox();
    const box = screen.getByRole("checkbox");
    expect(box.className).not.toMatch(/\bdark:/);
  });

  it("merges caller-supplied className with base classes", () => {
    renderCheckbox({ className: "custom-box" });
    const box = screen.getByRole("checkbox");
    expect(box.className).toContain("custom-box");
    expect(box.className).toContain("h-[20px]");
  });

  it("forwards ref to the underlying Radix root button", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Checkbox ref={ref} aria-label="ref-test" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("BUTTON");
  });

  it("exports the Checkbox root", async () => {
    const mod = await import("../../registry/checkbox/checkbox");
    expect(mod).toHaveProperty("Checkbox");
    expect(mod.Checkbox).toBeDefined();
  });
});
