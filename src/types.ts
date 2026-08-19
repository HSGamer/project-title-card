export type LayoutFormatType = "card" | "widecard" | "widescreen" | "badge";

// Re-export GenerateType for backwards compatibility
export type GenerateType = LayoutFormatType;

export type BackgroundType = "solid" | "gradient" | "glass" | "image";
export type GradientDirection = "to-r" | "to-br" | "to-b" | "to-bl" | "radial";
export type BorderStyle = "solid" | "dashed" | "dotted" | "none";
export type ShadowEffect = "none" | "subtle" | "soft" | "glow" | "strong";
export type ImageShape = "original" | "rounded" | "circle";
export type TitleFontWeight = "400" | "500" | "600" | "700" | "800" | "900";
export type DescriptionFontWeight = "300" | "400" | "500" | "600" | "700";

export type TextAlign = "left" | "center";
export type WidescreenLayout = "split" | "centered" | "banner" | "hero" | "minimal";
export type BannerVariant = WidescreenLayout;

export type CardVariant = "standard" | "hero" | "compact" | "minimal" | "split";
export type WideVariant = "standard" | "split" | "centered" | "minimal" | "badge";

export interface BackgroundConfig {
  type: BackgroundType;
  color: string;
  gradientStart: string;
  gradientEnd: string;
  gradientMiddle?: string;
  gradientDirection: GradientDirection;
  opacity: number;
  // Custom background image settings
  imageUrl?: string;
  imageOpacity?: number;
  overlayColor?: string;
  overlayOpacity?: number;
}

export interface BorderConfig {
  color: string;
  width: number;
  style: BorderStyle;
  radius: number;
  margin: number;
  shadow: ShadowEffect;
  glowColor?: string;
}

export interface TitleFontConfig {
  color: string;
  fontFamily: string;
  fontWeight: TitleFontWeight;
  fontSize: number;
  letterSpacing: number;
  uppercase: boolean;
}

export interface DescriptionFontConfig {
  color: string;
  fontFamily: string;
  fontWeight: DescriptionFontWeight;
  fontSize: number;
  lineHeight: number;
  opacity: number;
}

export interface ImageConfig {
  url: string;
  shape: ImageShape;
  size: number;
  show: boolean;
}

export interface BaseCardOptions {
  generateType: LayoutFormatType;
  title: string;
  background: BackgroundConfig;
  border: BorderConfig;
  titleFont: TitleFontConfig;
  image: ImageConfig;
}

export interface StandardCardOptions extends BaseCardOptions {
  generateType: "card";
  cardVariant?: CardVariant;
  description: string;
  descriptionFont: DescriptionFontConfig;
  textAlign: TextAlign;
}

export interface WideCardOptions extends BaseCardOptions {
  generateType: "widecard";
  wideVariant?: WideVariant;
  description: string;
  descriptionFont: DescriptionFontConfig;
  imagePosition: "left" | "right";
}

export interface WidescreenCardOptions extends BaseCardOptions {
  generateType: "widescreen";
  bannerVariant?: BannerVariant;
  description: string;
  descriptionFont: DescriptionFontConfig;
  layoutStyle: WidescreenLayout;
}

export type BadgeVariant =
  | "standard"
  | "pill"
  | "split"
  | "status"
  | "outline";

export type BadgeStatusStyle = "pill" | "dot";

export interface BadgeCardOptions extends BaseCardOptions {
  generateType: "badge";
  badgeVariant?: BadgeVariant;
  badgeWidth: number;
  badgeHeight: number;
  iconPosition: "left" | "right" | "none";
  // Split badge variant options
  badgeLabel?: string;
  labelBackground?: string;
  labelColor?: string;
  splitPosition?: number;
  // Status badge variant options
  statusText?: string;
  statusColor?: string;
  statusStyle?: BadgeStatusStyle;
  statusPosition?: "right" | "left";
}

export type CardOptions =
  | StandardCardOptions
  | WideCardOptions
  | WidescreenCardOptions
  | BadgeCardOptions;
