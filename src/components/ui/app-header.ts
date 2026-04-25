/**
 * @/components/ui/app-header shim for registry authoring.
 *
 * Cross-primitive imports in registry/* (e.g. miniapp-home block composes
 * AppHeader) use `@/components/ui/<name>` so shadcn-installed copies in
 * consumer projects resolve against the consumer's own components/ui tree.
 * This shim makes the same path resolve during typecheck + next-build in
 * THIS repo.
 *
 * Consumers never see this file — shadcn only bundles the target primitive
 * source plus its registryDependencies.
 */
export { AppHeader } from "../../../registry/app-header/app-header";
export type { AppHeaderProps, AppHeaderIconButtonProps } from "../../../registry/app-header/app-header";
