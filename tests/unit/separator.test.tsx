import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "../../registry/separator/separator";

/**
 * Separator unit tests — Phase 3 Plan 3-13, R4.13.
 *
 * jsdom assertions for the Radix Separator bundle:
 *   1. Default orientation is horizontal.
 *   2. Horizontal renders data-orientation="horizontal" + h-[1px] + w-full.
 *   3. Vertical renders data-orientation="vertical" + w-[1px] + h-full.
 *   4. bg uses hsl(var(--border)) — NOT border-muted, NOT #E0E0E0.
 *   5. decorative=true (default) → role="none".
 *   6. decorative=false → role="separator" + aria-orientation.
 *   7. No dark: utilities (D-06 token-only theming).
 *   8. Caller className merges with base classes.
 *   9. Ref forwards to the underlying Radix root element.
 */

describe("Separator", () => {
  it("defaults to horizontal orientation", () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId("sep");
    expect(sep.getAttribute("data-orientation")).toBe("horizontal");
  });

  it("horizontal applies h-[1px] + w-full", () => {
    render(<Separator data-testid="sep" orientation="horizontal" />);
    const sep = screen.getByTestId("sep");
    expect(sep.className).toContain("data-[orientation=horizontal]:h-[1px]");
    expect(sep.className).toContain("data-[orientation=horizontal]:w-full");
  });

  it("vertical applies w-[1px] + h-full", () => {
    render(<Separator data-testid="sep" orientation="vertical" />);
    const sep = screen.getByTestId("sep");
    expect(sep.getAttribute("data-orientation")).toBe("vertical");
    expect(sep.className).toContain("data-[orientation=vertical]:w-[1px]");
    expect(sep.className).toContain("data-[orientation=vertical]:h-full");
  });

  it("paints with hsl(var(--border)), not border-muted or #E0E0E0", () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId("sep");
    expect(sep.className).toContain("bg-[hsl(var(--border))]");
    expect(sep.className).not.toContain("border-muted");
    expect(sep.className).not.toContain("#E0E0E0");
  });

  it("decorative=true (default) renders role=\"none\"", () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId("sep");
    expect(sep.getAttribute("role")).toBe("none");
  });

  it("decorative=false renders role=\"separator\" + aria-orientation", () => {
    render(
      <Separator
        data-testid="sep"
        decorative={false}
        orientation="vertical"
      />,
    );
    const sep = screen.getByTestId("sep");
    expect(sep.getAttribute("role")).toBe("separator");
    expect(sep.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("does NOT contain any dark: utilities (D-06 token-only theming)", () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId("sep");
    expect(sep.className).not.toMatch(/\bdark:/);
  });

  it("merges caller-supplied className with base classes", () => {
    render(<Separator data-testid="sep" className="custom-sep my-4" />);
    const sep = screen.getByTestId("sep");
    expect(sep.className).toContain("custom-sep");
    expect(sep.className).toContain("my-4");
    expect(sep.className).toContain("bg-[hsl(var(--border))]");
  });

  it("applies shrink-0 so it does not collapse inside flex parents", () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId("sep");
    expect(sep.className).toContain("shrink-0");
  });

  it("forwards ref to the underlying root element", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Separator ref={ref} data-testid="sep" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.getAttribute("data-orientation")).toBe("horizontal");
  });
});
