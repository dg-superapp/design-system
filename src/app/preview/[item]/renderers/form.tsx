'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../../registry/form/form';
import { Input } from '../../../../../registry/input/input';
import type { PreviewRenderer } from './index';

/**
 * Form preview renderer — Phase 3 Plan 3-09.
 *
 * Renders a live RHF+Zod form with 2 fields (fullName, email). Demos:
 *   - zodResolver wires validation
 *   - FormMessage renders --danger text with aria-live=polite
 *   - FormControl injects aria-invalid onto Input, which flips border to --danger
 *   - Submit alert on valid data
 *
 * Statically imported via the renderers registry (D-12) — no JSX eval.
 * Controls (PlaygroundShell):
 *   - fullName   : initial value for Full Name
 *   - email      : initial value for Email
 *   - forceInvalid: when true, prefills invalid defaults (empty name + bad email)
 *                   so visual/axe specs can exercise the error state.
 */

const schema = z.object({
  fullName: z.string().min(2, 'សូមបញ្ចូលឈ្មោះពេញ (យ៉ាងតិច 2 តួ)'),
  email: z.string().email('អ៊ីមែលមិនត្រឹមត្រូវ'),
});

type FormValues = z.infer<typeof schema>;

export const FormPreview: PreviewRenderer = ({ state }) => {
  const force = Boolean(state.forceInvalid);
  const defaultValues: FormValues = force
    ? { fullName: '', email: 'not-an-email' }
    : {
        fullName:
          typeof state.fullName === 'string' ? state.fullName : 'លី សុផាត',
        email: typeof state.email === 'string' ? state.email : '',
      };

  // react-hook-form does not re-initialize on defaultValues change after
  // mount; we key the wrapper so PlaygroundShell state flips create a
  // fresh form instance (acceptable — playground-only ergonomics).
  const formKey = JSON.stringify(defaultValues);

  return (
    <FormInner
      key={formKey}
      defaultValues={defaultValues}
      forceInvalid={force}
    />
  );
};

function FormInner({
  defaultValues,
  forceInvalid,
}: {
  defaultValues: FormValues;
  forceInvalid: boolean;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onSubmit',
  });
  const [submitted, setSubmitted] = React.useState<FormValues | null>(null);

  // If forceInvalid is set, trigger validation on mount so the error state
  // is visible to axe/Playwright without user interaction.
  React.useEffect(() => {
    if (forceInvalid) {
      // fire-and-forget async validation
      void form.trigger();
    }
  }, [forceInvalid, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => setSubmitted(values))}
        className="flex max-w-md flex-col gap-4"
        aria-label="playground-form"
        data-testid="playground-form"
        noValidate
      >
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ឈ្មោះពេញ</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="លី សុផាត"
                  autoComplete="name"
                  {...field}
                />
              </FormControl>
              <FormDescription>ឈ្មោះពេញដូចលើអត្តសញ្ញាណប័ណ្ណ។</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>អ៊ីមែល</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          type="submit"
          data-testid="playground-form-submit"
          className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-[hsl(var(--brand))] px-4 text-sm font-medium text-[hsl(var(--brand-foreground))] hover:bg-[hsl(var(--brand-hover))] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
        >
          ដាក់បញ្ជូន
        </button>
        {submitted ? (
          <p
            data-testid="playground-form-submitted"
            className="text-xs text-[hsl(var(--muted-foreground))]"
          >
            Submitted: {submitted.fullName} &lt;{submitted.email}&gt;
          </p>
        ) : null}
      </form>
    </Form>
  );
}
