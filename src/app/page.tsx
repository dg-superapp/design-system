import { Hello } from "../../registry/hello/hello";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold">dgc-miniapp registry</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Phase 1 pipeline validation. Install the placeholder item with:
        </p>
        <pre className="mt-2 overflow-x-auto rounded-md border bg-background p-3 text-xs">
          <code>pnpm dlx shadcn@latest add https://registry.dg-superapp.com/r/hello.json</code>
        </pre>
      </header>
      <section>
        <Hello name="world" />
      </section>
    </main>
  );
}
