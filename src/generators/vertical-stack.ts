export interface VerticalStackConfig {
  cardH: number;
  margin: number;
  topPad?: number;
  bottomPad?: number;
  minGap?: number;
  hasImage: boolean;
  imgSize: number;
  imgVAlign?: "top" | "middle" | "bottom";
  textH: number;
  titleFontSize: number;
  vAlign?: "top" | "middle" | "bottom";
}

export interface VerticalStackResult {
  imgY: number;
  titleY: number;
}

/**
 * Computes non-overlapping, decoupled vertical positions for Logo and Text in vertical-stack layouts.
 * Guarantees a minimum gap between elements and centers elements appropriately in remaining space.
 */
export function computeVerticalStackPositions(
  config: VerticalStackConfig,
): VerticalStackResult {
  const {
    cardH,
    margin,
    topPad = 24,
    bottomPad = 24,
    minGap = 24,
    hasImage,
    imgSize,
    imgVAlign = "middle",
    textH,
    titleFontSize,
    vAlign = "middle",
  } = config;

  const topLimit = margin + topPad;
  const bottomLimit = cardH - margin - bottomPad;
  const availH = Math.max(0, bottomLimit - topLimit);

  if (!hasImage) {
    let textTop: number;
    if (vAlign === "top") {
      textTop = topLimit;
    } else if (vAlign === "bottom") {
      textTop = bottomLimit - textH;
    } else {
      textTop = topLimit + (availH - textH) / 2;
    }
    return {
      imgY: topLimit,
      titleY: textTop + titleFontSize * 0.85,
    };
  }

  const logoH = imgSize;
  const totalH = logoH + minGap + textH;

  let imgY: number;
  let textTop: number;

  if (imgVAlign === "top" && vAlign === "top") {
    imgY = topLimit;
    textTop = imgY + logoH + minGap;
  } else if (imgVAlign === "middle" && vAlign === "middle") {
    const startGroupY = topLimit + Math.max(0, (availH - totalH) / 2);
    imgY = startGroupY;
    textTop = imgY + logoH + minGap;
  } else if (imgVAlign === "bottom" && vAlign === "bottom") {
    const startGroupY = Math.max(topLimit, bottomLimit - totalH);
    imgY = startGroupY;
    textTop = imgY + logoH + minGap;
  } else if (imgVAlign === "top" && vAlign === "middle") {
    imgY = topLimit;
    const logoBottom = imgY + logoH;
    const remainingH = bottomLimit - logoBottom;
    const idealTextTop = logoBottom + (remainingH - textH) / 2;
    textTop = Math.max(
      logoBottom + minGap,
      Math.min(idealTextTop, bottomLimit - textH),
    );
  } else if (imgVAlign === "top" && vAlign === "bottom") {
    imgY = topLimit;
    const logoBottom = imgY + logoH;
    const idealTextTop = bottomLimit - textH;
    textTop = Math.max(logoBottom + minGap, idealTextTop);
  } else if (imgVAlign === "middle" && vAlign === "bottom") {
    textTop = Math.max(topLimit + logoH + minGap, bottomLimit - textH);
    const remainingH = textTop - topLimit;
    const idealImgY = topLimit + (remainingH - logoH) / 2;
    imgY = Math.max(topLimit, Math.min(idealImgY, textTop - minGap - logoH));
  } else if (imgVAlign === "middle" && vAlign === "top") {
    textTop = topLimit;
    const textBottom = textTop + textH;
    const remainingH = bottomLimit - textBottom;
    const idealImgY = textBottom + (remainingH - logoH) / 2;
    imgY = Math.max(
      textBottom + minGap,
      Math.min(idealImgY, bottomLimit - logoH),
    );
  } else if (imgVAlign === "bottom" && vAlign === "top") {
    textTop = topLimit;
    const textBottom = textTop + textH;
    const idealImgY = bottomLimit - logoH;
    imgY = Math.max(textBottom + minGap, idealImgY);
  } else if (imgVAlign === "bottom" && vAlign === "middle") {
    imgY = Math.max(topLimit + textH + minGap, bottomLimit - logoH);
    const remainingH = imgY - topLimit;
    const idealTextTop = topLimit + (remainingH - textH) / 2;
    textTop = Math.max(topLimit, Math.min(idealTextTop, imgY - minGap - textH));
  } else {
    // Default fallback: center grouped
    const startGroupY = topLimit + Math.max(0, (availH - totalH) / 2);
    imgY = startGroupY;
    textTop = imgY + logoH + minGap;
  }

  return {
    imgY,
    titleY: textTop + titleFontSize * 0.85,
  };
}
