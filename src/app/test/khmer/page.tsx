/**
 * /test/khmer — Khmer clipping smoke page (3-CONTEXT D-08, D-17).
 *
 * Every primitive plan (3-01..3-14) imports its component and adds a
 * <section> here with Khmer labels, placeholders, and subscript-heavy
 * strings ("ស្នើ", "ក្ម៉េង", coeng "្ក ្ខ ្គ ្ឃ") to catch:
 *   - line-height regressions (subscripts clip on 1.2 leading)
 *   - font-cascade misses (Khmer falling back to Latin stack)
 *   - container overflow on long bilingual labels
 *
 * Wave 0: ships the shell with an empty grid. Plans append children.
 * Playwright visual-diff snapshot lives in plan 3-16.
 */

export const metadata = {
  title: 'Khmer Clipping Test — DGC MiniApp Design System',
  description: 'Renders every primitive with Khmer labels for visual-diff regression testing.',
};

export default function KhmerTestPage() {
  return (
    <div lang="km" className="khmer-test space-y-4 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">ការសាកល្បងពុម្ពអក្សរខ្មែរ</h1>
        <p className="text-sm text-muted-foreground">
          Khmer clipping checkpoint. Every primitive registers a specimen below. Visual-diff
          snapshot lives in plan 3-16 (see .planning/phases/03-primitives/3-VALIDATION.md exit.khmer).
        </p>
      </header>

      <section
        data-testid="khmer-primitive-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {/* Plans 3-01..3-14 append primitive specimens here. */}
        <p className="text-sm text-muted-foreground">
          (Wave 0 — primitive plans append specimens here.)
        </p>
      </section>
    </div>
  );
}
