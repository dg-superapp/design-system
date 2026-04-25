/**
 * @/components/ui/nav-row shim for registry authoring.
 *
 * Mirrors the label.ts / badge.ts / app-header.ts pattern — re-exports
 * from registry source so registry blocks can import via the consumer-facing
 * path during authoring without breaking shadcn install paths in consumer
 * repos.
 */
export { NavRow, navRowVariants } from "../../../registry/nav-row/nav-row";
export type { NavRowProps, NavRowTrailingVariant } from "../../../registry/nav-row/nav-row";
