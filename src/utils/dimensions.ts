import { CardOptions } from "../types.ts";
import { CardDimensions } from "../layouts/types.ts";
import { getLayout } from "../layouts/registry.ts";

export type { CardDimensions };

/**
 * Calculates canvas dimensions for given card options by delegating to its registered layout definition.
 */
export function getCardDimensions(options: CardOptions): CardDimensions {
  const layout = getLayout(options.generateType);
  return layout.getDimensions(options);
}

/**
 * Returns a human-readable dimension label (e.g. '800 × 300 px').
 */
export function getCardDimensionsLabel(options: CardOptions): string {
  const layout = getLayout(options.generateType);
  if (layout.getDimensionsLabel) {
    return layout.getDimensionsLabel(options);
  }
  const { width, height } = layout.getDimensions(options);
  return `${width} × ${height} px`;
}
