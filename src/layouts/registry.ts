import { LayoutDefinition } from "./types.ts";
import { cardLayout } from "./definitions/card.ts";
import { wideCardLayout } from "./definitions/widecard.ts";
import { widescreenLayout } from "./definitions/widescreen.ts";
import { badgeLayout } from "./definitions/badge.ts";

const layoutRegistry = new Map<string, LayoutDefinition<any>>();

// Register default built-in layouts
const BUILT_IN_LAYOUTS: LayoutDefinition<any>[] = [
  cardLayout,
  wideCardLayout,
  widescreenLayout,
  badgeLayout,
];

for (const layout of BUILT_IN_LAYOUTS) {
  layoutRegistry.set(layout.id, layout);
}

/**
 * Register a new card layout format definition.
 * Any registered layout is automatically exposed in the Workbench UI and CLI.
 */
export function registerLayout(layout: LayoutDefinition<any>): void {
  layoutRegistry.set(layout.id, layout);
}

/**
 * Unregister a layout by ID.
 */
export function unregisterLayout(id: string): boolean {
  return layoutRegistry.delete(id);
}

/**
 * Get all registered layout definitions in registration order.
 */
export function getAllLayouts(): LayoutDefinition<any>[] {
  return Array.from(layoutRegistry.values());
}

/**
 * Get the default layout definition ('card').
 */
export function getDefaultLayout(): LayoutDefinition<any> {
  return layoutRegistry.get("card") || cardLayout;
}

/**
 * Get a layout definition by ID, falling back to default layout if not found.
 */
export function getLayout(id: string | undefined): LayoutDefinition<any> {
  if (!id) return getDefaultLayout();
  return layoutRegistry.get(id) || getDefaultLayout();
}

/**
 * Get a layout definition by ID, or undefined if not found.
 */
export function getLayoutOrNull(id: string | undefined): LayoutDefinition<any> | undefined {
  if (!id) return undefined;
  return layoutRegistry.get(id);
}

/**
 * Check if a layout ID is registered.
 */
export function hasLayout(id: string): boolean {
  return layoutRegistry.has(id);
}
