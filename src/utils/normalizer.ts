import {
  BackgroundConfig,
  BackgroundType,
  BorderConfig,
  BorderStyle,
  CardOptions,
  DescriptionFontConfig,
  DescriptionFontWeight,
  GradientDirection,
  ImageConfig,
  ImageShape,
  ShadowEffect,
  TitleFontConfig,
  TitleFontWeight,
  VerticalAlign,
} from "../types.ts";
import { NormalizerHelpers } from "../layouts/types.ts";
import { getLayout, getDefaultLayout } from "../layouts/registry.ts";

const NAMED_COLORS: Record<string, string> = {
  white: "#ffffff",
  black: "#000000",
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#eab308",
  purple: "#a855f7",
  orange: "#f97316",
  gray: "#6b7280",
  grey: "#6b7280",
  silver: "#cbd5e1",
  cyan: "#06b6d4",
  pink: "#ec4899",
  transparent: "transparent",
};

export function normalizeColor(
  colorStr: string | undefined,
  fallback: string,
): string {
  if (!colorStr) return fallback;
  const clean = colorStr.trim().toLowerCase();
  if (NAMED_COLORS[clean]) {
    return NAMED_COLORS[clean];
  }
  return colorStr.trim();
}

export function parseFontWeight(
  weightStr: string | undefined,
  fallback: TitleFontWeight,
): TitleFontWeight {
  if (!weightStr) return fallback;
  const clean = weightStr.trim().toLowerCase();
  if (clean === "bold" || clean === "bolder") return "700";
  if (clean === "normal" || clean === "lighter" || clean === "light") {
    return "400";
  }
  if (["300", "400", "500", "600", "700", "800", "900"].includes(clean)) {
    return clean as TitleFontWeight;
  }
  return fallback;
}

export function parseFontFamily(
  familyStr: string | undefined,
  fallback: string,
): string {
  if (!familyStr) return fallback;
  const clean = familyStr.replace(/;/g, "").trim();
  const lower = clean.toLowerCase();

  if (lower === "monospace" || lower.startsWith("monospace")) {
    return "monospace";
  }
  if (lower === "arial" || lower.startsWith("arial")) {
    return "Arial, Helvetica, sans-serif";
  }
  if (lower.includes("jetbrains mono") || lower.includes("fira code")) {
    return '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace';
  }
  if (
    lower.includes("courier") || lower.includes("consolas") ||
    lower.includes("menlo") || lower.includes("monaco")
  ) {
    return 'Menlo, Monaco, Consolas, "Courier New", monospace';
  }
  if (lower.includes("times")) {
    return '"Times New Roman", Times, Georgia, serif';
  }
  if (lower.includes("georgia") || lower.includes("serif")) {
    return 'Georgia, "Times New Roman", Times, serif';
  }
  if (
    lower.includes("verdana") || lower.includes("geneva") ||
    lower.includes("tahoma")
  ) {
    return "Verdana, Geneva, Tahoma, sans-serif";
  }
  if (lower.includes("montserrat")) {
    return 'Montserrat, "Helvetica Neue", Arial, sans-serif';
  }
  if (lower.includes("poppins") || lower.includes("quicksand")) {
    return 'Poppins, Quicksand, "Nunito", sans-serif';
  }
  if (lower.includes("inter")) {
    return 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  }
  if (lower.includes("system-ui")) {
    return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  }
  return clean;
}

