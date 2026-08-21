import { BackgroundConfig, CardOptions } from "../types.ts";
import {
  defaultBadgeOptions,
  defaultStandardOptions,
  defaultWideOptions,
  defaultWidescreenOptions,
} from "../layouts/index.ts";

export const DEFAULT_SPLIT_BACKGROUND: BackgroundConfig = {
  type: "solid",
  color: "#0b1329",
  gradientStart: "#0b1329",
  gradientEnd: "#1e293b",
  gradientDirection: "to-br",
  opacity: 1,
};

export {
  defaultBadgeOptions,
  defaultStandardOptions,
  defaultWideOptions,
  defaultWidescreenOptions,
};

export const defaultOptions: CardOptions = defaultStandardOptions;
