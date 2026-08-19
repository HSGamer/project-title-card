import {
  BackgroundType,
  BadgeCardOptions,
  BorderStyle,
  CardOptions,
  DescriptionFontWeight,
  GenerateType,
  GradientDirection,
  ImageShape,
  ShadowEffect,
  StandardCardOptions,
  TextAlign,
  TitleFontWeight,
  WideCardOptions,
  WidescreenCardOptions,
  WidescreenLayout,
} from "../types.ts";
import {
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

export function parseCssStyle(
  styleStr: string | undefined,
): Record<string, string> {
  const result: Record<string, string> = {};
  if (!styleStr || typeof styleStr !== "string") return result;

  const declarations = styleStr.split(";");
  for (const decl of declarations) {
    const colonIdx = decl.indexOf(":");
    if (colonIdx === -1) continue;
    const key = decl.slice(0, colonIdx).trim().toLowerCase();
    const value = decl.slice(colonIdx + 1).trim();
    if (key && value) {
      result[key] = value;
    }
  }
  return result;
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
  if (
    lower.includes("monospace") || lower.includes("mono") ||
    lower.includes("courier") || lower.includes("consolas")
  ) {
    return '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace';
  }
  if (
    lower.includes("serif") || lower.includes("georgia") ||
    lower.includes("times")
  ) {
    return 'Georgia, "Times New Roman", Times, serif';
  }
  if (lower.includes("verdana") || lower.includes("geneva")) {
    return "Verdana, Geneva, Tahoma, sans-serif";
  }
  if (lower.includes("montserrat")) {
    return 'Montserrat, "Helvetica Neue", Arial, sans-serif';
  }
  if (lower.includes("poppins") || lower.includes("quicksand")) {
    return 'Poppins, Quicksand, "Nunito", sans-serif';
  }
  if (
    lower.includes("arial") || lower.includes("helvetica") ||
    lower.includes("sans-serif") || lower.includes("system-ui") ||
    lower.includes("inter")
  ) {
    return 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  }
  return clean;
}

export function extractGradientStops(
  defsStr: string,
): { start?: string; middle?: string; end?: string; isRadial: boolean } {
  const result: {
    start?: string;
    middle?: string;
    end?: string;
    isRadial: boolean;
  } = {
    isRadial: defsStr.includes("<radialGradient"),
  };
  const stopColors: string[] = [];
  const stopMatches = defsStr.matchAll(/stop-color=["']([^"']+)["']/g);
  for (const m of stopMatches) {
    if (m[1]) stopColors.push(m[1]);
  }
  if (stopColors.length === 1) {
    result.start = normalizeColor(stopColors[0], "#ea580c");
    result.end = normalizeColor(stopColors[0], "#7c3aed");
  } else if (stopColors.length === 2) {
    result.start = normalizeColor(stopColors[0], "#ea580c");
    result.end = normalizeColor(stopColors[1], "#7c3aed");
  } else if (stopColors.length >= 3) {
    result.start = normalizeColor(stopColors[0], "#ea580c");
    result.middle = normalizeColor(stopColors[1], "#db2777");
    result.end = normalizeColor(stopColors[stopColors.length - 1], "#7c3aed");
  }
  return result;
}

export function normalizeCardOptions(raw: unknown): CardOptions {
  if (!raw || typeof raw !== "object") {
    return defaultStandardOptions;
  }

  const rawObj = raw as Record<string, unknown>;
  const rawBg =
    typeof rawObj.background === "object" && rawObj.background !== null
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

  // Parse legacy CSS styles if present
  const legacyBgCss = parseCssStyle(
    typeof rawObj.backgroundStyle === "string"
      ? rawObj.backgroundStyle
      : undefined,
  );
  const legacyTitleCss = parseCssStyle(
    typeof rawObj.titleStyle === "string" ? rawObj.titleStyle : undefined,
  );
  const legacyDescCss = parseCssStyle(
    typeof rawObj.descriptionStyle === "string"
      ? rawObj.descriptionStyle
      : undefined,
  );
  const legacyDefs = typeof rawObj.defs === "string" ? rawObj.defs : "";

  // Determine format (support legacy & alias)
  let format: GenerateType = "card";
  if (
    rawObj.generateType === "widecard" ||
    rawObj.generateType === "readme-banner"
  ) {
    format = "widecard";
  } else if (
    rawObj.generateType === "widescreen" ||
    rawObj.generateType === "social-preview"
  ) {
    format = "widescreen";
  } else if (
    rawObj.generateType === "badge" || rawObj.generateType === "compact-badge"
  ) {
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
  const isGradientFromLegacy = Boolean(
    legacyBgCss.fill?.startsWith("url(") ||
      legacyDefs.includes("<linearGradient") ||
      legacyDefs.includes("<radialGradient"),
  );

  const bgType: BackgroundType =
    rawBg?.type === "solid" || rawBg?.type === "gradient" ||
      rawBg?.type === "glass" || rawBg?.type === "image"
      ? (rawBg.type as BackgroundType)
      : isGradientFromLegacy
      ? "gradient"
      : "solid";

  const extractedStops: {
    start?: string;
    middle?: string;
    end?: string;
    isRadial?: boolean;
  } = isGradientFromLegacy ? extractGradientStops(legacyDefs) : {};

  const bgColor = typeof rawBg?.color === "string"
    ? rawBg.color
    : legacyBgCss.fill && !legacyBgCss.fill.startsWith("url(")
    ? normalizeColor(legacyBgCss.fill, baseDefault.background.color)
    : baseDefault.background.color;

  const gradStart = typeof rawBg?.gradientStart === "string"
    ? rawBg.gradientStart
    : extractedStops.start || "#ea580c";

  const gradEnd = typeof rawBg?.gradientEnd === "string"
    ? rawBg.gradientEnd
    : extractedStops.end || "#7c3aed";

  const gradMiddle = typeof rawBg?.gradientMiddle === "string"
    ? rawBg.gradientMiddle
    : extractedStops.middle;

  const gradDir: GradientDirection = rawBg?.gradientDirection === "to-r" ||
      rawBg?.gradientDirection === "to-b" ||
      rawBg?.gradientDirection === "to-bl" ||
      rawBg?.gradientDirection === "radial"
    ? rawBg.gradientDirection
    : extractedStops.isRadial
    ? "radial"
    : "to-br";

  const bgOpacity = typeof rawBg?.opacity === "number"
    ? rawBg.opacity
    : legacyBgCss["fill-opacity"] !== undefined
    ? parseFloat(legacyBgCss["fill-opacity"]) || 1
    : legacyBgCss.opacity !== undefined
    ? parseFloat(legacyBgCss.opacity) || 1
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

  // 2. Border parsing
  const borderColor = typeof rawBorder?.color === "string"
    ? rawBorder.color
    : legacyBgCss.stroke
    ? normalizeColor(legacyBgCss.stroke, baseDefault.border.color)
    : baseDefault.border.color;

  const borderWidth = typeof rawBorder?.width === "number"
    ? rawBorder.width
    : legacyBgCss["stroke-width"] !== undefined
    ? parseFloat(legacyBgCss["stroke-width"]) || 0
    : baseDefault.border.width;

  const borderStyle: BorderStyle =
    rawBorder?.style === "dashed" || rawBorder?.style === "dotted" ||
      rawBorder?.style === "none"
      ? rawBorder.style
      : legacyBgCss["stroke-dasharray"]?.includes("3")
      ? "dotted"
      : legacyBgCss["stroke-dasharray"]
      ? "dashed"
      : legacyBgCss.stroke === "none" || borderWidth === 0
      ? "none"
      : "solid";

  const borderRadius = typeof rawBorder?.radius === "number"
    ? rawBorder.radius
    : parseFloat(String(rawObj.borderRadius || "16")) || 16;

  const borderMargin = typeof rawBorder?.margin === "number"
    ? rawBorder.margin
    : parseFloat(String(rawObj.borderMargin || "10")) || 10;

  const shadow: ShadowEffect = rawBorder?.shadow === "none" ||
      rawBorder?.shadow === "subtle" ||
      rawBorder?.shadow === "strong" ||
      rawBorder?.shadow === "glow"
    ? rawBorder.shadow
    : legacyDefs.includes('<filter id="glow"') ||
        legacyDefs.includes("feGaussianBlur")
    ? "glow"
    : baseDefault.border.shadow;

  const glowColor = typeof rawBorder?.glowColor === "string"
    ? rawBorder.glowColor
    : borderColor || "#06b6d4";

  // 3. Title typography parsing
  const titleColor = typeof rawTitleFont?.color === "string"
    ? rawTitleFont.color
    : legacyTitleCss.fill
    ? normalizeColor(legacyTitleCss.fill, baseDefault.titleFont.color)
    : baseDefault.titleFont.color;

  const titleFontFamily = typeof rawTitleFont?.fontFamily === "string"
    ? rawTitleFont.fontFamily
    : legacyTitleCss["font-family"]
    ? parseFontFamily(
      legacyTitleCss["font-family"],
      baseDefault.titleFont.fontFamily,
    )
    : baseDefault.titleFont.fontFamily;

  const titleFontWeight: TitleFontWeight = rawTitleFont?.fontWeight === "400" ||
      rawTitleFont?.fontWeight === "500" ||
      rawTitleFont?.fontWeight === "600" ||
      rawTitleFont?.fontWeight === "700" ||
      rawTitleFont?.fontWeight === "900"
    ? rawTitleFont.fontWeight
    : legacyTitleCss["font-weight"]
    ? parseFontWeight(
      legacyTitleCss["font-weight"],
      baseDefault.titleFont.fontWeight,
    )
    : baseDefault.titleFont.fontWeight;

  const titleFontSize = typeof rawTitleFont?.fontSize === "number"
    ? rawTitleFont.fontSize
    : legacyTitleCss["font-size"]
    ? parseFloat(legacyTitleCss["font-size"]) || baseDefault.titleFont.fontSize
    : baseDefault.titleFont.fontSize;

  const titleLetterSpacing = typeof rawTitleFont?.letterSpacing === "number"
    ? rawTitleFont.letterSpacing
    : legacyTitleCss["letter-spacing"]
    ? parseFloat(legacyTitleCss["letter-spacing"]) || 0
    : 0;

  const titleUppercase = Boolean(
    rawTitleFont?.uppercase ??
      legacyTitleCss["text-transform"]?.toLowerCase() === "uppercase",
  );

  // 4. Description typography parsing
  const descColor = typeof rawDescFont?.color === "string"
    ? rawDescFont.color
    : legacyDescCss.fill
    ? normalizeColor(
      legacyDescCss.fill,
      "descriptionFont" in baseDefault
        ? baseDefault.descriptionFont.color
        : "#94a3b8",
    )
    : "descriptionFont" in baseDefault
    ? baseDefault.descriptionFont.color
    : "#94a3b8";

  const descFontFamily = typeof rawDescFont?.fontFamily === "string"
    ? rawDescFont.fontFamily
    : legacyDescCss["font-family"]
    ? parseFontFamily(
      legacyDescCss["font-family"],
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
      : legacyDescCss["font-weight"]
      ? (parseFontWeight(
        legacyDescCss["font-weight"],
        "500",
      ) as DescriptionFontWeight)
      : "500";

  const descFontSize = typeof rawDescFont?.fontSize === "number"
    ? rawDescFont.fontSize
    : legacyDescCss["font-size"]
    ? parseFloat(legacyDescCss["font-size"]) || 22
    : "descriptionFont" in baseDefault
    ? baseDefault.descriptionFont.fontSize
    : 22;

  const descLineHeight = typeof rawDescFont?.lineHeight === "number"
    ? rawDescFont.lineHeight
    : 1.3;

  const descOpacity = typeof rawDescFont?.opacity === "number"
    ? rawDescFont.opacity
    : legacyDescCss["fill-opacity"] !== undefined
    ? parseFloat(legacyDescCss["fill-opacity"]) || 1
    : 1;

  // 5. Image parsing
  const imgUrl = typeof rawImage?.url === "string"
    ? rawImage.url
    : typeof rawObj.imageLink === "string"
    ? rawObj.imageLink
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

  const title = typeof rawObj.title === "string"
    ? rawObj.title
    : baseDefault.title;
  const description = typeof rawObj.description === "string"
    ? rawObj.description
    : "description" in baseDefault
    ? baseDefault.description
    : "";

  const background = {
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

  const border = {
    color: borderColor,
    width: borderWidth,
    style: borderStyle,
    radius: borderRadius,
    margin: borderMargin,
    shadow,
    glowColor,
  };

  const titleFont = {
    color: titleColor,
    fontFamily: titleFontFamily,
    fontWeight: titleFontWeight,
    fontSize: titleFontSize,
    letterSpacing: titleLetterSpacing,
    uppercase: titleUppercase,
  };

  const image = {
    url: imgUrl,
    shape: imgShape,
    size: imgSize,
    show: imgShow,
  };

  const descriptionFont = {
    color: descColor,
    fontFamily: descFontFamily,
    fontWeight: descFontWeight,
    fontSize: descFontSize,
    lineHeight: descLineHeight,
    opacity: descOpacity,
  };

  if (format === "widecard") {
    const imgPos =
      rawObj.imagePosition === "right" || rawObj.logoPlacement === "right"
        ? "right"
        : "left";

    const wide: WideCardOptions = {
      generateType: "widecard",
      title,
      description,
      imagePosition: imgPos,
      background,
      border,
      titleFont,
      descriptionFont,
      image,
    };
    return wide;
  }

  if (format === "widescreen") {
    const wsLayout: WidescreenLayout =
      rawObj.layoutStyle === "centered" || rawObj.layoutStyle === "banner"
        ? rawObj.layoutStyle
        : "split";

    const ws: WidescreenCardOptions = {
      generateType: "widescreen",
      title,
      description,
      layoutStyle: wsLayout,
      background,
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

    const badge: BadgeCardOptions = {
      generateType: "badge",
      title,
      badgeWidth: badgeW,
      badgeHeight: badgeH,
      iconPosition: iconPos,
      background,
      border,
      titleFont,
      image,
    };
    return badge;
  }

  // Standard Card (default)
  const textAlign: TextAlign = rawObj.textAlign === "left" ? "left" : "center";
  const standard: StandardCardOptions = {
    generateType: "card",
    title,
    description,
    textAlign,
    background,
    border,
    titleFont,
    descriptionFont,
    image,
  };
  return standard;
}
