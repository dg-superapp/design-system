/**
 * @/components/ui/section-header shim for registry authoring.
 *
 * Mirrors the label.ts / badge.ts pattern — re-exports from registry source
 * so registry blocks can import via the consumer-facing path during
 * authoring without breaking shadcn install paths in consumer repos.
 */
export { SectionHeader } from "../../../registry/section-header/section-header";
export type { SectionHeaderProps } from "../../../registry/section-header/section-header";
