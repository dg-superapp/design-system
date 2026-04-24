import "@testing-library/jest-dom/vitest";

/**
 * jsdom lacks ResizeObserver, which Radix ScrollArea (and a few other
 * primitives) uses to detect overflow. Without this mock the scrollbar
 * never mounts, so class/attribute assertions against it can't run.
 * The mock is a no-op observer — tests assert class strings / DOM shape
 * only; they don't depend on resize events firing.
 */
if (typeof globalThis.ResizeObserver === "undefined") {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ResizeObserver = ResizeObserverMock;
}
