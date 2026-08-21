import { ComponentType } from "preact";
import { z } from "zod";
import {
  BackgroundConfig,
  BaseCardOptions,
  BorderConfig,
  DescriptionFontConfig,
  ImageConfig,
  TitleFontConfig,
} from "../types.ts";

export interface CardDimensions {
  width: number;
  height: number;
}

export interface NormalizerHelpers {
  normalizeColor: (color: string | undefined, fallback: string) => string;
  parseFontFamily: (family: string | undefined, fallback: string) => string;
  parseFontWeight: (weight: string | undefined, fallback: any) => any;
  normalizeBackground: (rawBg: any, fallback: BackgroundConfig) => BackgroundConfig;
  normalizeBorder: (rawBorder: any, fallback: BorderConfig) => BorderConfig;
  normalizeTitleFont: (rawTitle: any, fallback: TitleFontConfig) => TitleFontConfig;
  normalizeDescriptionFont: (rawDesc: any, fallback: DescriptionFontConfig) => DescriptionFontConfig;
  normalizeImage: (rawImage: any, fallback: ImageConfig) => ImageConfig;
}

export interface LayoutControlsProps<T extends BaseCardOptions = BaseCardOptions> {
  options: T;
  setOptions: (updater: (prev: T) => T) => void;
}

/* ==========================================================================
   Declarative Field Descriptor Types
   ========================================================================== */

export type { SuggestionChip } from "../data/suggestions.ts";
import type { SuggestionChip } from "../data/suggestions.ts";

export type FieldType =
  | "segmented"
  | "select"
  | "slider"
  | "text"
  | "textarea"
  | "boolean"
  | "color";

export interface SelectOption<T = any> {
  label: string;
  value: T;
  description?: string;
}

export interface BaseFieldDescriptor {
  /** Dot-notation property path (e.g. 'title', 'background.color', 'border.width') */
  key: string;
  label: string;
  description?: string;
  group?: string;
  icon?: any;
  visibleIf?: (options: any) => boolean;
}

export interface SegmentedField<T = any> extends BaseFieldDescriptor {
  type: "segmented";
  options: SelectOption<T>[];
}

export interface SelectField<T = any> extends BaseFieldDescriptor {
  type: "select";
  options: SelectOption<T>[];
}

export interface SliderField extends BaseFieldDescriptor {
  type: "slider";
  min: number;
  max: number;
  step?: number;
  unit?: string;
  quickValues?: number[];
}

export interface TextField extends BaseFieldDescriptor {
  type: "text";
  placeholder?: string;
  suggestions?: SuggestionChip[];
  suggestionsLabel?: string;
  allowUpload?: boolean;
  uploadType?: "image" | "file";
  allowClear?: boolean;
}

export interface TextareaField extends BaseFieldDescriptor {
  type: "textarea";
  placeholder?: string;
  rows?: number;
  suggestions?: SuggestionChip[];
  suggestionsLabel?: string;
}

export interface BooleanField extends BaseFieldDescriptor {
  type: "boolean";
}

export interface ColorField extends BaseFieldDescriptor {
  type: "color";
  fallback?: string;
  swatches?: string[];
}

export type LayoutField =
  | SegmentedField
  | SelectField
  | SliderField
  | TextField
  | TextareaField
  | BooleanField
  | ColorField;

/* ==========================================================================
   Layout Definition Interface
   ========================================================================== */

/**
 * Definition interface for any card layout format.
 * To add a new layout format to project-title-card, create an object
 * satisfying this interface and register it with `registerLayout()`.
 */
export interface LayoutDefinition<TOptions extends BaseCardOptions = BaseCardOptions> {
  /** Unique layout format identifier (e.g. 'card', 'widecard', 'widescreen', 'badge') */
  id: string;

  /** Human-readable display name for UI */
  name: string;

  /** Brief description for CLI help and tooltips */
  description: string;

  /** Short category or tag for grouping (e.g. 'Standard', 'Banner', 'Shield') */
  category?: string;

  /** Whether this layout format uses and supports a card description */
  supportsDescription: boolean;

  /** Declarative list of layout fields automatically rendered by the dynamic field renderer */
  fields?: LayoutField[];

  /** Zod validation schema for this layout's options */
  schema: z.ZodType<TOptions>;

  /** Default options when this layout format is selected */
  defaultOptions: TOptions;

  /** Function calculating canvas width and height for this layout */
  getDimensions: (options: TOptions) => CardDimensions;

  /** Optional custom dimension label (e.g. for dynamic auto-sized badges) */
  getDimensionsLabel?: (options: TOptions) => string;

  /** SVG rendering generator function */
  generate: (options: TOptions) => SVGSVGElement;

  /** Optional custom normalizer for layout-specific properties */
  normalize?: (
    raw: Record<string, unknown>,
    baseDefault: TOptions,
    helpers: NormalizerHelpers,
  ) => TOptions;

  /** Optional custom component override if a layout needs non-standard bespoke controls */
  ControlsComponent?: ComponentType<LayoutControlsProps<TOptions>>;
}
