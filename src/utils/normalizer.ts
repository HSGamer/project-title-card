import {
  BackgroundConfig,
  BackgroundType,
  BadgeCardOptions,
  BorderConfig,
  BorderStyle,
  CardOptions,
  CardVariant,
  DescriptionFontConfig,
  DescriptionFontWeight,
  GradientDirection,
  ImageConfig,
  ImageShape,
  LayoutFormatType,
  ShadowEffect,
  StandardCardOptions,
  TextAlign,
  TitleFontConfig,
  TitleFontWeight,
  VerticalAlign,
  WideCardOptions,
  WideVariant,
  WidescreenCardOptions,
  WidescreenLayout,
} from "../types.ts";
import {
  DEFAULT_SPLIT_BACKGROUND,
  defaultBadgeOptions,
  defaultStandardOptions,
  defaultWideOptions,
  defaultWidescreenOptions,
} from "../generators/defaults.ts";

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
  if (["400", "500", "600", "700", "800", "900"].includes(clean)) {
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
  if (
    lower.includes("jetbrains mono") || lower.includes("fira code")
  ) {
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
  if (lower.includes("verdana") || lower.includes("geneva") || lower.includes("tahoma")) {
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

export function normalizeCardOptions(raw: unknown): CardOptions {
  if (!raw || typeof raw !== "object") {
    return defaultStandardOptions;
  }

  const rawObj = raw as Record<string, unknown>;
  const rawBg = typeof rawObj.background === "object" && rawObj.background !== null
    ? (rawObj.background as Record<string, unknown>)
    : null;
  const rawBorder = typeof rawObj.border === "object" && rawObj.border !== null
    ? (rawObj.border as Record<string, unknown>)
    : null;
  const rawTitleFont =
    typeof rawObj.titleFont === "object" && rawObj.titleFont !== null
      ? (rawObj.titleFont as Record<string, unknown>)
      : null;
  const rawDescFont = typeof rawObj.descriptionFont === "object" &&
      rawObj.descriptionFont !== null
    ? (rawObj.descriptionFont as Record<string, unknown>)
    : null;
  const rawImage = typeof rawObj.image === "object" && rawObj.image !== null
    ? (rawObj.image as Record<string, unknown>)
    : null;

  // Determine format
  let format: LayoutFormatType = "card";
  if (rawObj.generateType === "widecard") {
    format = "widecard";
  } else if (rawObj.generateType === "widescreen") {
    format = "widescreen";
  } else if (rawObj.generateType === "badge") {
    format = "badge";
  }

  const baseDefault = format === "widecard"
    ? defaultWideOptions
    : format === "widescreen"
    ? defaultWidescreenOptions
    : format === "badge"
    ? defaultBadgeOptions
    : defaultStandardOptions;

  // 1. Background parsing
  const bgType: BackgroundType =
    rawBg?.type === "solid" || rawBg?.type === "gradient" ||
      rawBg?.type === "glass" || rawBg?.type === "image"
      ? (rawBg.type as BackgroundType)
      : "solid";

  const bgColor = typeof rawBg?.color === "string"
    ? normalizeColor(rawBg.color, baseDefault.background.color)
    : typeof rawObj.backgroundColor === "string"
    ? normalizeColor(rawObj.backgroundColor, baseDefault.background.color)
    : baseDefault.background.color;

  const gradStart = typeof rawBg?.gradientStart === "string"
    ? rawBg.gradientStart
    : baseDefault.background.gradientStart;

  const gradEnd = typeof rawBg?.gradientEnd === "string"
    ? rawBg.gradientEnd
    : baseDefault.background.gradientEnd;

  const gradMiddle = typeof rawBg?.gradientMiddle === "string"
    ? rawBg.gradientMiddle
    : baseDefault.background.gradientMiddle;

  const gradDir: GradientDirection = rawBg?.gradientDirection === "to-r" ||
      rawBg?.gradientDirection === "to-b" ||
      rawBg?.gradientDirection === "to-bl" ||
      rawBg?.gradientDirection === "radial"
    ? rawBg.gradientDirection
    : "to-br";

  const bgOpacity = typeof rawBg?.opacity === "number"
    ? rawBg.opacity
    : typeof rawObj.backgroundOpacity === "number"
    ? rawObj.backgroundOpacity
    : 1;

  const bgImageUrl = typeof rawBg?.imageUrl === "string"
    ? rawBg.imageUrl
    : undefined;
  const bgImageOpacity = typeof rawBg?.imageOpacity === "number"
    ? rawBg.imageOpacity
    : 1;
  const bgOverlayColor = typeof rawBg?.overlayColor === "string"
    ? rawBg.overlayColor
    : undefined;
  const bgOverlayOpacity = typeof rawBg?.overlayOpacity === "number"
    ? rawBg.overlayOpacity
    : 0.5;

  const background: BackgroundConfig = {
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

  // Split background parsing
  const rawSplitBg =
    typeof rawObj.splitBackground === "object" && rawObj.splitBackground !== null
      ? (rawObj.splitBackground as Record<string, unknown>)
      : typeof rawObj.splitBackground === "string"
      ? { type: "solid", color: rawObj.splitBackground }
      : typeof rawObj.splitBackgroundColor === "string"
      ? { type: "solid", color: rawObj.splitBackgroundColor }
      : null;

  const splitBackground: BackgroundConfig | undefined = rawSplitBg
    ? {
      type: (rawSplitBg.type === "gradient" ||
          rawSplitBg.type === "glass" ||
          rawSplitBg.type === "image")
        ? (rawSplitBg.type as BackgroundType)
        : "solid",
      color: typeof rawSplitBg.color === "string"
        ? normalizeColor(rawSplitBg.color, DEFAULT_SPLIT_BACKGROUND.color)
        : DEFAULT_SPLIT_BACKGROUND.color,
      gradientStart: typeof rawSplitBg.gradientStart === "string"
        ? rawSplitBg.gradientStart
        : DEFAULT_SPLIT_BACKGROUND.gradientStart,
      gradientEnd: typeof rawSplitBg.gradientEnd === "string"
        ? rawSplitBg.gradientEnd
        : DEFAULT_SPLIT_BACKGROUND.gradientEnd,
      gradientMiddle: typeof rawSplitBg.gradientMiddle === "string"
        ? rawSplitBg.gradientMiddle
        : undefined,
      gradientDirection: (rawSplitBg.gradientDirection === "to-r" ||
          rawSplitBg.gradientDirection === "to-b" ||
          rawSplitBg.gradientDirection === "to-bl" ||
          rawSplitBg.gradientDirection === "radial")
        ? (rawSplitBg.gradientDirection as GradientDirection)
        : "to-br",
      opacity: typeof rawSplitBg.opacity === "number" ? rawSplitBg.opacity : 1,
      imageUrl: typeof rawSplitBg.imageUrl === "string"
        ? rawSplitBg.imageUrl
        : undefined,
      imageOpacity: typeof rawSplitBg.imageOpacity === "number"
        ? rawSplitBg.imageOpacity
        : 1,
      overlayColor: typeof rawSplitBg.overlayColor === "string"
        ? rawSplitBg.overlayColor
        : undefined,
      overlayOpacity: typeof rawSplitBg.overlayOpacity === "number"
        ? rawSplitBg.overlayOpacity
        : 0.5,
    }
    : undefined;

  // 2. Border parsing
  const borderColor = typeof rawBorder?.color === "string"
    ? normalizeColor(rawBorder.color, baseDefault.border.color)
    : typeof rawObj.borderColor === "string"
    ? normalizeColor(rawObj.borderColor, baseDefault.border.color)
    : baseDefault.border.color;

  const borderWidth = typeof rawBorder?.width === "number"
    ? rawBorder.width
    : typeof rawObj.borderWidth === "number"
    ? rawObj.borderWidth
    : baseDefault.border.width;

  const borderStyle: BorderStyle =
    rawBorder?.style === "dashed" || rawBorder?.style === "dotted" ||
      rawBorder?.style === "none"
      ? rawBorder.style
      : "solid";

  const borderRadius = typeof rawBorder?.radius === "number"
    ? rawBorder.radius
    : typeof rawObj.borderRadius === "number"
    ? rawObj.borderRadius
    : 16;

  const borderMargin = typeof rawBorder?.margin === "number"
    ? rawBorder.margin
    : typeof rawObj.borderMargin === "number"
    ? rawObj.borderMargin
    : 10;

  const shadow: ShadowEffect = rawBorder?.shadow === "none" ||
      rawBorder?.shadow === "subtle" ||
      rawBorder?.shadow === "strong" ||
      rawBorder?.shadow === "glow"
    ? rawBorder.shadow
    : baseDefault.border.shadow;

  const glowColor = typeof rawBorder?.glowColor === "string"
    ? rawBorder.glowColor
    : borderColor || "#06b6d4";

  const border: BorderConfig = {
    color: borderColor,
    width: borderWidth,
    style: borderStyle,
    radius: borderRadius,
    margin: borderMargin,
    shadow,
    glowColor,
  };

  // 3. Title typography parsing
  const titleColor = typeof rawTitleFont?.color === "string"
    ? normalizeColor(rawTitleFont.color, baseDefault.titleFont.color)
    : typeof rawObj.titleColor === "string"
    ? normalizeColor(rawObj.titleColor, baseDefault.titleFont.color)
    : baseDefault.titleFont.color;

  const titleFontFamily = typeof rawTitleFont?.fontFamily === "string"
    ? parseFontFamily(
      rawTitleFont.fontFamily,
      baseDefault.titleFont.fontFamily,
    )
    : baseDefault.titleFont.fontFamily;

  const titleFontWeight: TitleFontWeight = rawTitleFont?.fontWeight === "400" ||
      rawTitleFont?.fontWeight === "500" ||
      rawTitleFont?.fontWeight === "600" ||
      rawTitleFont?.fontWeight === "700" ||
      rawTitleFont?.fontWeight === "900"
    ? rawTitleFont.fontWeight
    : baseDefault.titleFont.fontWeight;

  const titleFontSize = typeof rawTitleFont?.fontSize === "number"
    ? rawTitleFont.fontSize
    : baseDefault.titleFont.fontSize;

  const titleLetterSpacing = typeof rawTitleFont?.letterSpacing === "number"
    ? rawTitleFont.letterSpacing
    : 0;

  const titleUppercase = Boolean(rawTitleFont?.uppercase);

  const titleFont: TitleFontConfig = {
    color: titleColor,
    fontFamily: titleFontFamily,
    fontWeight: titleFontWeight,
    fontSize: titleFontSize,
    letterSpacing: titleLetterSpacing,
    uppercase: titleUppercase,
  };

  // 4. Description typography parsing
  const descColor = typeof rawDescFont?.color === "string"
    ? normalizeColor(
      rawDescFont.color,
      "descriptionFont" in baseDefault
        ? baseDefault.descriptionFont.color
        : "#94a3b8",
    )
    : "descriptionFont" in baseDefault
    ? baseDefault.descriptionFont.color
    : "#94a3b8";

  const descFontFamily = typeof rawDescFont?.fontFamily === "string"
    ? parseFontFamily(
      rawDescFont.fontFamily,
      "descriptionFont" in baseDefault
        ? baseDefault.descriptionFont.fontFamily
        : baseDefault.titleFont.fontFamily,
    )
    : "descriptionFont" in baseDefault
    ? baseDefault.descriptionFont.fontFamily
    : baseDefault.titleFont.fontFamily;

  const descFontWeight: DescriptionFontWeight =
    rawDescFont?.fontWeight === "300" ||
      rawDescFont?.fontWeight === "400" ||
      rawDescFont?.fontWeight === "600" ||
      rawDescFont?.fontWeight === "700"
      ? rawDescFont.fontWeight
      : "500";

  const descFontSize = typeof rawDescFont?.fontSize === "number"
    ? rawDescFont.fontSize
    : "descriptionFont" in baseDefault
    ? baseDefault.descriptionFont.fontSize
    : 22;

  const descLineHeight = typeof rawDescFont?.lineHeight === "number"
    ? rawDescFont.lineHeight
    : 1.3;

  const descOpacity = typeof rawDescFont?.opacity === "number"
    ? rawDescFont.opacity
    : 1;

  const descriptionFont: DescriptionFontConfig = {
    color: descColor,
    fontFamily: descFontFamily,
    fontWeight: descFontWeight,
    fontSize: descFontSize,
    lineHeight: descLineHeight,
    opacity: descOpacity,
  };

  // 5. Image parsing
  const imgUrl = typeof rawImage?.url === "string"
    ? rawImage.url
    : baseDefault.image.url;

  const imgShape: ImageShape =
    rawImage?.shape === "original" || rawImage?.shape === "circle"
      ? rawImage.shape
      : "rounded";

  const imgSize = typeof rawImage?.size === "number"
    ? rawImage.size
    : baseDefault.image.size;

  const imgShow = rawImage?.show !== undefined
    ? Boolean(rawImage.show)
    : Boolean(imgUrl && imgUrl.trim());

  const rawImgVAlign = String(rawImage?.verticalAlign || "").toLowerCase();
  const imgVerticalAlign: VerticalAlign = rawImgVAlign === "top"
    ? "top"
    : rawImgVAlign === "bottom"
    ? "bottom"
    : "middle";

  const rawImgVOffset = typeof rawImage?.verticalOffset === "number"
    ? rawImage.verticalOffset
    : 0;

  const rawImgHOffset = typeof rawImage?.horizontalOffset === "number"
    ? rawImage.horizontalOffset
    : 0;

  const image: ImageConfig = {
    url: imgUrl,
    shape: imgShape,
    size: imgSize,
    show: imgShow,
    verticalAlign: imgVerticalAlign,
    verticalOffset: rawImgVOffset,
    horizontalOffset: rawImgHOffset,
  };

  const title = typeof rawObj.title === "string"
    ? rawObj.title
    : baseDefault.title;
  const description = typeof rawObj.description === "string"
    ? rawObj.description
    : "description" in baseDefault
    ? baseDefault.description
    : "";

  const rawVAlign = String(rawObj.verticalAlign || "").toLowerCase();
  const verticalAlign: VerticalAlign = rawVAlign === "top"
    ? "top"
    : rawVAlign === "bottom"
    ? "bottom"
    : "middle";

  const verticalOffset = typeof rawObj.verticalOffset === "number"
    ? rawObj.verticalOffset
    : 0;

  const horizontalOffset = typeof rawObj.horizontalOffset === "number"
    ? rawObj.horizontalOffset
    : 0;

  if (format === "widecard") {
    const imgPos = rawObj.imagePosition === "right" ? "right" : "left";
    const validWideVariants = ["standard", "split", "centered", "minimal", "badge"];
    const wideVariant: WideVariant = validWideVariants.includes(String(rawObj.wideVariant))
      ? (rawObj.wideVariant as WideVariant)
      : "standard";

    const textAlign: TextAlign = rawObj.textAlign === "left" ? "left" : "center";
    const wide: WideCardOptions = {
      generateType: "widecard",
      wideVariant,
      title,
      description,
      textAlign,
      verticalAlign,
      verticalOffset,
      horizontalOffset,
      imagePosition: imgPos,
      background,
      splitBackground,
      border,
      titleFont,
      descriptionFont,
      image,
    };
    return wide;
  }

  if (format === "widescreen") {
    const validWsLayouts = ["split", "centered", "banner", "hero", "minimal"];
    const layoutStyle: WidescreenLayout = validWsLayouts.includes(
      String(rawObj.layoutStyle),
    )
      ? (rawObj.layoutStyle as WidescreenLayout)
      : "split";

    const textAlign: TextAlign = rawObj.textAlign === "left" ? "left" : "center";
    const ws: WidescreenCardOptions = {
      generateType: "widescreen",
      layoutStyle,
      title,
      description,
      textAlign,
      verticalAlign,
      verticalOffset,
      horizontalOffset,
      background,
      splitBackground,
      border,
      titleFont,
      descriptionFont,
      image,
    };
    return ws;
  }

  if (format === "badge") {
    const badgeW = parseFloat(String(rawObj.badgeWidth || "400")) || 400;
    const badgeH = parseFloat(String(rawObj.badgeHeight || "120")) || 120;
    const iconPos =
      rawObj.iconPosition === "right" || rawObj.iconPosition === "none"
        ? rawObj.iconPosition
        : "left";
    const validVariants = ["standard", "pill", "split", "status", "outline"];
    const badgeVariant = validVariants.includes(String(rawObj.badgeVariant))
      ? (rawObj.badgeVariant as BadgeCardOptions["badgeVariant"])
      : "standard";

    const splitPos = parseFloat(String(rawObj.splitPosition || "0")) || 0;
    const statusStyle = rawObj.statusStyle === "dot" ? "dot" : "pill";
    const statusPos = rawObj.statusPosition === "left" ? "left" : "right";

    const badgeAutoSize = Boolean(rawObj.badgeAutoSize);

    const badge: BadgeCardOptions = {
      generateType: "badge",
      badgeVariant,
      title,
      badgeWidth: badgeW,
      badgeHeight: badgeH,
      badgeAutoSize,
      iconPosition: iconPos,
      badgeLabel: typeof rawObj.badgeLabel === "string" ? rawObj.badgeLabel : "BUILD",
      labelColor: typeof rawObj.labelColor === "string" ? rawObj.labelColor : "#94a3b8",
      splitPosition: splitPos,
      statusText: typeof rawObj.statusText === "string" ? rawObj.statusText : "OPERATIONAL",
      statusColor: typeof rawObj.statusColor === "string" ? rawObj.statusColor : "#10b981",
      statusStyle,
      statusPosition: statusPos,
      background,
      splitBackground,
      border,
      titleFont,
      image,
      verticalAlign,
      verticalOffset,
      horizontalOffset,
    };
    return badge;
  }

  // Standard Card (default)
  const textAlign: TextAlign = rawObj.textAlign === "left" ? "left" : "center";
  const validCardVariants = ["standard", "hero", "compact", "minimal", "split"];
  const cardVariant: CardVariant = validCardVariants.includes(String(rawObj.cardVariant))
    ? (rawObj.cardVariant as CardVariant)
    : "standard";

  const standard: StandardCardOptions = {
    generateType: "card",
    cardVariant,
    title,
    description,
    textAlign,
    verticalAlign,
    verticalOffset,
    horizontalOffset,
    background,
    splitBackground,
    border,
    titleFont,
    descriptionFont,
    image,
  };
  return standard;
}
