import { z } from "zod";

// Base Config Enums & Schemas
export const BackgroundTypeSchema = z.enum([
  "solid",
  "gradient",
  "glass",
  "image",
]);
export type BackgroundType = z.infer<typeof BackgroundTypeSchema>;

export const GradientDirectionSchema = z.enum([
  "to-r",
  "to-br",
  "to-b",
  "to-bl",
  "radial",
]);
export type GradientDirection = z.infer<typeof GradientDirectionSchema>;

export const BorderStyleSchema = z.enum(["solid", "dashed", "dotted", "none"]);
export type BorderStyle = z.infer<typeof BorderStyleSchema>;

export const ShadowEffectSchema = z.enum([
  "none",
  "subtle",
  "soft",
  "glow",
  "strong",
]);
export type ShadowEffect = z.infer<typeof ShadowEffectSchema>;

export const ImageShapeSchema = z.enum(["original", "rounded", "circle"]);
export type ImageShape = z.infer<typeof ImageShapeSchema>;

export const TitleFontWeightSchema = z.enum([
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
]);
export type TitleFontWeight = z.infer<typeof TitleFontWeightSchema>;

export const DescriptionFontWeightSchema = z.enum([
  "300",
  "400",
  "500",
  "600",
  "700",
]);
export type DescriptionFontWeight = z.infer<typeof DescriptionFontWeightSchema>;

export const TextAlignSchema = z.enum(["left", "center", "right"]);
export type TextAlign = z.infer<typeof TextAlignSchema>;

export const VerticalAlignSchema = z.enum(["top", "middle", "bottom"]);
export type VerticalAlign = z.infer<typeof VerticalAlignSchema>;

export const IconPositionSchema = z.enum(["left", "right", "none"]);
export type IconPosition = z.infer<typeof IconPositionSchema>;

export const ImagePositionSchema = z.enum(["left", "right"]);
export type ImagePosition = z.infer<typeof ImagePositionSchema>;

export const StatusPositionSchema = z.enum(["right", "left"]);
export type StatusPosition = z.infer<typeof StatusPositionSchema>;

// Configuration Schemas
export const BackgroundConfigSchema = z.object({
  type: BackgroundTypeSchema.describe("Background style type"),
  color: z.string().describe("Background solid color hex or CSS color"),
  gradientStart: z.string().describe("Gradient start color"),
  gradientEnd: z.string().describe("Gradient end color"),
  gradientMiddle: z
    .string()
    .optional()
    .describe("Gradient middle color (optional)"),
  gradientDirection: GradientDirectionSchema.describe("Gradient direction"),
  opacity: z.number().describe("Background opacity (0-1)"),
  imageUrl: z.string().optional().describe("Background image URL/data URI"),
  imageOpacity: z.number().optional().describe("Background image opacity (0-1)"),
  overlayColor: z.string().optional().describe("Background overlay color"),
  overlayOpacity: z
    .number()
    .optional()
    .describe("Background overlay opacity (0-1)"),
});
export type BackgroundConfig = z.infer<typeof BackgroundConfigSchema>;

export const BorderConfigSchema = z.object({
  color: z.string().describe("Border stroke color"),
  width: z.number().describe("Border thickness in px"),
  style: BorderStyleSchema.describe("Border line style"),
  radius: z.number().describe("Border corner radius in px"),
  margin: z.number().describe("Border outer margin in px"),
  shadow: ShadowEffectSchema.describe("Border shadow/elevation effect"),
  glowColor: z
    .string()
    .optional()
    .describe("Neon glow color (when shadow is glow)"),
});
export type BorderConfig = z.infer<typeof BorderConfigSchema>;

export const TitleFontConfigSchema = z.object({
  color: z.string().describe("Title text color"),
  fontFamily: z.string().describe("Title font family name"),
  fontWeight: TitleFontWeightSchema.describe("Title font weight"),
  fontSize: z.number().describe("Title font size in px"),
  letterSpacing: z.number().describe("Title letter spacing in px"),
  uppercase: z.boolean().describe("Force uppercase title text"),
});
export type TitleFontConfig = z.infer<typeof TitleFontConfigSchema>;

export const DescriptionFontConfigSchema = z.object({
  color: z.string().describe("Description text color"),
  fontFamily: z.string().describe("Description font family name"),
  fontWeight: DescriptionFontWeightSchema.describe("Description font weight"),
  fontSize: z.number().describe("Description font size in px"),
  lineHeight: z.number().describe("Description line height multiplier"),
  opacity: z.number().describe("Description text opacity (0-1)"),
});
export type DescriptionFontConfig = z.infer<typeof DescriptionFontConfigSchema>;

export const ImageConfigSchema = z.object({
  url: z.string().describe("Logo / illustration image URL or data URI"),
  shape: ImageShapeSchema.describe("Image crop shape"),
  size: z.number().describe("Image dimensions in px"),
  show: z.boolean().describe("Whether to display the logo image"),
  verticalAlign: VerticalAlignSchema.optional().describe(
    "Logo vertical alignment (top, middle, bottom)",
  ),
  verticalOffset: z.number().optional().describe(
    "Logo vertical offset in px (shift up/down)",
  ),
  horizontalOffset: z.number().optional().describe(
    "Logo horizontal offset in px (shift left/right)",
  ),
});
export type ImageConfig = z.infer<typeof ImageConfigSchema>;

// Base Card Options Schema - common to all layouts
export const BaseCardOptionsSchema = z.object({
  generateType: z.string().describe("Card layout format"),
  title: z.string().describe("Card main title text"),
  background: BackgroundConfigSchema,
  splitBackground: BackgroundConfigSchema.optional().describe(
    "Split panel background configuration (for split variants)",
  ),
  border: BorderConfigSchema,
  titleFont: TitleFontConfigSchema,
  image: ImageConfigSchema,
  textAlign: TextAlignSchema.optional().describe("Text horizontal alignment"),
  verticalAlign: VerticalAlignSchema.optional().describe(
    "Content vertical alignment (top, middle, bottom)",
  ),
  verticalOffset: z.number().optional().describe(
    "Content/text vertical offset in px (shift up/down)",
  ),
  horizontalOffset: z.number().optional().describe(
    "Content/text horizontal offset in px (shift left/right)",
  ),
});
export type BaseCardOptions = z.infer<typeof BaseCardOptionsSchema>;

export type GenerateType = string;
export type LayoutFormatType = string;

/**
 * Universal Card Options structure.
 * Extensible for any registered layout format.
 */
export type CardOptions = BaseCardOptions & {
  description?: string;
  descriptionFont?: DescriptionFontConfig;
  [key: string]: any;
};
