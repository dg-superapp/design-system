import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "../../registry/tooltip/tooltip";

/**
 * Tooltip unit tests — Phase 3 Plan 3-11, R4.11.
 *
 * jsdom assertions for the Radix Tooltip bundle:
 *   1. Trigger renders via asChild and preserves child element type.
 *   2. Tooltip content NOT in the DOM before open.
 *   3. Hover + focus open the tooltip (role="tooltip").
 *   4. Content carries --gray-900 bg + --radius-sm + --shadow-2 classes.
 *   5. Content is NOT using --popover or --card tokens (UI-SPEC §2.11).
 *   6. Content has no dark: utilities (D-06 token-only theming).
 *   7. Arrow uses --gray-900 fill.
 *
 * `@testing-library/user-event` is not a dep; we drive opens with
 * `fireEvent.focus` / `fireEvent.pointerEnter` — Radix honours both.
 */

function renderTip(
  trigger: React.ReactNode = <button>hover me</button>,
  content: React.ReactNode = "Helpful hint",
) {
  return render(
    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent>
          {content}
          <TooltipArrow data-testid="arrow" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
}

/**
 * Radix renders TWO DOM nodes on open:
 *   - A styled [data-radix-tooltip-content] with our classes
 *   - A visually-hidden role="tooltip" span for a11y announcement
 * Tests that assert classes must target the styled node, not the
 * hidden announcement span. We key off the data-state attribute which
 * only Radix Content carries.
 */
async function openTooltip(): Promise<{ styled: HTMLElement; aria: HTMLElement }> {
  const trigger = screen.getByRole("button", { name: /hover me/i });
  fireEvent.focus(trigger);
  const aria = await waitFor(() => screen.getByRole("tooltip"));
  const styled = await waitFor(() => {
    // Find any element in the document (including portals) that carries
    // the tooltipContentClassName. The styled Tooltip Content is the only
    // node with --gray-900 bg token class.
    const all = Array.from(document.querySelectorAll<HTMLElement>('*'));
    const node = all.find((n) =>
      typeof n.className === 'string' &&
      n.className.includes('bg-[hsl(var(--gray-900))]'),
    );
    if (!node) throw new Error('Styled Tooltip Content not found');
    return node;
  });
  return { styled, aria };
}

describe("Tooltip", () => {
  it("trigger renders via asChild (keeps underlying <button>)", () => {
    renderTip();
    const trigger = screen.getByRole("button", { name: /hover me/i });
    expect(trigger.tagName).toBe("BUTTON");
  });

  it("content is not in the DOM before open", () => {
    renderTip();
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("focus opens the tooltip (role=tooltip appears)", async () => {
    renderTip();
    const { aria, styled } = await openTooltip();
    expect(aria).toBeTruthy();
    // Both the a11y announcement span and the styled content carry the label
    expect(`${aria.textContent} ${styled.textContent}`).toContain(
      "Helpful hint",
    );
  });

  it("content carries --gray-900 bg, --radius-sm, --shadow-2, max-w-[200px]", async () => {
    renderTip();
    const { styled } = await openTooltip();
    expect(styled.className).toContain("bg-[hsl(var(--gray-900))]");
    expect(styled.className).toContain("rounded-[var(--radius-sm)]");
    expect(styled.className).toContain("shadow-[var(--shadow-2)]");
    expect(styled.className).toContain("max-w-[200px]");
    expect(styled.className).toContain("text-xs");
    expect(styled.className).toContain("text-white");
    expect(styled.className).toContain("px-[10px]");
    expect(styled.className).toContain("py-[6px]");
  });

  it("content does NOT use --popover or --card tokens (UI-SPEC §2.11 exception)", async () => {
    renderTip();
    const { styled } = await openTooltip();
    expect(styled.className).not.toContain("var(--popover)");
    expect(styled.className).not.toContain("bg-popover");
    expect(styled.className).not.toContain("var(--card)");
    expect(styled.className).not.toContain("bg-card");
  });

  it("does NOT contain any dark: utilities (D-06 token-only theming)", async () => {
    renderTip();
    const { styled } = await openTooltip();
    expect(styled.className).not.toMatch(/\bdark:/);
  });

  it("arrow uses --gray-900 fill", async () => {
    renderTip();
    await openTooltip();
    const arrow = document.querySelector('[data-testid="arrow"]');
    expect(arrow).not.toBeNull();
    expect(arrow?.getAttribute("class")).toContain(
      "fill-[hsl(var(--gray-900))]",
    );
  });
});
