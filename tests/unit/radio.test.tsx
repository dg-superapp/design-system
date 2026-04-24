import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RadioGroup, RadioGroupItem } from "../../registry/radio/radio";

/**
 * Radio unit tests — Phase 3 Plan 3-06, R4.6.
 *
 * jsdom assertions for the Radix RadioGroup bundle:
 *   1. RadioGroup renders a role=radiogroup container.
 *   2. RadioGroupItem renders a role=radio button with DGC-tokenized classes
 *      (20×20, --radius-pill, 1.5px --gray-300 border, --card bg).
 *   3. Selected item flips to --brand border (specimen > R4.6 --accent).
 *   4. 10×10 brand dot indicator rendered via data-state=checked.
 *   5. focus-visible maps to --shadow-focus; disabled maps to --gray-100 bg
 *      (NOT opacity-50 per D-06 / WCAG AA).
 *   6. No dark: utilities, no lang branching.
 *   7. Ref forwards to the underlying Radix root / item.
 *
 * Arrow-key cycling + real click/focus behavior covered in the Playwright
 * e2e spec against a real browser.
 */

function renderGroup(groupProps: React.ComponentProps<typeof RadioGroup> = {}) {
  return render(
    <RadioGroup aria-label="city" {...groupProps}>
      <RadioGroupItem value="pp" aria-label="pp" />
      <RadioGroupItem value="sr" aria-label="sr" />
      <RadioGroupItem value="bb" aria-label="bb" />
    </RadioGroup>,
  );
}

describe("RadioGroup", () => {
  it("renders a radiogroup container with three radio items", () => {
    renderGroup();
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("applies vertical gap via --space-3 on the group root", () => {
    const { container } = renderGroup();
    const root = container.querySelector('[role="radiogroup"]');
    expect(root).not.toBeNull();
    expect((root as HTMLElement).className).toContain(
      "gap-[var(--space-3)]",
    );
  });

  it("exports RadioGroup + RadioGroupItem", async () => {
    const mod = await import("../../registry/radio/radio");
    expect(mod).toHaveProperty("RadioGroup");
    expect(mod).toHaveProperty("RadioGroupItem");
    expect(mod.RadioGroup).toBeDefined();
    expect(mod.RadioGroupItem).toBeDefined();
  });

  it("forwards ref to the underlying RadioGroup root div", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <RadioGroup ref={ref} aria-label="ref-group">
        <RadioGroupItem value="a" aria-label="a" />
      </RadioGroup>,
    );
    expect(ref.current).not.toBeNull();
  });
});

describe("RadioGroupItem", () => {
  it("renders a button with role=radio + accessible label", () => {
    renderGroup();
    const item = screen.getByRole("radio", { name: "pp" });
    expect(item).toBeInTheDocument();
    expect(item.tagName).toBe("BUTTON");
  });

  it("applies 20×20px circle + --radius-pill + 1.5px --gray-300 border", () => {
    renderGroup();
    const item = screen.getByRole("radio", { name: "pp" });
    expect(item.className).toContain("h-[20px]");
    expect(item.className).toContain("w-[20px]");
    expect(item.className).toContain("aspect-square");
    expect(item.className).toContain("rounded-[var(--radius-pill)]");
    expect(item.className).toContain("border-[1.5px]");
    expect(item.className).toContain("border-[hsl(var(--gray-300))]");
  });

  it("uses --card background unselected (Input/Checkbox parity, token-only)", () => {
    renderGroup();
    const item = screen.getByRole("radio", { name: "pp" });
    expect(item.className).toContain("bg-[hsl(var(--card))]");
  });

  it("hover flips border to --brand + bg to --blue-050", () => {
    renderGroup();
    const item = screen.getByRole("radio", { name: "pp" });
    expect(item.className).toContain("hover:border-[hsl(var(--brand))]");
    expect(item.className).toContain("hover:bg-[hsl(var(--blue-050))]");
  });

  it("flips to --brand border + --card bg on data-state=checked (specimen authoritative)", () => {
    renderGroup({ defaultValue: "pp" });
    const item = screen.getByRole("radio", { name: "pp" });
    expect(item).toHaveAttribute("data-state", "checked");
    expect(item.className).toContain(
      "data-[state=checked]:border-[hsl(var(--brand))]",
    );
    expect(item.className).toContain(
      "data-[state=checked]:bg-[hsl(var(--card))]",
    );
  });

  it("renders a 10×10 brand-fill inner dot as the indicator", () => {
    const { container } = renderGroup({ defaultValue: "pp" });
    // Radix mounts Indicator only for the checked item; the inner dot is a
    // <span> child of the Indicator wrapper.
    const dot = container.querySelector(
      '[data-state="checked"] span > span',
    ) as HTMLElement | null;
    expect(dot).not.toBeNull();
    expect(dot!.className).toContain("h-[10px]");
    expect(dot!.className).toContain("w-[10px]");
    expect(dot!.className).toContain("rounded-[var(--radius-pill)]");
    expect(dot!.className).toContain("bg-[hsl(var(--brand))]");
  });

  it("applies --shadow-focus ring on focus-visible (keyboard only)", () => {
    renderGroup();
    const item = screen.getByRole("radio", { name: "pp" });
    expect(item.className).toContain(
      "focus-visible:shadow-[var(--shadow-focus)]",
    );
    expect(item.className).toContain("focus-visible:outline-none");
  });

  it("renders disabled with cursor-not-allowed + --gray-100 bg (not opacity-50)", () => {
    render(
      <RadioGroup aria-label="disabled-group">
        <RadioGroupItem value="x" aria-label="x" disabled />
      </RadioGroup>,
    );
    const item = screen.getByRole("radio", { name: "x" });
    expect(item).toBeDisabled();
    expect(item.className).toContain("disabled:cursor-not-allowed");
    expect(item.className).toContain("disabled:bg-[hsl(var(--gray-100))]");
    expect(item.className).not.toContain("opacity-50");
  });

  it("does NOT contain any dark: utilities (D-06 token-only theming)", () => {
    renderGroup();
    const item = screen.getByRole("radio", { name: "pp" });
    expect(item.className).not.toMatch(/\bdark:/);
  });

  it("merges caller-supplied className with base classes", () => {
    render(
      <RadioGroup aria-label="custom-group">
        <RadioGroupItem value="y" aria-label="y" className="custom-radio" />
      </RadioGroup>,
    );
    const item = screen.getByRole("radio", { name: "y" });
    expect(item.className).toContain("custom-radio");
    expect(item.className).toContain("h-[20px]");
  });

  it("forwards ref to the underlying Radix item button", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(
      <RadioGroup aria-label="ref-item-group">
        <RadioGroupItem ref={ref} value="z" aria-label="z" />
      </RadioGroup>,
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("BUTTON");
  });
});
