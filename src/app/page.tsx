import { Hello } from "../../registry/hello/hello";
import { DarkModeToggle } from "@/components/docs/DarkModeToggle";
import type { SwatchProps } from "@/components/docs/Swatch";
import { TokenTable } from "@/components/docs/TokenTable";

// ─── Palette definitions ──────────────────────────────────────────────
// Values mirror registry/dgc-theme/theme.css (HSL triplets + hex sources).
// Touching these without updating theme.css will surface as a visible
// drift on this page AND via Task 8's visual-diff against the HTML specimens.
//
// Each rendered swatch emits a stable selector, e.g. data-token="blue-900",
// used by the visual-diff pipeline.

const primaryTokens: SwatchProps[] = [
  { token: "blue-050", hslTriplet: "212 62% 96%", hex: "#EEF4FB" },
  { token: "blue-100", hslTriplet: "205 87% 94%", hex: "#E3F2FD" },
  { token: "blue-400", hslTriplet: "207 90% 61%", hex: "#42A5F5" },
  { token: "blue-500", hslTriplet: "207 90% 54%", hex: "#2196F3" },
  { token: "blue-600", hslTriplet: "208 79% 51%", hex: "#1E88E5" },
  { token: "blue-700", hslTriplet: "212 80% 42%", hex: "#1565C0" },
  { token: "blue-800", hslTriplet: "220 71% 40%", hex: "#1E4FB0" },
  {
    token: "blue-900",
    hslTriplet: "216 85% 34%",
    hex: "#0D47A1",
    shadcnAlias: "primary / brand",
  },
  { token: "blue-950", hslTriplet: "220 83% 23%", hex: "#0A2A6B" },
];

const neutralTokens: SwatchProps[] = [
  {
    token: "white",
    hslTriplet: "0 0% 100%",
    hex: "#FFFFFF",
    shadcnAlias: "card / popover",
    backgroundOverride: "hsl(var(--white))",
    className: "",
  },
  {
    token: "gray-050",
    hslTriplet: "216 33% 97%",
    hex: "#F5F7FA",
    shadcnAlias: "background",
  },
  { token: "gray-100", hslTriplet: "0 0% 93%", hex: "#EEEEEE", shadcnAlias: "muted / secondary" },
  { token: "gray-200", hslTriplet: "0 0% 88%", hex: "#E0E0E0", shadcnAlias: "border / input" },
  { token: "gray-300", hslTriplet: "0 0% 74%", hex: "#BDBDBD" },
  { token: "gray-400", hslTriplet: "0 0% 62%", hex: "#9E9E9E" },
  { token: "gray-500", hslTriplet: "0 0% 46%", hex: "#757575" },
  {
    token: "gray-600",
    hslTriplet: "0 0% 38%",
    hex: "#616161",
    shadcnAlias: "muted-foreground",
  },
  { token: "gray-700", hslTriplet: "0 0% 26%", hex: "#424242" },
  { token: "gray-900", hslTriplet: "0 0% 13%", hex: "#212121", shadcnAlias: "foreground" },
  { token: "gray-950", hslTriplet: "216 12% 8%", hex: "#121417" },
];

const semanticTokens: SwatchProps[] = [
  { token: "success", hslTriplet: "123 46% 34%", hex: "#2E7D32", shadcnAlias: "green-700" },
  { token: "success-bg", hslTriplet: "125 39% 94%", hex: "#E8F5E9", shadcnAlias: "green-100" },
  { token: "warning", hslTriplet: "37 95% 56%", hex: "#F9A825", shadcnAlias: "amber-700" },
  { token: "warning-bg", hslTriplet: "46 100% 94%", hex: "#FFF8E1", shadcnAlias: "amber-100" },
  {
    token: "danger",
    hslTriplet: "0 66% 47%",
    hex: "#C62828",
    shadcnAlias: "destructive / red-700",
  },
  { token: "danger-bg", hslTriplet: "351 100% 96%", hex: "#FFEBEE", shadcnAlias: "red-100" },
  { token: "info", hslTriplet: "201 98% 41%", hex: "#0288D1", shadcnAlias: "info-600" },
  { token: "info-bg", hslTriplet: "199 94% 94%", hex: "#E1F5FE", shadcnAlias: "info-100" },
];

