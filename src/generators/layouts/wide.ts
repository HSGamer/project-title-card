import { WideCardOptions } from "../../types.ts";
import { getCardDimensions } from "../../utils/dimensions.ts";
import { createBaseSvg } from "../svg-base.ts";
import {
  renderImage,
  renderMultilineDescription,
  renderTitle,
} from "../elements.ts";

export function generateWidecard(options: WideCardOptions): SVGSVGElement {
  const { width, height } = getCardDimensions(options);
  const variant = options.wideVariant || "standard";
  const margin = options.border.margin ?? 10;
  const innerW = width - 2 * margin;
  const innerH = height - 2 * margin;

  // Custom pill radius for badge variant
  const pillRadius = variant === "badge"
    ? Math.round((height - 2 * margin) / 2)
    : undefined;

  const { draw, radius } = createBaseSvg(
    width,
    height,
    options,
    `Wide Card (${variant})`,
    false,
    pillRadius,
  );

  const hasImage = Boolean(options.image.show && options.image.url);
  const titleFontSize = Math.min(options.titleFont.fontSize || 42, 46);
  const descFontSize = Math.min(options.descriptionFont.fontSize || 22, 26);
  const lineHeight = options.descriptionFont.lineHeight || 1.3;

  const descLines = options.description
    ? options.description.split("\n").filter((l) => l.trim().length > 0)
    : [];
  const numLines = descLines.length;
  const descH = numLines > 0
    ? (numLines - 1) * (descFontSize * lineHeight) + descFontSize
    : 0;

  // Helper for computing vertically centered text positions in a side panel or card
  const computeCenteredTextY = (centerY: number, tSize = titleFontSize, dSize = descFontSize) => {
    const gap = numLines > 0 ? 14 : 0;
    const descHeight = numLines > 0 ? (numLines - 1) * (dSize * lineHeight) + dSize : 0;
    const textH = tSize + (numLines > 0 ? gap + descHeight : 0);
    const titleY = centerY - textH / 2 + tSize * 0.85;
    const descY = titleY + tSize + 14;
    return { titleY, descY };
  };

  const textCenterY = margin + innerH / 2;

  // --------------------------------------------------------------------------
  // Variant 1: SPLIT (Two-tone side panel for logo + content panel)
  // --------------------------------------------------------------------------
  if (variant === "split") {
    const isRight = options.imagePosition === "right";
    const splitRatio = 0.32;
    const panelWidth = Math.round(innerW * splitRatio);
    const splitX = isRight ? width - margin - panelWidth : margin + panelWidth;
    const bgClipId = `cardBgClip_${width}_${height}_${margin}_${radius}`;

    // Side panel background clipped inside card border
    const panelX = isRight ? splitX : margin;
    draw
      .rect(panelWidth, innerH)
      .move(panelX, margin)
      .attr({
        fill: "#0b1329",
        "clip-path": `url(#${bgClipId})`,
      });

    // Inset vertical seam line
    draw
      .line(splitX, margin, splitX, height - margin)
      .stroke({ color: "#000000", width: 1, opacity: 0.4 });
    draw
      .line(splitX + 1, margin, splitX + 1, height - margin)
      .stroke({ color: "#ffffff", width: 1, opacity: 0.12 });

    // Render Logo in side panel
    if (hasImage) {
      const panelImgSize = Math.min(options.image.size || 160, panelWidth - 40, innerH - 40);
      const imgX = panelX + (panelWidth - panelImgSize) / 2;
      const imgY = (height - panelImgSize) / 2;
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        panelImgSize,
        panelImgSize,
        "wideSplitLogo",
      );
    }

    // Render Title & Description in main panel (vertically centered)
    const textX = isRight ? margin + 35 : splitX + 35;
    const { titleY, descY } = computeCenteredTextY(textCenterY);

    renderTitle(draw, options.title, textX, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");
    if (numLines > 0) {
      renderMultilineDescription(
        draw,
        options.description,
        textX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "start",
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 2: CENTERED
  // --------------------------------------------------------------------------
  if (variant === "centered") {
    const smallImg = Math.min(options.image.size || 90, 95);
    const centeredTitleSize = Math.min(titleFontSize, 36);
    const centeredDescSize = Math.min(descFontSize, 20);
    const centeredDescH = numLines > 0
      ? (numLines - 1) * (centeredDescSize * lineHeight) + centeredDescSize
      : 0;

    const imgH = hasImage ? smallImg : 0;
    const gapImgTitle = hasImage ? 18 : 0;
    const gapTitleDesc = numLines > 0 ? 14 : 0;
    const totalH = imgH + gapImgTitle + centeredTitleSize + (numLines > 0 ? gapTitleDesc + centeredDescH : 0);

    const startY = margin + Math.max(16, (innerH - totalH) / 2);
    const imgX = (width - smallImg) / 2;
    const imgY = startY;

    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        smallImg,
        smallImg,
        "wideCenteredLogo",
      );
    }

    const titleY = hasImage
      ? imgY + smallImg + gapImgTitle + centeredTitleSize * 0.85
      : startY + centeredTitleSize * 0.85;

    renderTitle(
      draw,
      options.title,
      width / 2,
      titleY,
      { ...options.titleFont, fontSize: centeredTitleSize },
      "middle",
    );

    if (numLines > 0) {
      const descY = titleY + centeredTitleSize + 14;
      renderMultilineDescription(
        draw,
        options.description,
        width / 2,
        descY,
        { ...options.descriptionFont, fontSize: centeredDescSize },
        "middle",
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 3: MINIMAL (Vertical divider between logo and text)
  // --------------------------------------------------------------------------
  if (variant === "minimal") {
    const isRight = options.imagePosition === "right";
    const { titleY, descY } = computeCenteredTextY(textCenterY);

    if (hasImage) {
      const minImgSize = Math.min(options.image.size || 160, innerH - 40);
      const imgX = isRight ? width - margin - minImgSize - 35 : margin + 35;
      const imgY = (height - minImgSize) / 2;

      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        minImgSize,
        minImgSize,
        "wideMinLogo",
      );

      // Divider line
      const divX = isRight ? imgX - 25 : imgX + minImgSize + 25;
      draw
        .line(divX, margin + 25, divX, height - margin - 25)
        .stroke({
          color: options.border.color || "#334155",
          width: 1.5,
          opacity: 0.5,
        });

      const textX = isRight ? margin + 35 : divX + 30;
      renderTitle(draw, options.title, textX, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");
      if (numLines > 0) {
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
      renderTitle(draw, options.title, margin + 40, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");
      if (numLines > 0) {
        renderMultilineDescription(
          draw,
          options.description,
          margin + 40,
          descY,
          { ...options.descriptionFont, fontSize: descFontSize },
          "start",
        );
      }
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 4: BADGE (Capsule pill container)
  // --------------------------------------------------------------------------
  if (variant === "badge") {
    const isRight = options.imagePosition === "right";
    const badgeImgSize = Math.min(options.image.size || 150, innerH - 40);
    const { titleY, descY } = computeCenteredTextY(textCenterY);

    if (hasImage) {
      const imgX = isRight
        ? width - margin - badgeImgSize - 40
        : margin + 40;
      const imgY = (height - badgeImgSize) / 2;

      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        badgeImgSize,
        badgeImgSize,
        "wideBadgeLogo",
      );

      const textX = isRight ? margin + 50 : imgX + badgeImgSize + 35;
      renderTitle(draw, options.title, textX, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");
      if (numLines > 0) {
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
      renderTitle(draw, options.title, width / 2, titleY, { ...options.titleFont, fontSize: titleFontSize }, "middle");
      if (numLines > 0) {
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

  // --------------------------------------------------------------------------
  // Variant 5: STANDARD (Classic horizontal default, vertically centered)
  // --------------------------------------------------------------------------
  const stdImgSize = Math.min(options.image.size || 170, innerH - 35);
  const { titleY, descY } = computeCenteredTextY(textCenterY);

  if (options.imagePosition === "right") {
    if (hasImage) {
      const imgX = width - margin - stdImgSize - 30;
      const imgY = (height - stdImgSize) / 2;
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        stdImgSize,
        stdImgSize,
        "wideLogo",
      );
    }
    renderTitle(draw, options.title, margin + 35, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");
    if (numLines > 0) {
      renderMultilineDescription(
        draw,
        options.description,
        margin + 35,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "start",
      );
    }
  } else {
    // Left (default)
    if (hasImage) {
      const imgX = margin + 30;
      const imgY = (height - stdImgSize) / 2;
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        stdImgSize,
        stdImgSize,
        "wideLogo",
      );

      const textX = imgX + stdImgSize + 32;
      renderTitle(draw, options.title, textX, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");
      if (numLines > 0) {
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
      renderTitle(draw, options.title, margin + 40, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");
      if (numLines > 0) {
        renderMultilineDescription(
          draw,
          options.description,
          margin + 40,
          descY,
          { ...options.descriptionFont, fontSize: descFontSize },
          "start",
        );
      }
    }
  }

  return draw.node as SVGSVGElement;
}
