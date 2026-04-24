"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Form — Phase 3 Plan 3-09, R4.9.
 *
 * Canonical shadcn Form bundle — react-hook-form + zod integration with
 * 7 exports in one file (D-03):
 *   - Form           : aliased FormProvider
 *   - FormField      : typed <Controller> wrapper + FormFieldContext
 *   - FormItem       : <div> stack that carries an id for label/control/
 *                      description/message wiring
 *   - FormLabel      : wraps <Label>, auto-sets htmlFor + data-error
 *   - FormControl    : <Slot> that injects aria-invalid + aria-describedby
 *                      onto the child Input/Select/Textarea
 *   - FormDescription: muted caption paragraph
 *   - FormMessage    : danger-tokened error paragraph with aria-live=polite,
 *                      renders null when no error/body
 *
 * Token discipline (UI-SPEC §2.9 authoritative over R4.9 default):
 *   - Error color  → hsl(var(--danger))  (NOT --destructive, NOT red-500)
 *   - Description  → hsl(var(--muted-foreground))
 *   - Gap          → var(--space-1) (4px) via space-y-1 shorthand
 *   - Text size    → --text-xs (12px) for description + message
 *
 * A11y:
 *   - FormMessage uses aria-live="polite" so SRs announce validation
 *     errors without stealing focus.
 *   - FormControl spreads aria-invalid=true + aria-describedby=(desc, msg)
 *     onto its child so the paired Input picks up --danger border
 *     (handled by input's aria-[invalid=true] selector).
 *
 * Threat model (see 3-09-PLAN.md):
 *   - Client zod validation is UX-only. Server MUST re-validate. This is
 *     documented in the MDX docs page shipped by Plan 3-15.
 *
 * No dark: utilities (D-06). No lang branching (D-07) — zod schemas
 * are caller-owned, so Khmer/Latin error messages come from the
 * consumer's schema.
 *
 * Install-time note: `import { Label } from "../label/label"` is
 * rewritten by shadcn to `@/components/ui/label` via the consumer's
 * components.json aliases (Label ships target=components/ui/label.tsx).
 */

// ---------------------------------------------------------------------------
// Alias for shadcn canonical ergonomics.
// ---------------------------------------------------------------------------
const Form = FormProvider;

// ---------------------------------------------------------------------------
// FormFieldContext — carries the field name from <FormField> down into
// useFormField() so FormLabel/FormControl/FormDescription/FormMessage can
// auto-resolve the active field's state without explicit wiring.
// ---------------------------------------------------------------------------
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

// ---------------------------------------------------------------------------
// FormItemContext — carries a unique id for label/control/description/
// message wiring. Each <FormItem> creates one useId() and shares it via
// this context.
// ---------------------------------------------------------------------------
type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

// ---------------------------------------------------------------------------
// useFormField — resolves the active field's state + derived ids. Reads
// both contexts and the current form state via react-hook-form.
// ---------------------------------------------------------------------------
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

// ---------------------------------------------------------------------------
// FormItem — div stack with --space-1 gap that seeds the id context.
// ---------------------------------------------------------------------------
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function FormItem({ className, ...props }, ref) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-1", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

// ---------------------------------------------------------------------------
// FormLabel — wraps Label, auto-sets htmlFor + data-error when errored.
// ---------------------------------------------------------------------------
const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(function FormLabel({ className, ...props }, ref) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      data-error={!!error}
      className={cn(className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

// ---------------------------------------------------------------------------
// FormControl — Slot wrapper that injects aria-invalid + aria-describedby
// onto its child (Input/Select/Textarea/etc).
// ---------------------------------------------------------------------------
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(function FormControl({ ...props }, ref) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

// ---------------------------------------------------------------------------
// FormDescription — muted caption paragraph.
// ---------------------------------------------------------------------------
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function FormDescription({ className, ...props }, ref) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn(
        "text-xs text-[hsl(var(--muted-foreground))]",
        className,
      )}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

// ---------------------------------------------------------------------------
// FormMessage — danger-tokened error paragraph. Renders null when there's
// no error and no explicit children (so consumers can use it purely as
// a declarative slot without conditional JSX).
// ---------------------------------------------------------------------------
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function FormMessage({ className, children, ...props }, ref) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      aria-live="polite"
      className={cn(
        "text-xs font-medium text-[hsl(var(--danger))]",
        className,
      )}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
};