// ─── Type scale ───────────────────────────────────────────────────────
const typeScale = [
  { token: "text-xs", size: "0.75rem" },
  { token: "text-sm", size: "0.875rem" },
  { token: "text-base", size: "1rem" },
  { token: "text-lg", size: "1.125rem" },
  { token: "text-xl", size: "1.25rem" },
  { token: "text-2xl", size: "1.5rem" },
  { token: "text-3xl", size: "1.875rem" },
  { token: "text-4xl", size: "2.25rem" },
] as const;

// ─── Spacing / radii / shadows ────────────────────────────────────────
const spaceScale = [
  { token: "space-1", size: "4px" },
  { token: "space-2", size: "8px" },
  { token: "space-3", size: "12px" },
  { token: "space-4", size: "16px" },
  { token: "space-5", size: "20px" },
  { token: "space-6", size: "24px" },
  { token: "space-7", size: "32px" },
  { token: "space-8", size: "40px" },
] as const;

const radiiScale = [
  { token: "radius-xs", size: "4px" },
  { token: "radius-sm", size: "8px" },
  { token: "radius-md", size: "12px" },
  { token: "radius-lg", size: "16px" },
  { token: "radius-pill", size: "999px" },
] as const;

const shadowScale = [
  { token: "shadow-0", label: "No elevation" },
  { token: "shadow-1", label: "Card resting" },
  { token: "shadow-2", label: "Menus / popovers" },
  { token: "shadow-3", label: "Modals / overlays" },
  { token: "shadow-focus", label: "Focus ring" },
] as const;

