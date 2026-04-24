import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../registry/select/select";

/**
 * Select unit tests — Phase 3 Plan 3-04, R4.4.
 *
 * jsdom cannot render the Radix Portal + pointer layout reliably, so
 * these tests assert:
 *   1. The trigger renders with DGC-tokenized classes (state matrix).
 *   2. No forbidden utilities (opacity-50, dark:).
 *   3. aria-invalid, disabled, placeholder behave as declared.
 *   4. The bundle exports all required sub-parts.
 *
 * Open-state behavior + keyboard cycling are covered in the Playwright
 * e2e spec against a real browser.
 */

function renderSelect(
  extraProps: React.ComponentProps<typeof SelectTrigger> = {},
) {
  return render(
    <Select>
      <SelectTrigger aria-label="lang" {...extraProps}>
        <SelectValue placeholder="ជ្រើសរើសភាសា" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="km">ខ្មែរ</SelectItem>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="zh">中文</SelectItem>
      </SelectContent>
    </Select>,
  );
}

describe("Select", () => {
  it("renders a trigger button with accessible label", () => {
    renderSelect();
    const trigger = screen.getByLabelText("lang");
    expect(trigger).toBeInTheDocument();
    expect(trigger.tagName).toBe("BUTTON");
  });

  it("applies 48px height + 12px radius + 14px padding via DGC tokens", () => {
    renderSelect();
    const trigger = screen.getByLabelText("lang");
    expect(trigger.className).toContain("h-[var(--input-h)]");
    expect(trigger.className).toContain("rounded-[var(--radius-md)]");
    expect(trigger.className).toContain("px-[14px]");
  });

  it("uses tokenized default border + card background (Input parity)", () => {
    renderSelect();
    const trigger = screen.getByLabelText("lang");
    expect(trigger.className).toContain("border-[hsl(var(--input))]");
    expect(trigger.className).toContain("bg-[hsl(var(--card))]");
  });

  it("uses blue-700 focus border + shadow-focus ring on focus-visible", () => {
    renderSelect();
    const trigger = screen.getByLabelText("lang");
    expect(trigger.className).toContain(
      "focus-visible:border-[hsl(var(--blue-700))]",
    );
    expect(trigger.className).toContain(
      "focus-visible:shadow-[var(--shadow-focus)]",
    );
  });

  it("applies --shadow-focus + blue-700 border on data-state=open", () => {
    renderSelect();
    const trigger = screen.getByLabelText("lang");
    expect(trigger.className).toContain(
      "data-[state=open]:border-[hsl(var(--blue-700))]",
    );
    expect(trigger.className).toContain(
      "data-[state=open]:shadow-[var(--shadow-focus)]",
    );
  });

  it("flips border to --danger when aria-invalid=true", () => {
    renderSelect({ "aria-invalid": true });
    const trigger = screen.getByLabelText("lang");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger.className).toContain(
      "aria-[invalid=true]:border-[hsl(var(--danger))]",
    );
  });

  it("renders disabled with cursor-not-allowed + muted-foreground (not opacity-50)", () => {
    renderSelect({ disabled: true });
    const trigger = screen.getByLabelText("lang");
    expect(trigger).toBeDisabled();
    expect(trigger.className).toContain("disabled:cursor-not-allowed");
    expect(trigger.className).toContain(
      "disabled:bg-[hsl(var(--background))]",
    );
    expect(trigger.className).toContain(
      "disabled:text-[hsl(var(--muted-foreground))]",
    );
    expect(trigger.className).not.toContain("opacity-50");
  });

  it("renders placeholder with muted-foreground via data-placeholder", () => {
    renderSelect();
    const trigger = screen.getByLabelText("lang");
    // Radix sets data-placeholder when no value is chosen.
    expect(trigger).toHaveAttribute("data-placeholder");
    expect(trigger.className).toContain(
      "data-[placeholder]:text-[hsl(var(--muted-foreground))]",
    );
  });

  it("does NOT contain any dark: utilities (D-06 token-only theming)", () => {
    renderSelect();
    const trigger = screen.getByLabelText("lang");
    expect(trigger.className).not.toMatch(/\bdark:/);
  });

  it("merges caller-supplied className with base classes", () => {
    renderSelect({ className: "custom-trigger" });
    const trigger = screen.getByLabelText("lang");
    expect(trigger.className).toContain("custom-trigger");
    expect(trigger.className).toContain("h-[var(--input-h)]");
  });

  it("forwards ref to the underlying trigger button", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(
      <Select>
        <SelectTrigger ref={ref} aria-label="ref-test">
          <SelectValue placeholder="…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("BUTTON");
  });

  it("exports all required Radix sub-parts", async () => {
    const mod = await import("../../registry/select/select");
    const expected = [
      "Select",
      "SelectGroup",
      "SelectValue",
      "SelectTrigger",
      "SelectContent",
      "SelectItem",
      "SelectLabel",
      "SelectSeparator",
      "SelectScrollUpButton",
      "SelectScrollDownButton",
    ];
    for (const name of expected) {
      expect(mod).toHaveProperty(name);
      expect((mod as Record<string, unknown>)[name]).toBeDefined();
    }
  });
});
