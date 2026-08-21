import { WidescreenCardOptions } from "../../types.ts";
import { getCardDimensions } from "../../utils/dimensions.ts";
import { createBaseSvg, renderPanelBackground } from "../svg-base.ts";
import {
  renderImage,
  renderMultilineDescription,
  renderTitle,
} from "../elements.ts";
import { computeVerticalStackPositions } from "../vertical-stack.ts";

export function generateWidescreen(
  options: WidescreenCardOptions,
): SVGSVGElement {
  const { width, height } = getCardDimensions(options);
  const layout = options.layoutStyle || "split";
  const margin = options.border.margin ?? 10;
  const innerW = width - 2 * margin;
  const innerH = height - 2 * margin;
  const { draw, radius } = createBaseSvg(
    width,
    height,
    options,
    `Widescreen Banner (${layout})`,
  );

  const hasImage = Boolean(options.image.show && options.image.url);
  const titleFontSize = Math.min(options.titleFont.fontSize || 40, 44);
  const descFontSize = Math.min(options.descriptionFont.fontSize || 22, 24);
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

  const computeTextY = (centerY = margin + innerH / 2, tSize = titleFontSize, dSize = descFontSize, topPad = 32, bottomPad = 32) => {
    const gap = numLines > 0 ? 16 : 0;
    const descHeight = numLines > 0 ? (numLines - 1) * (dSize * lineHeight) + dSize : 0;
    const textH = tSize + (numLines > 0 ? gap + descHeight : 0);

    let titleY: number;
    if (vAlign === "top") {
      titleY = margin + topPad + tSize * 0.85;
    } else if (vAlign === "bottom") {
      titleY = height - margin - bottomPad - (textH - tSize * 0.85);
    } else {
      titleY = centerY - textH / 2 + tSize * 0.85;
    }
    titleY += textOffsetY;
    const descY = titleY + tSize + 16;
    return { titleY, descY };
  };

  const computeImgY = (imgSize: number, topPad = 28, bottomPad = 28) => {
    let y: number;
    if (imgVAlign === "top") y = margin + topPad;
    else if (imgVAlign === "bottom") y = height - margin - bottomPad - imgSize;
    else y = (height - imgSize) / 2;
    return y + imgOffsetY;
  };

  const textCenterY = margin + innerH / 2;

  // --------------------------------------------------------------------------
  // Variant 1: CENTERED
  // --------------------------------------------------------------------------
  if (layout === "centered") {
    const smallImg = Math.min(options.image.size || 120, innerW - 60, innerH - 40);
    const gapImgTitle = hasImage ? 24 : 0;
    const gapTitleDesc = numLines > 0 ? 16 : 0;
    const textH = titleFontSize + (numLines > 0 ? gapTitleDesc + descH : 0);

    const pos = computeVerticalStackPositions({
      cardH: height,
      margin,
      topPad: 28,
      bottomPad: 28,
      minGap: gapImgTitle,
      hasImage,
      imgSize: smallImg,
      imgVAlign,
      textH,
      titleFontSize,
      vAlign,
    });

    const imgY = pos.imgY;
    const titleY = pos.titleY;

    const imgX = (width - smallImg) / 2 + imgOffsetX;

    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY + imgOffsetY },
        smallImg,
        smallImg,
        "wsCenteredLogo",
      );
    }

    renderTitle(
      draw,
      options.title,
      width / 2 + textOffsetX,
      titleY,
      { ...options.titleFont, fontSize: titleFontSize },
      "middle",
    );

    if (numLines > 0) {
      const descY = titleY + titleFontSize + 16;
      renderMultilineDescription(
        draw,
        options.description,
        width / 2 + textOffsetX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "middle",
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 2: BANNER (Right-aligned image showcase)
  // --------------------------------------------------------------------------
  if (layout === "banner") {
    const { titleY, descY } = computeTextY(textCenterY, titleFontSize, descFontSize, 36, 36);

    if (hasImage) {
      const bannerImgSize = Math.min(options.image.size || 200, Math.round(innerW * 0.5), innerH - 30);
      const imgX = width - margin - bannerImgSize - 35 + imgOffsetX;
      const imgY = computeImgY(bannerImgSize, 36, 36);
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        bannerImgSize,
        bannerImgSize,
        "wsBannerLogo",
      );
    }

    renderTitle(draw, options.title, margin + 40 + textOffsetX, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");
    if (numLines > 0) {
      renderMultilineDescription(
        draw,
        options.description,
        margin + 40 + textOffsetX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "start",
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 3: HERO (Floating container card with decorative backdrop)
  // --------------------------------------------------------------------------
  if (layout === "hero") {
    const cardPad = 25;
    const innerCardW = width - 2 * margin - 2 * cardPad;
    const innerCardH = height - 2 * margin - 2 * cardPad;
    const innerCardX = margin + cardPad;
    const innerCardY = margin + cardPad;
    const heroCenterY = innerCardY + innerCardH / 2;
    const { titleY, descY } = computeTextY(heroCenterY, titleFontSize, descFontSize, cardPad + 28, cardPad + 28);

    // Floating glass container
    draw
      .rect(innerCardW, innerCardH)
      .move(innerCardX, innerCardY)
      .radius(Math.max(8, radius - 4))
      .attr({
        fill: "#ffffff",
        "fill-opacity": 0.04,
        stroke: options.border.color || "#334155",
        "stroke-width": 1.5,
        "stroke-opacity": 0.5,
      });

    if (hasImage) {
      const heroImgSize = Math.min(options.image.size || 170, Math.round(innerCardW * 0.5), innerCardH - 30);
      const imgX = innerCardX + 25 + imgOffsetX;
      const imgY = computeImgY(heroImgSize, cardPad + 28, cardPad + 28);

      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        heroImgSize,
        heroImgSize,
        "wsHeroLogo",
      );

      const textX = innerCardX + 25 + heroImgSize + 30 + textOffsetX;
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
      renderTitle(
        draw,
        options.title,
        width / 2 + textOffsetX,
        titleY,
        { ...options.titleFont, fontSize: titleFontSize },
        "middle",
      );
      if (numLines > 0) {
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

  // --------------------------------------------------------------------------
  // Variant 4: MINIMAL (Horizontal stripe with vertical dividing accent)
  // --------------------------------------------------------------------------
  if (layout === "minimal") {
    const { titleY, descY } = computeTextY(textCenterY, titleFontSize, descFontSize, 36, 36);

    if (hasImage) {
      const minImgSize = Math.min(options.image.size || 180, Math.round(innerW * 0.5), innerH - 30);
      const imgX = margin + 35 + imgOffsetX;
      const imgY = computeImgY(minImgSize, 36, 36);

      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        minImgSize,
        minImgSize,
        "wsMinLogo",
      );

      // Divider line
      const divX = margin + 35 + minImgSize + 30;
      draw
        .line(divX, margin + 35, divX, height - margin - 35)
        .stroke({
          color: options.border.color || "#3b82f6",
          width: 2,
          opacity: 0.6,
        });

      const textX = margin + 35 + minImgSize + 60 + textOffsetX;
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
      renderTitle(draw, options.title, margin + 45 + textOffsetX, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");
      if (numLines > 0) {
        renderMultilineDescription(
          draw,
          options.description,
          margin + 45 + textOffsetX,
          descY,
          { ...options.descriptionFont, fontSize: descFontSize },
          "start",
        );
      }
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 5: SPLIT (Default 2-column showcase)
  // --------------------------------------------------------------------------
  if (options.splitBackground) {
    const splitRatio = 0.38;
    const panelWidth = Math.round(innerW * splitRatio);
    const splitX = margin + panelWidth;
    const bgClipId = `cardBgClip_${width}_${height}_${margin}_${radius}`;
    renderPanelBackground(
      draw,
      options.splitBackground,
      { x: margin, y: margin, width: panelWidth, height: innerH },
      bgClipId,
      "wsSplitBg",
    );

    // Inset vertical seam line
    draw
      .line(splitX, margin, splitX, height - margin)
      .stroke({ color: "#000000", width: 1, opacity: 0.35 });
    draw
      .line(splitX + 1, margin, splitX + 1, height - margin)
      .stroke({ color: "#ffffff", width: 1, opacity: 0.12 });
  }

  const stdImgSize = Math.min(options.image.size || 200, Math.round(innerW * 0.5), innerH - 30);
  const { titleY, descY } = computeTextY(textCenterY, titleFontSize, descFontSize, 36, 36);

  if (hasImage) {
    const imgX = margin + 35 + imgOffsetX;
    const imgY = computeImgY(stdImgSize, 36, 36);
    renderImage(
      draw,
      options.image,
      { x: imgX, y: imgY },
      stdImgSize,
      stdImgSize,
      "wsLogo",
    );

    const textX = margin + 35 + stdImgSize + 35 + textOffsetX;
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
    renderTitle(draw, options.title, margin + 45 + textOffsetX, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");
    if (numLines > 0) {
      renderMultilineDescription(
        draw,
        options.description,
        margin + 45 + textOffsetX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "start",
      );
    }
  }

  return draw.node as SVGSVGElement;
}
