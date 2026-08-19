import { StandardCardOptions } from "../../types.ts";
import { getCardDimensions } from "../../utils/dimensions.ts";
import { createBaseSvg } from "../svg-base.ts";
import {
  renderImage,
  renderMultilineDescription,
  renderTitle,
} from "../elements.ts";

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

  const descLines = options.description
    ? options.description.split("\n").filter((l) => l.trim().length > 0)
    : [];
  const numLines = descLines.length;
  const descH = numLines > 0
    ? (numLines - 1) * (descFontSize * lineHeight) + descFontSize
    : 0;

  // --------------------------------------------------------------------------
  // Variant 1: HERO (Dedicated floating hero stage plate with spotlight framing)
  // --------------------------------------------------------------------------
  if (variant === "hero") {
    const maxHeroImg = Math.min(innerH * 0.38, innerW - 60);
    const heroImgSize = Math.min(options.image.size || 200, maxHeroImg);
    const stagePad = 18;
    const stageW = innerW - 24;
    const stageH = hasImage ? heroImgSize + stagePad * 2 : 70;
    const stageX = (width - stageW) / 2;

    const gapStageTitle = 24;
    const gapTitleDesc = numLines > 0 ? 16 : 0;
    const totalH = stageH + gapStageTitle + titleFontSize + gapTitleDesc + descH;

    const startY = margin + Math.max(16, (innerH - totalH) / 2);
    const stageY = startY;

    // Floating Hero Stage Pedestal Plate
    draw
      .rect(stageW, stageH)
      .move(stageX, stageY)
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
        .center(width / 2, stageY + stageH / 2)
        .attr({
          fill: options.border.color || "#3b82f6",
          "fill-opacity": 0.08,
        });

      const imgX = (width - heroImgSize) / 2;
      const imgY = stageY + stagePad;
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        heroImgSize,
        heroImgSize,
        "cardHeroLogo",
      );
    }

    const titleY = stageY + stageH + gapStageTitle + titleFontSize * 0.8;
    const textX = isLeft ? margin + 25 : width / 2;
    const textAnchor = isLeft ? "start" : "middle";

    renderTitle(
      draw,
      options.title,
      textX,
      titleY,
      { ...options.titleFont, fontSize: titleFontSize },
      textAnchor,
    );

    if (numLines > 0) {
      const descY = titleY + titleFontSize + 14;
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
    const headerImgSize = Math.min(options.image.size || 80, 90);
    const compactTitleSize = Math.min(titleFontSize, 28);
    const headerH = hasImage ? Math.max(headerImgSize, compactTitleSize) : compactTitleSize;
    const dividerGap = 18;
    const descGap = numLines > 0 ? 24 : 0;
    const totalH = headerH + dividerGap + descGap + descH;

    const startY = margin + Math.max(20, (innerH - totalH) / 2);
    const headerY = startY;
    let headerTextX = margin + 20;

    if (hasImage) {
      const imgY = headerY + (headerH - headerImgSize) / 2;
      renderImage(
        draw,
        options.image,
        { x: margin + 20, y: imgY },
        headerImgSize,
        headerImgSize,
        "cardCompactLogo",
      );
      headerTextX = margin + 20 + headerImgSize + 16;
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
      const descX = isLeft ? margin + 20 : width / 2;
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

    const minImgSize = Math.min(options.image.size || 160, 170);
    const imgH = hasImage ? minImgSize : 0;
    const gapImgTitle = hasImage ? 28 : 0;
    const gapTitleDesc = numLines > 0 ? 16 : 0;
    const totalH = imgH + gapImgTitle + titleFontSize + gapTitleDesc + descH;

    const availableH = innerH - 24;
    const startY = margin + 24 + Math.max(16, (availableH - totalH) / 2);
    const imgX = (width - minImgSize) / 2;
    const imgY = startY;

    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        minImgSize,
        minImgSize,
        "cardMinLogo",
      );
    }

    const titleY = hasImage
      ? imgY + minImgSize + gapImgTitle + titleFontSize * 0.8
      : startY + titleFontSize * 0.8;

    const textX = isLeft ? margin + 25 : width / 2;
    const textAnchor = isLeft ? "start" : "middle";

    renderTitle(
      draw,
      options.title,
      textX,
      titleY,
      { ...options.titleFont, fontSize: titleFontSize },
      textAnchor,
    );

    if (numLines > 0) {
      const descY = titleY + titleFontSize + 14;
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
    draw
      .rect(innerW, topH)
      .move(margin, margin)
      .attr({
        fill: "#0b1329",
        "clip-path": `url(#${bgClipId})`,
      });

    // Inset horizontal dividing seam
    draw
      .line(margin, splitY, width - margin, splitY)
      .stroke({ color: "#000000", width: 1, opacity: 0.4 });
    draw
      .line(margin, splitY + 1, width - margin, splitY + 1)
      .stroke({ color: "#ffffff", width: 1, opacity: 0.12 });

    const splitImgSize = Math.min(options.image.size || 160, topH - 28, innerW - 40);
    const imgX = (width - splitImgSize) / 2;
    const imgY = margin + (topH - splitImgSize) / 2;

    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        splitImgSize,
        splitImgSize,
        "cardSplitLogo",
      );
    }

    // Bottom compartment content vertically centered
    const gapTitleDesc = numLines > 0 ? 16 : 0;
    const textH = titleFontSize + gapTitleDesc + descH;
    const textStartY = splitY + Math.max(16, (bottomH - textH) / 2);
    const titleY = textStartY + titleFontSize * 0.85;

    const textX = isLeft ? margin + 25 : width / 2;
    const textAnchor = isLeft ? "start" : "middle";

    renderTitle(
      draw,
      options.title,
      textX,
      titleY,
      { ...options.titleFont, fontSize: titleFontSize },
      textAnchor,
    );

    if (numLines > 0) {
      const descY = titleY + titleFontSize + 14;
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
  // Variant 5: STANDARD (Classic default, vertically centered)
  // --------------------------------------------------------------------------
  const stdImgSize = Math.min(options.image.size || 220, Math.round(innerH * 0.4), innerW - 40);
  const imgH = hasImage ? stdImgSize : 0;
  const gapImgTitle = hasImage ? 28 : 0;
  const gapTitleDesc = numLines > 0 ? 16 : 0;
  const totalH = imgH + gapImgTitle + titleFontSize + gapTitleDesc + descH;
  const startY = margin + Math.max(16, (innerH - totalH) / 2);

  if (isLeft) {
    const textX = margin + 25;
    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: textX, y: startY },
        stdImgSize,
        stdImgSize,
        "cardLogo",
      );
    }
    const titleY = hasImage
      ? startY + stdImgSize + gapImgTitle + titleFontSize * 0.8
      : startY + titleFontSize * 0.8;

    renderTitle(draw, options.title, textX, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");

    if (numLines > 0) {
      const descY = titleY + titleFontSize + 14;
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
    const imgX = (width - stdImgSize) / 2;
    const imgY = startY;

    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        stdImgSize,
        stdImgSize,
        "cardLogo",
      );
    }
    const titleY = hasImage
      ? imgY + stdImgSize + gapImgTitle + titleFontSize * 0.8
      : startY + titleFontSize * 0.8;

    renderTitle(
      draw,
      options.title,
      width / 2,
      titleY,
      { ...options.titleFont, fontSize: titleFontSize },
      "middle",
    );

    if (numLines > 0) {
      const descY = titleY + titleFontSize + 14;
      renderMultilineDescription(
        draw,
        options.description,
        width / 2,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "middle",
      );
    }
  }

  return draw.node as SVGSVGElement;
}