export function normalizeBackground(
  rawBg: any,
  fallback: BackgroundConfig,
): BackgroundConfig {
  if (!rawBg || typeof rawBg !== "object") return { ...fallback };

  const bgType: BackgroundType =
    rawBg.type === "solid" || rawBg.type === "gradient" ||
      rawBg.type === "glass" || rawBg.type === "image"
      ? rawBg.type
      : fallback.type;

  const bgColor = typeof rawBg.color === "string"
    ? normalizeColor(rawBg.color, fallback.color)
    : fallback.color;

  const gradStart = typeof rawBg.gradientStart === "string"
    ? rawBg.gradientStart
    : fallback.gradientStart;

  const gradEnd = typeof rawBg.gradientEnd === "string"
    ? rawBg.gradientEnd
    : fallback.gradientEnd;

  const gradMiddle = typeof rawBg.gradientMiddle === "string"
    ? rawBg.gradientMiddle
    : fallback.gradientMiddle;

  const gradDir: GradientDirection = rawBg.gradientDirection === "to-r" ||
      rawBg.gradientDirection === "to-b" ||
      rawBg.gradientDirection === "to-bl" ||
      rawBg.gradientDirection === "radial"
    ? rawBg.gradientDirection
    : fallback.gradientDirection;

  const bgOpacity = typeof rawBg.opacity === "number"
    ? rawBg.opacity
    : fallback.opacity;

  const bgImageUrl = typeof rawBg.imageUrl === "string"
    ? rawBg.imageUrl
    : fallback.imageUrl;
  const bgImageOpacity = typeof rawBg.imageOpacity === "number"
    ? rawBg.imageOpacity
    : fallback.imageOpacity ?? 1;
  const bgOverlayColor = typeof rawBg.overlayColor === "string"
    ? rawBg.overlayColor
    : fallback.overlayColor;
  const bgOverlayOpacity = typeof rawBg.overlayOpacity === "number"
    ? rawBg.overlayOpacity
    : fallback.overlayOpacity ?? 0.5;

  return {
    type: bgType,
    color: bgColor,
    gradientStart: gradStart,
    gradientEnd: gradEnd,
    gradientMiddle: gradMiddle,
    gradientDirection: gradDir,
    opacity: bgOpacity,
    imageUrl: bgImageUrl,
    imageOpacity: bgImageOpacity,
    overlayColor: bgOverlayColor,
    overlayOpacity: bgOverlayOpacity,
  };
}

export function normalizeBorder(
  rawBorder: any,
  fallback: BorderConfig,
): BorderConfig {
  if (!rawBorder || typeof rawBorder !== "object") return { ...fallback };

  const borderColor = typeof rawBorder.color === "string"
    ? normalizeColor(rawBorder.color, fallback.color)
    : fallback.color;

  const borderWidth = typeof rawBorder.width === "number"
    ? rawBorder.width
    : fallback.width;

  const borderStyle: BorderStyle =
    rawBorder.style === "dashed" || rawBorder.style === "dotted" ||
      rawBorder.style === "none"
      ? rawBorder.style
      : fallback.style;

  const borderRadius = typeof rawBorder.radius === "number"
    ? rawBorder.radius
    : fallback.radius;

  const borderMargin = typeof rawBorder.margin === "number"
    ? rawBorder.margin
    : fallback.margin;

  const shadow: ShadowEffect = rawBorder.shadow === "none" ||
      rawBorder.shadow === "subtle" ||
      rawBorder.shadow === "strong" ||
      rawBorder.shadow === "glow"
    ? rawBorder.shadow
    : fallback.shadow;

  const glowColor = typeof rawBorder.glowColor === "string"
    ? rawBorder.glowColor
    : borderColor || fallback.glowColor;

  return {
    color: borderColor,
    width: borderWidth,
    style: borderStyle,
    radius: borderRadius,
    margin: borderMargin,
    shadow,
    glowColor,
  };
}

export function normalizeTitleFont(
  rawTitle: any,
  fallback: TitleFontConfig,
): TitleFontConfig {
  if (!rawTitle || typeof rawTitle !== "object") return { ...fallback };

  const color = typeof rawTitle.color === "string"
    ? normalizeColor(rawTitle.color, fallback.color)
    : fallback.color;

  const fontFamily = typeof rawTitle.fontFamily === "string"
    ? parseFontFamily(rawTitle.fontFamily, fallback.fontFamily)
    : fallback.fontFamily;

  const fontWeight: TitleFontWeight =
    ["400", "500", "600", "700", "800", "900"].includes(
        String(rawTitle.fontWeight),
      )
      ? (rawTitle.fontWeight as TitleFontWeight)
      : fallback.fontWeight;

  const fontSize = typeof rawTitle.fontSize === "number"
    ? rawTitle.fontSize
    : fallback.fontSize;

  const letterSpacing = typeof rawTitle.letterSpacing === "number"
    ? rawTitle.letterSpacing
    : fallback.letterSpacing;

  const uppercase = Boolean(rawTitle.uppercase ?? fallback.uppercase);

  return {
    color,
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    uppercase,
  };
}

