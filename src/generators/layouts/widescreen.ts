import { WidescreenCardOptions } from "../../types.ts";
import { getCardDimensions } from "../../utils/dimensions.ts";
import { createBaseSvg } from "../svg-base.ts";
import {
  renderImage,
  renderMultilineDescription,
  renderTitle,
} from "../elements.ts";

export function generateWidescreen(
  options: WidescreenCardOptions,
): SVGSVGElement {
  const { width, height } = getCardDimensions(options);
  const layout = options.bannerVariant || options.layoutStyle || "split";
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

  const descLines = options.description
    ? options.description.split("\n").filter((l) => l.trim().length > 0)
    : [];
  const numLines = descLines.length;
  const descH = numLines > 0
    ? (numLines - 1) * (descFontSize * lineHeight) + descFontSize
    : 0;

  const computeCenteredTextY = (centerY: number) => {
    const gap = numLines > 0 ? 16 : 0;
    const textH = titleFontSize + (numLines > 0 ? gap + descH : 0);
    const titleY = centerY - textH / 2 + titleFontSize * 0.85;
    const descY = titleY + titleFontSize + 16;
    return { titleY, descY };
  };

  const textCenterY = margin + innerH / 2;

  // --------------------------------------------------------------------------
  // Variant 1: CENTERED
  // --------------------------------------------------------------------------
  if (layout === "centered") {
    const smallImg = Math.min(options.image.size || 120, 130);
    const imgH = hasImage ? smallImg : 0;
    const gapImgTitle = hasImage ? 24 : 0;
    const gapTitleDesc = numLines > 0 ? 16 : 0;
    const totalH = imgH + gapImgTitle + titleFontSize + (numLines > 0 ? gapTitleDesc + descH : 0);

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
        "wsCenteredLogo",
      );
    }

    const titleY = hasImage
      ? imgY + smallImg + gapImgTitle + titleFontSize * 0.85
      : startY + titleFontSize * 0.85;

    renderTitle(
      draw,
      options.title,
      width / 2,
      titleY,
      { ...options.titleFont, fontSize: titleFontSize },
      "middle",
    );

    if (numLines > 0) {
      const descY = titleY + titleFontSize + 16;
      renderMultilineDescription(
        draw,
        options.description,
        width / 2,
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
    const { titleY, descY } = computeCenteredTextY(textCenterY);

    if (hasImage) {
      const bannerImgSize = Math.min(options.image.size || 200, innerH - 40);
      const imgX = width - margin - bannerImgSize - 35;
      const imgY = (height - bannerImgSize) / 2;
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        bannerImgSize,
        bannerImgSize,
        "wsBannerLogo",
      );
    }

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
    const { titleY, descY } = computeCenteredTextY(heroCenterY);

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
      const heroImgSize = Math.min(options.image.size || 170, innerCardH - 40);
      const imgX = innerCardX + 25;
      const imgY = innerCardY + (innerCardH - heroImgSize) / 2;

      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        heroImgSize,
        heroImgSize,
        "wsHeroLogo",
      );

      const textX = imgX + heroImgSize + 30;
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
        width / 2,
        titleY,
        { ...options.titleFont, fontSize: titleFontSize },
        "middle",
      );
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
  // Variant 4: MINIMAL (Horizontal stripe with vertical dividing accent)
  // --------------------------------------------------------------------------
  if (layout === "minimal") {
    const { titleY, descY } = computeCenteredTextY(textCenterY);

    if (hasImage) {
      const minImgSize = Math.min(options.image.size || 180, innerH - 40);
      const imgX = margin + 35;
      const imgY = (height - minImgSize) / 2;

      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        minImgSize,
        minImgSize,
        "wsMinLogo",
      );

      // Divider line
      const divX = imgX + minImgSize + 30;
      draw
        .line(divX, margin + 35, divX, height - margin - 35)
        .stroke({
          color: options.border.color || "#3b82f6",
          width: 2,
          opacity: 0.6,
        });

      const textX = divX + 30;
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
      renderTitle(draw, options.title, margin + 45, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");
      if (numLines > 0) {
        renderMultilineDescription(
          draw,
          options.description,
          margin + 45,
          descY,
          { ...options.descriptionFont, fontSize: descFontSize },
          "start",
        );
      }
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 5: SPLIT (Default 2-column showcase, vertically centered)
  // --------------------------------------------------------------------------
  const stdImgSize = Math.min(options.image.size || 200, innerH - 40);
  const { titleY, descY } = computeCenteredTextY(textCenterY);

  if (hasImage) {
    const imgX = margin + 35;
    const imgY = (height - stdImgSize) / 2;
    renderImage(
      draw,
      options.image,
      { x: imgX, y: imgY },
      stdImgSize,
      stdImgSize,
      "wsLogo",
    );

    const textX = imgX + stdImgSize + 35;
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
    renderTitle(draw, options.title, margin + 45, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");
    if (numLines > 0) {
      renderMultilineDescription(
        draw,
        options.description,
        margin + 45,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "start",
      );
    }
  }

  return draw.node as SVGSVGElement;
}
