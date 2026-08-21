import { CardOptions } from "../types.ts";
import { getLayout } from "../layouts/registry.ts";

export * from "./defaults.ts";
export * from "./svg-base.ts";
export * from "./elements.ts";
export * from "./vertical-stack.ts";
export * from "../layouts/index.ts";

/**
 * Strategy Dispatcher: Generates SVG element using the registered layout generator.
 */
export function generateSVG(options: CardOptions): SVGSVGElement {
  const layout = getLayout(options.generateType);
  return layout.generate(options);
}
