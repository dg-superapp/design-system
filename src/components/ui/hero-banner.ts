/**
 * @/components/ui/hero-banner shim for registry authoring.
 *
 * Cross-block imports in registry/* (e.g. miniapp-home composes HeroBanner)
 * use `@/components/ui/<name>` so shadcn-installed copies in consumer
 * projects resolve against the consumer's own components/ui tree.
 *
 * Consumers never see this file — shadcn bundles only the target source
 * plus its registryDependencies.
 */
export { HeroBanner } from "../../../registry/hero-banner/hero-banner";
export type { HeroBannerProps } from "../../../registry/hero-banner/hero-banner";
