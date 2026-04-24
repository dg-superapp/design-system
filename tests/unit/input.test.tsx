import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "../../registry/input/input";

describe("Input", () => {
  it("renders a native input with default type=text", () => {
    render(<Input aria-label="name" />);
    const el = screen.getByLabelText("name") as HTMLInputElement;
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("INPUT");
    expect(el.type).toBe("text");
  });

  it("applies 48px height + 12px radius + 14px padding via DGC tokens", () => {
    render(<Input aria-label="dims" />);
    const el = screen.getByLabelText("dims");
    expect(el.className).toContain("h-[var(--input-h)]");
    expect(el.className).toContain("rounded-[var(--radius-md)]");
    expect(el.className).toContain("px-[14px]");
  });

  it("uses tokenized default border + card background", () => {
    render(<Input aria-label="default-state" />);
    const el = screen.getByLabelText("default-state");
    expect(el.className).toContain("border-[hsl(var(--input))]");
    expect(el.className).toContain("bg-[hsl(var(--card))]");
  });

  it("uses blue-700 focus border + shadow-focus ring on focus-visible", () => {
    render(<Input aria-label="focus-state" />);
    const el = screen.getByLabelText("focus-state");
    expect(el.className).toContain(
      "focus-visible:border-[hsl(var(--blue-700))]",
    );
    expect(el.className).toContain(
      "focus-visible:shadow-[var(--shadow-focus)]",
    );
  });

  it("flips border to --danger when aria-invalid=true", () => {
    render(<Input aria-label="invalid" aria-invalid />);
    const el = screen.getByLabelText("invalid");
    expect(el).toHaveAttribute("aria-invalid", "true");
    expect(el.className).toContain(
      "aria-[invalid=true]:border-[hsl(var(--danger))]",
    );
  });

  it("renders disabled with cursor-not-allowed + muted-foreground (not opacity-50)", () => {
    render(<Input aria-label="disabled" disabled />);
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

  it("forwards required to the native input so Label asterisk hook works", () => {
    render(<Input aria-label="req" required />);
    const el = screen.getByLabelText("req");
    expect(el).toBeRequired();
  });

  it("supports type=date (used by Khmer date placeholder cascade)", () => {
    render(<Input aria-label="dob" type="date" />);
    const el = screen.getByLabelText("dob") as HTMLInputElement;
    expect(el.type).toBe("date");
  });

  it("forwards ref to the underlying input element", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input aria-label="ref-test" ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("INPUT");
  });

  it("merges caller-supplied className with base classes", () => {
    render(<Input aria-label="merge" className="custom-class" />);
    const el = screen.getByLabelText("merge");
    expect(el.className).toContain("custom-class");
    expect(el.className).toContain("h-[var(--input-h)]");
  });

  it("forwards placeholder (supports Khmer numerals when lang=km is active)", () => {
    render(
      <Input aria-label="km-date" type="date" placeholder="ថ្ងៃ/ខែ/ឆ្នាំ" />,
    );
    const el = screen.getByLabelText("km-date");
    expect(el).toHaveAttribute("placeholder", "ថ្ងៃ/ខែ/ឆ្នាំ");
  });
});
