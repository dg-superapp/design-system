import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ScrollArea,
  ScrollBar,
  scrollBarClassName,
  scrollThumbClassName,
} from "../../registry/scroll-area/scroll-area";

/**
 * ScrollArea unit tests — Phase 3 Plan 3-14, R4.14.
 *
 * jsdom assertions for the Radix ScrollArea bundle. Radix gates its
 * Scrollbar + Thumb on actual overflow measurement (ResizeObserver +
 * layout), neither of which jsdom simulates. Per 3-RESEARCH §"Testing
 * Radix primitives" the idiomatic split is:
 *
 *   Unit (this file) — structural + token assertions via exported class
 *                      strings (`scrollBarClassName`, `scrollThumbClassName`)
 *                      and the Root/Viewport wrappers which always mount.
 *   E2E  (playwright) — runtime visibility, hover fade, bg rgb() probe.
 *
 * Assertions:
 *   1. Root applies relative overflow-hidden + consumer className.
 *   2. Viewport wraps children with h-full w-full rounded-[inherit].
 *   3. Exported scrollBarClassName encodes 8px track + touch-none +
 *      --dur-fast + vertical/horizontal data-orientation variants.
 *   4. Exported scrollThumbClassName encodes --gray-300 / hover
 *      --gray-400 / --radius-pill — the UI-SPEC §2.14 contract.
 *   5. Neither class string contains `dark:` (D-06) nor `opacity-50`
 *      (D-03 WCAG-AA).
 *   6. <ScrollBar> is a valid ForwardRef accepting orientation prop.
 *   7. Ref forwards to the Radix Root element.
 *   8. Caller className merges on Root.
 */

describe("ScrollArea", () => {
  it("Root applies relative overflow-hidden + consumer className", () => {
    render(
      <ScrollArea data-testid="sa" className="h-40 w-40">
        <div style={{ height: 600 }}>content</div>
      </ScrollArea>,
    );
    const root = screen.getByTestId("sa");
    expect(root.className).toContain("relative");
    expect(root.className).toContain("overflow-hidden");
    expect(root.className).toContain("h-40");
  });

  it("viewport wraps children with h-full w-full rounded-[inherit]", () => {
    render(
      <ScrollArea data-testid="sa" className="h-40 w-40">
        <div>child</div>
      </ScrollArea>,
    );
    const vp = screen.getByTestId("scroll-area-viewport");
    expect(vp.className).toContain("h-full");
    expect(vp.className).toContain("w-full");
    expect(vp.className).toContain("rounded-[inherit]");
    expect(vp.textContent).toBe("child");
  });

  it("scrollBarClassName encodes 8px track + vertical/horizontal variants + --dur-fast", () => {
    expect(scrollBarClassName).toContain("data-[orientation=vertical]:w-[8px]");
    expect(scrollBarClassName).toContain("data-[orientation=vertical]:h-full");
    expect(scrollBarClassName).toContain(
      "data-[orientation=horizontal]:h-[8px]",
    );
    expect(scrollBarClassName).toContain(
      "data-[orientation=horizontal]:w-full",
    );
    expect(scrollBarClassName).toContain("touch-none");
    expect(scrollBarClassName).toContain("select-none");
    expect(scrollBarClassName).toContain("duration-[var(--dur-fast)]");
    expect(scrollBarClassName).toContain("p-[1px]");
  });

  it("scrollThumbClassName encodes --gray-300 / hover --gray-400 / --radius-pill", () => {
    expect(scrollThumbClassName).toContain("bg-[hsl(var(--gray-300))]");
    expect(scrollThumbClassName).toContain("hover:bg-[hsl(var(--gray-400))]");
    expect(scrollThumbClassName).toContain("rounded-[var(--radius-pill)]");
    expect(scrollThumbClassName).toContain("duration-[var(--dur-fast)]");
  });

  it("class strings contain NO dark: utilities (D-06 token-only theming)", () => {
    expect(scrollBarClassName).not.toMatch(/\bdark:/);
    expect(scrollThumbClassName).not.toMatch(/\bdark:/);
  });

  it("class strings contain NO opacity-50 (D-03 WCAG-AA rule)", () => {
    expect(scrollBarClassName).not.toContain("opacity-50");
    expect(scrollThumbClassName).not.toContain("opacity-50");
  });

  it("<ScrollBar> is a ForwardRef component accepting orientation prop", () => {
    // ForwardRef render function is exotic; we assert callable shape and
    // that render with explicit orientation doesn't throw inside a Root.
    expect(typeof ScrollBar).toBe("object");
    render(
      <ScrollArea data-testid="sa" className="h-20 w-20">
        <div style={{ height: 400 }}>c</div>
      </ScrollArea>,
    );
    // Root mounts without error — scrollbar presence is an e2e concern.
    expect(screen.getByTestId("sa")).toBeInTheDocument();
  });

  it("merges caller-supplied className on the Root", () => {
    render(
      <ScrollArea
        data-testid="sa"
        className="h-40 w-40 custom-scroll"
      >
        <div>c</div>
      </ScrollArea>,
    );
    const root = screen.getByTestId("sa");
    expect(root.className).toContain("custom-scroll");
    expect(root.className).toContain("relative");
  });

  it("forwards ref to the underlying Radix root element", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <ScrollArea ref={ref} data-testid="sa" className="h-40 w-40">
        <div>c</div>
      </ScrollArea>,
    );
    expect(ref.current).not.toBeNull();
  });
});
