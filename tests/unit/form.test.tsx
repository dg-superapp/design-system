import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../registry/form/form";
import { Input } from "../../registry/input/input";

/**
 * Form unit tests — Phase 3 Plan 3-09 Task 1.
 *
 *   1. All 7 exports are functions/objects (sanity).
 *   2. Empty required field → FormMessage renders with --danger token.
 *   3. Valid submission → FormMessage absent.
 *   4. FormControl injects aria-invalid=true on child when errored.
 *   5. FormLabel htmlFor wires to FormControl id (same formItemId).
 *   6. FormMessage uses aria-live="polite".
 *   7. No dark: utilities in rendered output.
 */

const schema = z.object({
  fullName: z.string().min(2, "fullName required (min 2 chars)"),
});
type FormValues = z.infer<typeof schema>;

function Harness({
  defaultValues = { fullName: "" },
}: {
  defaultValues?: FormValues;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} aria-label="test-form">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ឈ្មោះពេញ</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Full legal name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}

describe("Form primitive bundle", () => {
  it("exports all 7 canonical parts", async () => {
    const mod = await import("../../registry/form/form");
    for (const key of [
      "Form",
      "FormField",
      "FormItem",
      "FormLabel",
      "FormControl",
      "FormDescription",
      "FormMessage",
    ] as const) {
      expect(mod[key]).toBeDefined();
    }
  });

  it("renders label, input, and description on mount with no error", () => {
    render(<Harness />);
    expect(screen.getByLabelText("ឈ្មោះពេញ")).toBeInTheDocument();
    expect(screen.getByText("Full legal name.")).toBeInTheDocument();
    // No message yet.
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("FormLabel htmlFor matches FormControl id", () => {
    render(<Harness />);
    const label = screen.getByText("ឈ្មោះពេញ") as HTMLLabelElement;
    const input = screen.getByLabelText("ឈ្មោះពេញ") as HTMLInputElement;
    expect(label.getAttribute("for")).toBe(input.id);
    expect(input.id.length).toBeGreaterThan(0);
  });

  it("shows FormMessage with --danger class when submitting empty required field", async () => {
    render(<Harness />);
    const submit = screen.getByRole("button", { name: /submit/i });
    await act(async () => {
      fireEvent.click(submit);
    });
    const msg = await screen.findByText(/fullName required/);
    expect(msg.className).toContain("text-[hsl(var(--danger))]");
    expect(msg.getAttribute("aria-live")).toBe("polite");
    // Input carries aria-invalid=true.
    const input = screen.getByLabelText("ឈ្មោះពេញ");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toContain(
      msg.id,
    );
  });

  it("does not render FormMessage when valid", async () => {
    render(<Harness defaultValues={{ fullName: "Sothy" }} />);
    const submit = screen.getByRole("button", { name: /submit/i });
    await act(async () => {
      fireEvent.click(submit);
    });
    expect(screen.queryByText(/fullName required/)).toBeNull();
  });

  it("uses --danger token (NOT --destructive, NOT red-500) for error", async () => {
    render(<Harness />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    });
    const msg = await screen.findByText(/fullName required/);
    expect(msg.className).not.toMatch(/var\(--destructive\)/);
    expect(msg.className).not.toMatch(/text-red-500/);
    expect(msg.className).toMatch(/var\(--danger\)/);
  });

  it("has no dark: utilities in rendered classes", () => {
    const { container } = render(<Harness />);
    expect(container.innerHTML).not.toMatch(/\bdark:/);
  });
});
