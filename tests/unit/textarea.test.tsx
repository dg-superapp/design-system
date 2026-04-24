import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Textarea } from "../../registry/textarea/textarea";

describe("Textarea", () => {
  it("renders a native textarea", () => {
    render(<Textarea aria-label="notes" />);
    const el = screen.getByLabelText("notes") as HTMLTextAreaElement;
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("TEXTAREA");
  });

  it("applies min-height 88px + 12px radius + 14px horizontal padding via DGC tokens", () => {
    render(<Textarea aria-label="dims" />);
    const el = screen.getByLabelText("dims");
    expect(el.className).toContain("min-h-[88px]");
    expect(el.className).toContain("rounded-[var(--radius-md)]");
    expect(el.className).toContain("px-[14px]");
    expect(el.className).toContain("py-3");
  });

  it("allows vertical resize only (resize-y)", () => {
    render(<Textarea aria-label="resize" />);
    const el = screen.getByLabelText("resize");
    expect(el.className).toContain("resize-y");
    expect(el.className).not.toContain("resize-x");
    expect(el.className).not.toContain("resize-none");
  });

  it("uses tokenized default border + card background", () => {
    render(<Textarea aria-label="default-state" />);
    const el = screen.getByLabelText("default-state");
    expect(el.className).toContain("border-[hsl(var(--input))]");
    expect(el.className).toContain("bg-[hsl(var(--card))]");
  });

  it("uses blue-700 focus border + shadow-focus ring on focus-visible", () => {
    render(<Textarea aria-label="focus-state" />);
    const el = screen.getByLabelText("focus-state");
    expect(el.className).toContain(
      "focus-visible:border-[hsl(var(--blue-700))]",
    );
    expect(el.className).toContain(
      "focus-visible:shadow-[var(--shadow-focus)]",
    );
  });

  it("flips border to --danger when aria-invalid=true", () => {
    render(<Textarea aria-label="invalid" aria-invalid />);
    const el = screen.getByLabelText("invalid");
    expect(el).toHaveAttribute("aria-invalid", "true");
    expect(el.className).toContain(
      "aria-[invalid=true]:border-[hsl(var(--danger))]",
    );
  });

  it("renders disabled with cursor-not-allowed + muted-foreground (not opacity-50)", () => {
    render(<Textarea aria-label="disabled" disabled />);
    const el = screen.getByLabelText("disabled");
    expect(el).toBeDisabled();
    expect(el.className).toContain("disabled:cursor-not-allowed");
    expect(el.className).toContain(
      "disabled:bg-[hsl(var(--background))]",
    );
    expect(el.className).toContain(
      "disabled:text-[hsl(var(--muted-foreground))]",
    );
    expect(el.className).not.toContain("opacity-50");
  });

  it("does NOT contain any dark: utilities (D-06 token-only theming)", () => {
    render(<Textarea aria-label="no-dark" />);
    const el = screen.getByLabelText("no-dark");
    expect(el.className).not.toMatch(/\bdark:/);
  });

  it("forwards ref to the underlying textarea element", () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<Textarea aria-label="ref-test" ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("TEXTAREA");
  });

  it("merges caller-supplied className with base classes", () => {
    render(<Textarea aria-label="merge" className="custom-class" />);
    const el = screen.getByLabelText("merge");
    expect(el.className).toContain("custom-class");
    expect(el.className).toContain("min-h-[88px]");
  });

  it("forwards rows + placeholder to the native textarea (Khmer-safe)", () => {
    render(
      <Textarea aria-label="km-notes" rows={5} placeholder="បញ្ចូលចំណាំ" />,
    );
    const el = screen.getByLabelText("km-notes") as HTMLTextAreaElement;
    expect(el).toHaveAttribute("rows", "5");
    expect(el).toHaveAttribute("placeholder", "បញ្ចូលចំណាំ");
  });
});