export function normalizeDescriptionFont(
  rawDesc: any,
  fallback: DescriptionFontConfig,
): DescriptionFontConfig {
  if (!rawDesc || typeof rawDesc !== "object") return { ...fallback };

  const color = typeof rawDesc.color === "string"
    ? normalizeColor(rawDesc.color, fallback.color)
    : fallback.color;

  const fontFamily = typeof rawDesc.fontFamily === "string"
    ? parseFontFamily(rawDesc.fontFamily, fallback.fontFamily)
    : fallback.fontFamily;

  const fontWeight: DescriptionFontWeight =
    ["300", "400", "500", "600", "700"].includes(String(rawDesc.fontWeight))
      ? (rawDesc.fontWeight as DescriptionFontWeight)
      : fallback.fontWeight;

  const fontSize = typeof rawDesc.fontSize === "number"
    ? rawDesc.fontSize
    : fallback.fontSize;

  const lineHeight = typeof rawDesc.lineHeight === "number"
    ? rawDesc.lineHeight
    : fallback.lineHeight;

  const opacity = typeof rawDesc.opacity === "number"
    ? rawDesc.opacity
    : fallback.opacity;

  return {
    color,
    fontFamily,
    fontWeight,
    fontSize,
    lineHeight,
    opacity,
  };
}

export function normalizeImage(
  rawImage: any,
  fallback: ImageConfig,
): ImageConfig {
  if (!rawImage || typeof rawImage !== "object") return { ...fallback };

  const url = typeof rawImage.url === "string" ? rawImage.url : fallback.url;

  const shape: ImageShape =
    rawImage.shape === "original" || rawImage.shape === "circle"
      ? rawImage.shape
      : fallback.shape;

  const size = typeof rawImage.size === "number" ? rawImage.size : fallback.size;

  const show = rawImage.show !== undefined
    ? Boolean(rawImage.show)
    : Boolean(url && url.trim());

  const rawImgVAlign = String(rawImage.verticalAlign || "").toLowerCase();
  const verticalAlign: VerticalAlign = rawImgVAlign === "top"
    ? "top"
    : rawImgVAlign === "bottom"
    ? "bottom"
    : fallback.verticalAlign || "middle";

  const verticalOffset = typeof rawImage.verticalOffset === "number"
    ? rawImage.verticalOffset
    : fallback.verticalOffset || 0;

  const horizontalOffset = typeof rawImage.horizontalOffset === "number"
    ? rawImage.horizontalOffset
    : fallback.horizontalOffset || 0;

  return {
    url,
    shape,
    size,
    show,
    verticalAlign,
    verticalOffset,
    horizontalOffset,
  };
}

const normalizerHelpers: NormalizerHelpers = {
  normalizeColor,
  parseFontFamily,
  parseFontWeight,
  normalizeBackground,
  normalizeBorder,
  normalizeTitleFont,
  normalizeDescriptionFont,
  normalizeImage,
};

/**
 * Normalizes any partial or unvalidated card options object into fully typed CardOptions,
 * delegating to the appropriate registered layout definition.
 */
export function normalizeCardOptions(raw: unknown): CardOptions {
  const defaultLayout = getDefaultLayout();
  if (!raw || typeof raw !== "object") {
    return { ...defaultLayout.defaultOptions };
  }

  const rawObj = raw as Record<string, unknown>;
  const format = typeof rawObj.generateType === "string"
    ? rawObj.generateType
    : defaultLayout.id;

  const layout = getLayout(format);
  const baseDefault = { ...layout.defaultOptions };

  if (layout.normalize) {
    return layout.normalize(rawObj, baseDefault, normalizerHelpers);
  }

  // Generic fallback normalization
  const title = typeof rawObj.title === "string" ? rawObj.title : baseDefault.title;
  const description = typeof rawObj.description === "string"
    ? rawObj.description
    : (baseDefault as any).description || "";

  const verticalAlign = rawObj.verticalAlign === "top" || rawObj.verticalAlign === "bottom"
    ? rawObj.verticalAlign
    : "middle";

  const verticalOffset = typeof rawObj.verticalOffset === "number" ? rawObj.verticalOffset : 0;
  const horizontalOffset = typeof rawObj.horizontalOffset === "number" ? rawObj.horizontalOffset : 0;

  return {
    ...baseDefault,
    ...rawObj,
    generateType: layout.id,
    title,
    description,
    verticalAlign,
    verticalOffset,
    horizontalOffset,
    background: normalizeBackground(rawObj.background, baseDefault.background),
    border: normalizeBorder(rawObj.border, baseDefault.border),
    titleFont: normalizeTitleFont(rawObj.titleFont, baseDefault.titleFont),
    image: normalizeImage(rawObj.image, baseDefault.image),
  };
}
