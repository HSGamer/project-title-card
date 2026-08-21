import { StandardCardOptions } from "../../types.ts";
import { getCardDimensions } from "../../utils/dimensions.ts";
import { createBaseSvg, renderPanelBackground } from "../svg-base.ts";
import {
  renderImage,
  renderMultilineDescription,
  renderTitle,
} from "../elements.ts";
import { computeVerticalStackPositions } from "../vertical-stack.ts";

export function generateCard(options: StandardCardOptions): SVGSVGElement {
  const { width, height } = getCardDimensions(options);
  const variant = options.cardVariant || "standard";
  const margin = options.border.margin ?? 10;
  const innerW = width - 2 * margin;
  const innerH = height - 2 * margin;
  const isLeft = options.textAlign === "left";
  const { draw, radius } = createBaseSvg(width, height, options, `Card (${variant})`);

  const hasImage = Boolean(options.image.show && options.image.url);
  const titleFontSize = Math.min(options.titleFont.fontSize || 34, 40);
  const descFontSize = Math.min(options.descriptionFont.fontSize || 20, 24);
  const lineHeight = options.descriptionFont.lineHeight || 1.3;
  const vAlign = options.verticalAlign || "middle";
  const imgVAlign = options.image.verticalAlign || "middle";
  const textOffsetY = options.verticalOffset || 0;
  const textOffsetX = options.horizontalOffset || 0;
  const imgOffsetY = options.image.verticalOffset || 0;
  const imgOffsetX = options.image.horizontalOffset || 0;

  const descLines = options.description
    ? options.description.split("\n").filter((l) => l.trim().length > 0)
    : [];
  const numLines = descLines.length;
  const descH = numLines > 0
    ? (numLines - 1) * (descFontSize * lineHeight) + descFontSize
    : 0;

  const computeStartY = (totalH: number, topPad = 24, bottomPad = 24) => {
    if (vAlign === "top") {
      return margin + topPad;
    }
    if (vAlign === "bottom") {
      return height - margin - bottomPad - totalH;
    }
    return margin + Math.max(16, (innerH - totalH) / 2);
  };

  // --------------------------------------------------------------------------
  // Variant 1: HERO (Dedicated floating hero stage plate with spotlight framing)
  // --------------------------------------------------------------------------
  if (variant === "hero") {
    const heroImgSize = Math.min(options.image.size || 200, innerW - 40, innerH - 40);
    const stagePad = 18;
    const stageW = innerW - 24;
    const stageH = hasImage ? heroImgSize + stagePad * 2 : 70;
    const stageX = (width - stageW) / 2;

    const gapStageTitle = 24;
    const gapTitleDesc = numLines > 0 ? 16 : 0;
    const textH = titleFontSize + gapTitleDesc + descH;

    const pos = computeVerticalStackPositions({
      cardH: height,
      margin,
      topPad: 20,
      bottomPad: 20,
      minGap: gapStageTitle,
      hasImage,
      imgSize: stageH,
      imgVAlign,
      textH,
      titleFontSize,
      vAlign,
    });

    const stageY = pos.imgY;
    const titleY = pos.titleY;

    // Floating Hero Stage Pedestal Plate
    draw
      .rect(stageW, stageH)
      .move(stageX + imgOffsetX, stageY + imgOffsetY)
      .radius(Math.max(10, radius - 4))
      .attr({
        fill: "#ffffff",
        "fill-opacity": 0.04,
        stroke: options.border.color || "#334155",
        "stroke-width": 1.5,
        "stroke-opacity": 0.4,
      });

    // Subtle center glow spotlight behind the hero asset
    if (hasImage) {
      draw
        .circle(heroImgSize * 1.1)
        .center(width / 2 + imgOffsetX, stageY + stageH / 2 + imgOffsetY)
        .attr({
          fill: options.border.color || "#3b82f6",
          "fill-opacity": 0.08,
        });

      const imgX = (width - heroImgSize) / 2 + imgOffsetX;
      const imgY = stageY + stagePad + imgOffsetY;
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        heroImgSize,
        heroImgSize,
        "cardHeroLogo",
      );
    }

    const textX = (isLeft ? margin + 25 : width / 2) + textOffsetX;
    const textAnchor = isLeft ? "start" : "middle";

    renderTitle(
      draw,
      options.title,
      textX,
      titleY + textOffsetY,
      { ...options.titleFont, fontSize: titleFontSize },
      textAnchor,
    );

    if (numLines > 0) {
      const descY = titleY + textOffsetY + titleFontSize + 14;
      renderMultilineDescription(
        draw,
        options.description,
        textX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        textAnchor,
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 2: COMPACT (Header row with logo & title, divider, full-width desc)
  // --------------------------------------------------------------------------
  if (variant === "compact") {
    const headerImgSize = Math.min(options.image.size || 80, innerW - 60, innerH - 60);
    const compactTitleSize = Math.min(titleFontSize, 28);
    const headerH = hasImage ? Math.max(headerImgSize, compactTitleSize) : compactTitleSize;
    const dividerGap = 18;
    const descGap = numLines > 0 ? 24 : 0;
    const totalH = headerH + dividerGap + descGap + descH;

    const startY = computeStartY(totalH, 24, 24);
    const headerY = startY + textOffsetY;
    let headerTextX = margin + 20 + textOffsetX;

    if (hasImage) {
      const imgY = headerY + (headerH - headerImgSize) / 2 + imgOffsetY;
      renderImage(
        draw,
        options.image,
        { x: margin + 20 + imgOffsetX, y: imgY },
        headerImgSize,
        headerImgSize,
        "cardCompactLogo",
      );
      headerTextX = margin + 20 + headerImgSize + 16 + textOffsetX;
    }

    const headerTitleY = hasImage
      ? headerY + headerH / 2
      : headerY + compactTitleSize * 0.8;

    renderTitle(
      draw,
      options.title,
      headerTextX,
      headerTitleY,
      { ...options.titleFont, fontSize: compactTitleSize },
      "start",
      hasImage ? "central" : undefined,
    );

    // Inset divider line
    const dividerY = headerY + headerH + dividerGap;
    draw
      .line(margin + 18, dividerY, width - margin - 18, dividerY)
      .stroke({
        color: options.border.color || "#334155",
        width: 1.5,
        opacity: 0.4,
      });

    if (numLines > 0) {
      const descY = dividerY + descGap;
      const descX = (isLeft ? margin + 20 : width / 2) + textOffsetX;
      const descAnchor = isLeft ? "start" : "middle";
      renderMultilineDescription(
        draw,
        options.description,
        descX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        descAnchor,
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 3: MINIMAL (Top accent indicator stripe, vertically balanced content)
  // --------------------------------------------------------------------------
  if (variant === "minimal") {
    const accentWidth = Math.min(60, Math.round(width * 0.16));
    draw
      .rect(accentWidth, 4)
      .move((width - accentWidth) / 2, margin + 14)
      .radius(2)
      .fill(options.border.color || "#3b82f6")
      .opacity(0.8);

    const minImgSize = Math.min(options.image.size || 160, innerW - 40, innerH - 40);
    const gapImgTitle = hasImage ? 28 : 0;
    const gapTitleDesc = numLines > 0 ? 16 : 0;
    const textH = titleFontSize + gapTitleDesc + descH;

    const pos = computeVerticalStackPositions({
      cardH: height,
      margin,
      topPad: 36,
      bottomPad: 24,
      minGap: gapImgTitle,
      hasImage,
      imgSize: minImgSize,
      imgVAlign,
      textH,
      titleFontSize,
      vAlign,
    });

    const imgY = pos.imgY;
    const titleY = pos.titleY;

    const imgX = (width - minImgSize) / 2 + imgOffsetX;

    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY + imgOffsetY },
        minImgSize,
        minImgSize,
        "cardMinLogo",
      );
    }

    const textX = (isLeft ? margin + 25 : width / 2) + textOffsetX;
    const textAnchor = isLeft ? "start" : "middle";

    renderTitle(
      draw,
      options.title,
      textX,
      titleY + textOffsetY,
      { ...options.titleFont, fontSize: titleFontSize },
      textAnchor,
    );

    if (numLines > 0) {
      const descY = titleY + textOffsetY + titleFontSize + 14;
      renderMultilineDescription(
        draw,
        options.description,
        textX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        textAnchor,
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 4: SPLIT (Two-tone vertical panel for logo + content)
  // --------------------------------------------------------------------------
  if (variant === "split") {
    const splitRatio = 0.44;
    const topH = Math.round(innerH * splitRatio);
    const splitY = margin + topH;
    const bottomH = innerH - topH;
    const bgClipId = `cardBgClip_${width}_${height}_${margin}_${radius}`;

    // Top logo compartment background
    const splitBg = options.splitBackground || {
      type: "solid",
      color: "#0b1329",
      gradientStart: "#0b1329",
      gradientEnd: "#1e293b",
      gradientDirection: "to-br",
      opacity: 1,
    };
    renderPanelBackground(
      draw,
      splitBg,
      { x: margin, y: margin, width: innerW, height: topH },
      bgClipId,
      "cardSplitBg",
    );

    // Inset horizontal dividing seam
    draw
      .line(margin, splitY, width - margin, splitY)
      .stroke({ color: "#000000", width: 1, opacity: 0.4 });
    draw
      .line(margin, splitY + 1, width - margin, splitY + 1)
      .stroke({ color: "#ffffff", width: 1, opacity: 0.12 });

    const splitImgSize = Math.min(options.image.size || 160, topH - 16, innerW - 24);
    const imgX = (width - splitImgSize) / 2 + imgOffsetX;
    let imgY: number;
    if (imgVAlign === "top") {
      imgY = margin + 14;
    } else if (imgVAlign === "bottom") {
      imgY = splitY - splitImgSize - 14;
    } else {
      imgY = margin + (topH - splitImgSize) / 2;
    }

    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY + imgOffsetY },
        splitImgSize,
        splitImgSize,
        "cardSplitLogo",
      );
    }

    // Bottom compartment content vertically positioned
    const gapTitleDesc = numLines > 0 ? 16 : 0;
    const textH = titleFontSize + gapTitleDesc + descH;
    let textStartY: number;
    if (vAlign === "top") {
      textStartY = splitY + 24;
    } else if (vAlign === "bottom") {
      textStartY = height - margin - 24 - textH;
    } else {
      textStartY = splitY + Math.max(16, (bottomH - textH) / 2);
    }
    const titleY = textStartY + titleFontSize * 0.85;

    const textX = (isLeft ? margin + 25 : width / 2) + textOffsetX;
    const textAnchor = isLeft ? "start" : "middle";

    renderTitle(
      draw,
      options.title,
      textX,
      titleY + textOffsetY,
      { ...options.titleFont, fontSize: titleFontSize },
      textAnchor,
    );

    if (numLines > 0) {
      const descY = titleY + textOffsetY + titleFontSize + 14;
      renderMultilineDescription(
        draw,
        options.description,
        textX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        textAnchor,
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 5: STANDARD (Classic default)
  // --------------------------------------------------------------------------
  const stdImgSize = Math.min(options.image.size || 220, innerW - 30, innerH - 30);
  const gapImgTitle = hasImage ? 28 : 0;
  const gapTitleDesc = numLines > 0 ? 16 : 0;
  const textH = titleFontSize + gapTitleDesc + descH;

  const pos = computeVerticalStackPositions({
    cardH: height,
    margin,
    topPad: 24,
    bottomPad: 24,
    minGap: gapImgTitle,
    hasImage,
    imgSize: stdImgSize,
    imgVAlign,
    textH,
    titleFontSize,
    vAlign,
  });

  const imgY = pos.imgY;
  const titleY = pos.titleY;

  if (isLeft) {
    const textX = margin + 25 + textOffsetX;
    if (hasImage) {
      const imgX = margin + 25 + imgOffsetX;
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY + imgOffsetY },
        stdImgSize,
        stdImgSize,
        "cardLogo",
      );
    }

    renderTitle(draw, options.title, textX, titleY + textOffsetY, { ...options.titleFont, fontSize: titleFontSize }, "start");

    if (numLines > 0) {
      const descY = titleY + textOffsetY + titleFontSize + 14;
      renderMultilineDescription(
        draw,
        options.description,
        textX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "start",
      );
    }
  } else {
    // Center (default)
    const imgX = (width - stdImgSize) / 2 + imgOffsetX;

    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY + imgOffsetY },
        stdImgSize,
        stdImgSize,
        "cardLogo",
      );
    }

    renderTitle(
      draw,
      options.title,
      width / 2 + textOffsetX,
      titleY + textOffsetY,
      { ...options.titleFont, fontSize: titleFontSize },
      "middle",
    );

    if (numLines > 0) {
      const descY = titleY + textOffsetY + titleFontSize + 14;
      renderMultilineDescription(
        draw,
        options.description,
        width / 2 + textOffsetX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "middle",
      );
    }
  }

  return draw.node as SVGSVGElement;
}
