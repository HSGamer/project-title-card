import {
  BadgeCardOptions,
  CardOptions,
  StandardCardOptions,
  WideCardOptions,
  WidescreenCardOptions,
} from "../types.ts";

import { generateCard } from "./layouts/card.ts";
import { generateWidecard } from "./layouts/wide.ts";
import { generateWidescreen } from "./layouts/widescreen.ts";
import { generateBadge } from "./layouts/badge.ts";

export * from "./defaults.ts";
export * from "./svg-base.ts";
export * from "./elements.ts";

export { generateBadge, generateCard, generateWidecard, generateWidescreen };

/**
 * Strategy Dispatcher: Generates SVG element based on options.generateType
 */
export function generateSVG(options: CardOptions): SVGSVGElement {
  switch (options.generateType) {
    case "widecard":
      return generateWidecard(options as WideCardOptions);
    case "widescreen":
      return generateWidescreen(options as WidescreenCardOptions);
    case "badge":
      return generateBadge(options as BadgeCardOptions);
    case "card":
    default:
      return generateCard(options as StandardCardOptions);
  }
}