const INSTALL_CMD =
  "npx shadcn@latest add http://registry.016910804.xyz/r/dgc-theme.json";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[var(--screen-max)] flex-col gap-12 px-[var(--gutter)] py-10">
      {/* ─── 1. Hero ─────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-6" id="hero">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            dg-superapp / design-system / Phase 2
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            DGC MiniApp Design System
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Khmer-first design tokens for Cambodia government mini-apps. Ships as
            a single shadcn registry item — one install, all tokens. Latin +
            Khmer side-by-side, WCAG-AA contrast, Tailwind v4, dark mode.
          </p>
          <p lang="km" className="max-w-2xl text-base text-muted-foreground">
            ប្រព័ន្ធរចនាដែលផ្តោតលើអក្សរខ្មែរសម្រាប់កម្មវិធីរដ្ឋាភិបាលកម្ពុជា។
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#primary-palette"
            className="inline-flex h-[var(--button-h)] items-center rounded-md bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-[var(--shadow-1)] transition-colors hover:bg-[hsl(var(--brand-hover))] active:bg-[hsl(var(--brand-press))]"
          >
            Browse tokens
          </a>
          <DarkModeToggle />
        </div>
        <pre className="overflow-x-auto rounded-md border border-border bg-card p-4 text-sm shadow-[var(--shadow-1)]">
          <code className="font-mono text-foreground">{INSTALL_CMD}</code>
        </pre>
      </section>

      {/* ─── 2. Primary palette ──────────────────────────────────────── */}
      <TokenTable
        title="Primary palette"
        caption="Cambodia blues. --blue-900 is the DGC brand anchor (#0D47A1) and the default shadcn --primary."
        tokens={primaryTokens}
      />

      {/* ─── 3. Neutrals ─────────────────────────────────────────────── */}
      <TokenTable
        title="Neutrals"
        caption="Greyscale. --gray-050 is --background; --gray-900 is --foreground."
        tokens={neutralTokens}
      />

      {/* ─── 4. Semantic palette ─────────────────────────────────────── */}
      <TokenTable
        title="Semantic palette"
        caption="Status colors for success / warning / danger / info plus their tinted backgrounds. Dark variants pre-computed as HSL triplets (D2)."
        tokens={semanticTokens}
        columnsClassName="grid-cols-2 sm:grid-cols-4"
      />

      {/* ─── 5. Type scale ───────────────────────────────────────────── */}
      <section className="flex flex-col gap-3" id="type-scale">
        <header className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">Type scale</h2>
          <p className="text-sm text-muted-foreground">
            Latin specimen (Inter) + Khmer specimen (Noto Sans Khmer). R3.3 —
            any element with <code className="font-mono">lang=&quot;km&quot;</code> picks up the Khmer stack
            and a roomier line-height via the <code className="font-mono">:lang(km)</code> cascade.
          </p>
        </header>
        <div className="flex flex-col gap-5 rounded-md border border-border bg-card p-5 shadow-[var(--shadow-1)]">
          {typeScale.map((t) => (
            <div
              key={t.token}
              data-token={t.token}
              className="flex flex-col gap-1 border-b border-border/50 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-muted-foreground">
                  --{t.token} · {t.size}
                </span>
              </div>
              <p
                style={{ fontSize: `var(--${t.token})` }}
                className="leading-tight text-foreground"
              >
                The quick brown fox jumps over the lazy dog
              </p>
              <p
                lang="km"
                style={{ fontSize: `var(--${t.token})` }}
                className="text-foreground"
              >
                កម្ពុជា អក្សរខ្មែរ សាកល្បង
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. Spacing ──────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3" id="spacing">
        <header className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">Spacing</h2>
          <p className="text-sm text-muted-foreground">
            4px base scale, --space-1 through --space-8.
          </p>
        </header>
        <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-5 shadow-[var(--shadow-1)]">
          {spaceScale.map((s) => (
            <div
              key={s.token}
              data-token={s.token}
              className="flex items-center gap-4"
            >
              <span className="w-32 font-mono text-[11px] text-muted-foreground">
                --{s.token} · {s.size}
              </span>
              <div
                aria-hidden="true"
                className="h-4 rounded-sm bg-brand"
                style={{ width: `var(--${s.token})` }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. Radii ────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3" id="radii">
        <header className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">Radii</h2>
          <p className="text-sm text-muted-foreground">
            --radius = 0.75rem (shadcn anchor). Derived shadcn radii:
            --radius-sm / md / lg.
          </p>
        </header>
        <div className="flex flex-wrap gap-5 rounded-md border border-border bg-card p-5 shadow-[var(--shadow-1)]">
          {radiiScale.map((r) => (
            <figure
              key={r.token}
              data-token={r.token}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="h-16 w-16 border border-border/60 bg-brand"
                style={{ borderRadius: `var(--${r.token})` }}
              />
              <figcaption className="font-mono text-[11px] text-muted-foreground">
                --{r.token} · {r.size}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ─── 8. Shadows ──────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3" id="elevation">
        <header className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">
            Shadows / Elevation
          </h2>
          <p className="text-sm text-muted-foreground">
            --shadow-0 through --shadow-3, plus --shadow-focus (uses
            --ring at 40% alpha).
          </p>
        </header>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {shadowScale.map((sh) => (
            <figure
              key={sh.token}
              data-token={sh.token}
              className="flex flex-col gap-3 rounded-md border border-border bg-card p-5"
              style={{ boxShadow: `var(--${sh.token})` }}
            >
              <figcaption className="flex flex-col gap-0.5">
                <span className="font-mono text-[11px] font-medium text-foreground">
                  --{sh.token}
                </span>
                <span className="text-xs text-muted-foreground">{sh.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ─── 9. Hello component preview ─────────────────────────────── */}
      <section className="flex flex-col gap-3" id="hello-preview">
        <header className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">
            Registry item preview: <code className="font-mono">hello</code>
          </h2>
          <p className="text-sm text-muted-foreground">
            Placeholder registry component. Task 7 will migrate it to
            <code className="font-mono"> bg-brand text-brand-foreground</code>.
          </p>
        </header>
        <Hello name="DGC" />
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground">
        <p>
          All swatches carry a stable <code className="font-mono">data-token</code>{" "}
          attribute for the visual-diff pipeline (Task 8).
        </p>
        <p lang="km" className="text-xs">
          រក្សាសិទ្ធិ © DGC MiniApp Design System
        </p>
      </footer>
    </main>
  );
}
