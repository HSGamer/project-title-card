import { BadgeCardOptions, CardOptions } from "../types.ts";

export interface CardDimensions {
  width: number;
  height: number;
}

export function calculateAutoBadgeDimensions(options: BadgeCardOptions): CardDimensions {
  const variant = options.badgeVariant || "standard";
  const margin = options.border?.margin ?? 8;
  const hasImage = Boolean(
    options.image?.show && options.image?.url && options.iconPosition !== "none",
  );
  const titleFontSize = options.titleFont?.fontSize || 28;
  const imgSize = Math.max(
    14,
    Math.min(options.image?.size || 50, 100),
  );

  // Dynamic Height calculation based on content
  const baseContentHeight = hasImage ? Math.max(imgSize, titleFontSize) : titleFontSize;
  const autoHeight = Math.max(50, Math.min(300, Math.round(baseContentHeight * 2.1 + margin * 2)));

  // Dynamic Width calculation based on text length, icon, and variant
  const title = (options.title || "TITLE").trim();
  const titleCharW = options.titleFont?.uppercase ? titleFontSize * 0.68 : titleFontSize * 0.62;
  const titleWidth = Math.round(title.length * titleCharW);
  const imgSpacing = hasImage ? imgSize + 14 : 0;

  let autoWidth = 200;

  if (variant === "split") {
    const labelText = (options.badgeLabel || "BUILD").trim();
    const labelFontSize = Math.min(titleFontSize * 0.88, Math.round(autoHeight * 0.34));
    const labelCharW = labelFontSize * 0.64;
    const leftWidth = Math.round(labelText.length * labelCharW) + (hasImage && options.iconPosition === "left" ? imgSize + 14 : 0) + 32;
    const rightWidth = titleWidth + (hasImage && options.iconPosition === "right" ? imgSize + 14 : 0) + 32;
    autoWidth = Math.round(leftWidth + rightWidth + margin * 2);
  } else if (variant === "status") {
    const statusText = (options.statusText || "OPERATIONAL").trim();
    const statusStyle = options.statusStyle || "pill";
    const statusChipWidth = statusStyle === "pill"
      ? Math.round(statusText.length * 8.5) + 38
      : Math.round(statusText.length * 9) + 26;
    autoWidth = Math.round(imgSpacing + titleWidth + 24 + statusChipWidth + 36 + margin * 2);
  } else {
    // standard, pill, outline
    autoWidth = Math.round(imgSpacing + titleWidth + 44 + margin * 2);
  }

  return {
    width: Math.max(120, Math.min(2400, autoWidth)),
    height: autoHeight,
  };
}

export function getCardDimensions(options: CardOptions): CardDimensions {
  switch (options.generateType) {
    case "widecard":
      return { width: 800, height: 300 };
    case "widescreen":
      return { width: 720, height: 405 };
    case "badge": {
      const badgeOpts = options as BadgeCardOptions;
      if (badgeOpts.badgeAutoSize) {
        return calculateAutoBadgeDimensions(badgeOpts);
      }
      const width = Math.max(100, Math.min(2000, badgeOpts.badgeWidth || 400));
      const height = Math.max(40, Math.min(1000, badgeOpts.badgeHeight || 120));
      return { width, height };
    }
    case "card":
    default:
      return { width: 400, height: 600 };
  }
}

export function getCardDimensionsLabel(options: CardOptions): string {
  const { width, height } = getCardDimensions(options);
  if (options.generateType === "badge" && (options as BadgeCardOptions).badgeAutoSize) {
    return `${width} × ${height} px (Auto Fit)`;
  }
  return `${width} × ${height} px`;
}
