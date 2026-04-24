import { describe, it, expect } from "vitest";
import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../registry/tabs/tabs";

/**
 * Tabs unit tests — Phase 3 Plan 3-12, R4.12.
 *
 * jsdom assertions for Radix Tabs bundle + CVA variants:
 *   1. Uncontrolled mode (defaultValue) renders active content.
 *   2. Controlled mode (value + onValueChange) updates on click.
 *   3. Underline variant TabsList carries --card bg + --border classes.
 *   4. Underline active trigger carries --brand text + font-semibold.
 *   5. Pill variant TabsList carries --background bg + p-[4px].
 *   6. Pill active trigger carries --card bg + --brand text + --shadow-1.
 *   7. Every trigger carries focus-visible:shadow-[var(--shadow-focus)].
 *   8. No dark: utilities (D-06).
 *   9. 44px underline trigger / 36px pill trigger dimensions.
 */

function renderUnderline(defaultValue = "a") {
  return render(
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        <TabsTrigger value="a">Alpha</TabsTrigger>
        <TabsTrigger value="b">Beta</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Content A</TabsContent>
      <TabsContent value="b">Content B</TabsContent>
    </Tabs>,
  );
}

function renderPill(defaultValue = "a") {
  return render(
    <Tabs defaultValue={defaultValue}>
      <TabsList variant="pill">
        <TabsTrigger variant="pill" value="a">Alpha</TabsTrigger>
        <TabsTrigger variant="pill" value="b">Beta</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Content A</TabsContent>
      <TabsContent value="b">Content B</TabsContent>
    </Tabs>,
  );
}

describe("Tabs", () => {
  it("uncontrolled defaultValue renders active content", () => {
    renderUnderline("a");
    expect(screen.getByText("Content A")).toBeTruthy();
    expect(screen.queryByText("Content B")).toBeNull();
  });

  it("controlled mode: onValueChange fires + content updates when parent re-renders", () => {
    function Controlled() {
      const [v, setV] = React.useState("a");
      return (
        <Tabs value={v} onValueChange={setV}>
          <TabsList>
            <TabsTrigger value="a">Alpha</TabsTrigger>
            <TabsTrigger value="b">Beta</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Content A</TabsContent>
          <TabsContent value="b">Content B</TabsContent>
        </Tabs>
      );
    }
    render(<Controlled />);
    const beta = screen.getByRole("tab", { name: "Beta" });
    // Radix Tabs activates on mousedown (primary button), not click.
    fireEvent.mouseDown(beta, { button: 0 });
    expect(beta.getAttribute("data-state")).toBe("active");
    const alpha = screen.getByRole("tab", { name: "Alpha" });
    expect(alpha.getAttribute("data-state")).toBe("inactive");
    // Content B panel must be the one marked active.
    const panelB = screen.getByText("Content B").closest('[role="tabpanel"]');
    expect(panelB?.getAttribute("data-state")).toBe("active");
  });

  it("underline TabsList carries --card bg + --border + rounded-[--radius-md]", () => {
    renderUnderline();
    const list = screen.getByRole("tablist");
    expect(list.className).toContain("bg-[hsl(var(--card))]");
    expect(list.className).toContain("border-[hsl(var(--border))]");
    expect(list.className).toContain("rounded-[var(--radius-md)]");
  });

  it("underline active trigger: --brand text + font-semibold + after 2px --brand", () => {
    renderUnderline("a");
    const active = screen.getByRole("tab", { name: "Alpha" });
    expect(active.getAttribute("data-state")).toBe("active");
    expect(active.className).toContain("data-[state=active]:text-[hsl(var(--brand))]");
    expect(active.className).toContain("data-[state=active]:font-semibold");
    expect(active.className).toContain("data-[state=active]:after:h-[2px]");
    expect(active.className).toContain("data-[state=active]:after:bg-[hsl(var(--brand))]");
    expect(active.className).toContain("h-[44px]");
  });

  it("pill TabsList carries --background bg + p-[4px] + gap-[2px]", () => {
    renderPill();
    const list = screen.getByRole("tablist");
    expect(list.className).toContain("bg-[hsl(var(--background))]");
    expect(list.className).toContain("p-[4px]");
    expect(list.className).toContain("gap-[2px]");
    expect(list.className).toContain("rounded-[var(--radius-md)]");
  });

  it("pill active trigger: --card bg + --brand text + --shadow-1 + 36px + --radius-sm", () => {
    renderPill("a");
    const active = screen.getByRole("tab", { name: "Alpha" });
    expect(active.getAttribute("data-state")).toBe("active");
    expect(active.className).toContain("data-[state=active]:bg-[hsl(var(--card))]");
    expect(active.className).toContain("data-[state=active]:text-[hsl(var(--brand))]");
    expect(active.className).toContain("data-[state=active]:shadow-[var(--shadow-1)]");
    expect(active.className).toContain("h-[36px]");
    expect(active.className).toContain("rounded-[var(--radius-sm)]");
  });

  it("every trigger carries focus-visible shadow --shadow-focus (both variants)", () => {
    const { unmount } = renderUnderline();
    for (const t of screen.getAllByRole("tab")) {
      expect(t.className).toContain("focus-visible:shadow-[var(--shadow-focus)]");
    }
    unmount();
    renderPill();
    for (const t of screen.getAllByRole("tab")) {
      expect(t.className).toContain("focus-visible:shadow-[var(--shadow-focus)]");
    }
  });

  it("does NOT contain any dark: utilities (D-06)", () => {
    renderUnderline();
    const list = screen.getByRole("tablist");
    for (const t of screen.getAllByRole("tab")) {
      expect(t.className).not.toMatch(/\bdark:/);
    }
    expect(list.className).not.toMatch(/\bdark:/);
  });

  it("does NOT contain opacity-50 (WCAG AA disabled contrast)", () => {
    renderUnderline();
    const list = screen.getByRole("tablist");
    for (const t of screen.getAllByRole("tab")) {
      expect(t.className).not.toContain("opacity-50");
    }
    expect(list.className).not.toContain("opacity-50");
  });
});
