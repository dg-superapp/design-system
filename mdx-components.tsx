import type { MDXComponents } from "mdx/types";

/**
 * Next 15 App Router MDX hook. This file MUST live at the project root
 * (not under src/) per @next/mdx integration docs.
 *
 * Tailwind v4 strips default element styling, so we reintroduce a minimal
 * prose-like cascade for the MDX docs pages here. Docs pages stay readable
 * while the rest of the registry site keeps its custom layout.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1
        className="mt-0 mb-4 text-3xl font-bold tracking-tight text-foreground"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="mt-8 mb-3 text-2xl font-semibold tracking-tight text-foreground"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="mt-6 mb-2 text-lg font-semibold text-foreground"
        {...props}
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="my-3 text-base leading-7 text-foreground" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="my-3 ml-6 list-disc text-foreground" {...props}>
        {children}
      </ul>
    ),
    li: ({ children, ...props }) => (
      <li className="my-1" {...props}>
        {children}
      </li>
    ),
    code: ({ children, ...props }) => (
      <code
        className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.9em] text-foreground"
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre
        className="my-4 overflow-x-auto rounded-md border border-border bg-card p-4 text-sm shadow-[var(--shadow-1)]"
        {...props}
      >
        {children}
      </pre>
    ),
    a: ({ children, ...props }) => (
      <a
        className="text-brand underline underline-offset-2 hover:text-[hsl(var(--brand-hover))]"
        {...props}
      >
        {children}
      </a>
    ),
    table: ({ children, ...props }) => (
      <div className="my-4 overflow-x-auto rounded-md border border-border">
        <table className="w-full border-collapse text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="border-b border-border bg-muted px-3 py-2 text-left font-semibold text-foreground"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        className="border-b border-border/50 px-3 py-2 align-top text-foreground"
        {...props}
      >
        {children}
      </td>
    ),
    ...components,
  };
}
