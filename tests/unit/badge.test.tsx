import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../../registry/badge/badge";

/**
 * Badge unit tests — Phase 3 Plan 3-10, R4.10.
 *
 * jsdom assertions for the CVA Badge:
 *   1. Renders an HTML <span> element.
 *   2. Default tone: --muted bg + --foreground fg.
 *   3. Success tone: --success-bg + --success.
 *   4. Warning tone: --warning-bg + --warning.
 *   5. Danger tone: --danger-bg + --danger.
 *   6. Pill shape via --radius-pill; 22px height, 12px text, medium weight.
 *   7. No dark: utilities (D-06 token-only theming).
 *   8. Ref forwards to the underlying span element.
 *   9. className merges with base classes.
 */

describe("Badge", () => {
  it("renders an HTML <span> element", () => {
    render(<Badge>status</Badge>);
    const badge = screen.getByText("status");
    expect(badge.tagName).toBe("SPAN");
  });

  it("default tone uses --muted bg + --foreground fg", () => {
    render(<Badge>default</Badge>);
    const badge = screen.getByText("default");
    expect(badge.className).toContain("bg-[hsl(var(--muted))]");
    expect(badge.className).toContain("text-[hsl(var(--foreground))]");
  });

  it("success tone uses --success-bg + --success", () => {
    render(<Badge tone="success">success</Badge>);
    const badge = screen.getByText("success");
    expect(badge.className).toContain("bg-[hsl(var(--success-bg))]");
    expect(badge.className).toContain("text-[hsl(var(--success))]");
  });

  it("warning tone uses --warning-bg + --warning", () => {
    render(<Badge tone="warning">warning</Badge>);
    const badge = screen.getByText("warning");
    expect(badge.className).toContain("bg-[hsl(var(--warning-bg))]");
    expect(badge.className).toContain("text-[hsl(var(--warning))]");
  });

  it("danger tone uses --danger-bg + --danger", () => {
    render(<Badge tone="danger">danger</Badge>);
    const badge = screen.getByText("danger");
    expect(badge.className).toContain("bg-[hsl(var(--danger-bg))]");
    expect(badge.className).toContain("text-[hsl(var(--danger))]");
  });

  it("applies pill shape, 22px height, 12px text, medium weight", () => {
    render(<Badge>pill</Badge>);
    const badge = screen.getByText("pill");
    expect(badge.className).toContain("rounded-[var(--radius-pill)]");
    expect(badge.className).toContain("h-[22px]");
    expect(badge.className).toContain("text-xs");
    expect(badge.className).toContain("font-medium");
    expect(badge.className).toContain("leading-none");
  });

  it("does NOT contain any dark: utilities (D-06 token-only theming)", () => {
    render(<Badge tone="danger">dark</Badge>);
    const badge = screen.getByText("dark");
    expect(badge.className).not.toMatch(/\bdark:/);
  });

  it("does NOT contain opacity-50 (WCAG-AA disabled pattern uses tokens)", () => {
    render(<Badge tone="warning">no-opacity</Badge>);
    const badge = screen.getByText("no-opacity");
    expect(badge.className).not.toContain("opacity-50");
  });

  it("merges caller-supplied className with base classes", () => {
    render(<Badge className="custom-badge">custom</Badge>);
    const badge = screen.getByText("custom");
    expect(badge.className).toContain("custom-badge");
    expect(badge.className).toContain("rounded-[var(--radius-pill)]");
  });

  it("forwards ref to the underlying span element", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(
      <Badge ref={ref} tone="success">
        ref
      </Badge>,
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("SPAN");
  });

  it("renders leading icon in inline-flex with gap", () => {
    render(
      <Badge>
        <svg data-testid="icon" width="12" height="12" />
        status
      </Badge>,
    );
    const badge = screen.getByText(/status/);
    expect(badge.className).toContain("inline-flex");
    expect(badge.className).toContain("items-center");
    expect(badge.querySelector('[data-testid="icon"]')).not.toBeNull();
  });
});
