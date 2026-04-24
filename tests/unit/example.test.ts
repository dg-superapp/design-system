import { describe, expect, it } from 'vitest';

/**
 * Vitest boot smoke — proves `pnpm test:unit` wires up correctly.
 * Real per-primitive unit tests land in plans 3-08 (Label) and 3-13
 * (Separator) where static behavior makes unit tests cheaper than e2e.
 */
describe('vitest wiring', () => {
  it('math still works', () => {
    expect(1 + 1).toBe(2);
  });
});
