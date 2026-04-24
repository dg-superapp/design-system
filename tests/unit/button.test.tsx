import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../../registry/button/button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument();
  });

  it("defaults to primary variant with brand token class", () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole("button", { name: "Primary" });
    expect(btn.className).toContain("var(--brand)");
    expect(btn.className).toContain("var(--brand-foreground)");
  });

  it("applies ghost-danger variant classes", () => {
    render(<Button variant="ghost-danger">Delete</Button>);
    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn.className).toContain("var(--danger)");
    expect(btn.className).toContain("bg-transparent");
  });

  it("applies size sm", () => {
    render(
      <Button size="sm">
        Small
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Small" });
    expect(btn.className).toContain("h-10");
    expect(btn.className).toContain("text-sm");
  });

  it("sets disabled attribute and disabled token classes", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button", { name: "Disabled" });
    expect(btn).toBeDisabled();
    expect(btn.className).toContain("var(--bg-disabled)");
    expect(btn.className).toContain("var(--fg-on-disabled)");
    expect(btn.className).not.toContain("opacity-50");
  });

  it("renders spinner and aria-disabled when loading", () => {
    const { container } = render(<Button loading>Submitting</Button>);
    const btn = screen.getByRole("button", { name: "Submitting" });
    expect(btn).toHaveAttribute("aria-disabled", "true");
    expect(btn).toBeDisabled();
    expect(container.querySelector(".animate-spin")).not.toBeNull();
  });

  it("honors asChild by rendering via Slot", () => {
    render(
      <Button asChild>
        <a href="/test">Link</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toHaveAttribute("href", "/test");
    expect(link.className).toContain("var(--brand)");
  });

  it("defaults to type=button to prevent accidental submits", () => {
    render(<Button>Safe</Button>);
    const btn = screen.getByRole("button", { name: "Safe" });
    expect(btn).toHaveAttribute("type", "button");
  });

  it("has focus-visible shadow-focus class", () => {
    render(<Button>Focus</Button>);
    const btn = screen.getByRole("button", { name: "Focus" });
    expect(btn.className).toContain("focus-visible:shadow-[var(--shadow-focus)]");
  });
});
