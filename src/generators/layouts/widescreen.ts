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
  const { draw, radius } = createBaseSvg(
    width,
    height,
    options,
    `Widescreen Banner (${layout})`,
  );

  const hasImage = Boolean(options.image.show && options.image.url);
  const titleFontSize = Math.min(options.titleFont.fontSize || 40, 44);
  const descFontSize = Math.min(options.descriptionFont.fontSize || 22, 24);

  // --------------------------------------------------------------------------
  // Variant 1: CENTERED
  // --------------------------------------------------------------------------
  if (layout === "centered") {
    const smallImg = Math.min(options.image.size || 120, 130);
    const imgX = (width - smallImg) / 2;
    const imgY = margin + 25;

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

    const titleY = hasImage ? imgY + smallImg + 38 : margin + 120;
    renderTitle(
      draw,
      options.title,
      width / 2,
      titleY,
      { ...options.titleFont, fontSize: titleFontSize },
      "middle",
    );
    const descY = titleY + titleFontSize + 14;
    renderMultilineDescription(
      draw,
      options.description,
      width / 2,
      descY,
      { ...options.descriptionFont, fontSize: descFontSize },
      "middle",
    );

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 2: BANNER (Right-aligned image showcase)
  // --------------------------------------------------------------------------
  if (layout === "banner") {
    if (hasImage) {
      const bannerImgSize = Math.min(options.image.size || 200, height - 2 * margin - 50);
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

    renderTitle(draw, options.title, margin + 40, 135, { ...options.titleFont, fontSize: titleFontSize }, "start");
    const descY = 135 + titleFontSize + 14;
    renderMultilineDescription(
      draw,
      options.description,
      margin + 40,
      descY,
      { ...options.descriptionFont, fontSize: descFontSize },
      "start",
    );

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
      const titleY = innerCardY + 55;
      renderTitle(draw, options.title, textX, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");
      const descY = titleY + titleFontSize + 14;
      renderMultilineDescription(
        draw,
        options.description,
        textX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "start",
      );
    } else {
      renderTitle(
        draw,
        options.title,
        width / 2,
        innerCardY + 55,
        { ...options.titleFont, fontSize: titleFontSize },
        "middle",
      );
      const descY = innerCardY + 55 + titleFontSize + 14;
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
  // Variant 4: MINIMAL (Horizontal stripe with vertical dividing accent)
  // --------------------------------------------------------------------------
  if (layout === "minimal") {
    if (hasImage) {
      const minImgSize = Math.min(options.image.size || 180, height - 2 * margin - 50);
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
      renderTitle(draw, options.title, textX, 135, { ...options.titleFont, fontSize: titleFontSize }, "start");
      const descY = 135 + titleFontSize + 14;
      renderMultilineDescription(
        draw,
        options.description,
        textX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "start",
      );
    } else {
      renderTitle(draw, options.title, margin + 45, 135, { ...options.titleFont, fontSize: titleFontSize }, "start");
      const descY = 135 + titleFontSize + 14;
      renderMultilineDescription(
        draw,
        options.description,
        margin + 45,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "start",
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 5: SPLIT (Default 2-column showcase)
  // --------------------------------------------------------------------------
  const stdImgSize = Math.min(options.image.size || 200, height - 2 * margin - 50);

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
    renderTitle(draw, options.title, textX, 135, { ...options.titleFont, fontSize: titleFontSize }, "start");
    const descY = 135 + titleFontSize + 14;
    renderMultilineDescription(
      draw,
      options.description,
      textX,
      descY,
      { ...options.descriptionFont, fontSize: descFontSize },
      "start",
    );
  } else {
    renderTitle(draw, options.title, margin + 45, 140, { ...options.titleFont, fontSize: titleFontSize }, "start");
    const descY = 140 + titleFontSize + 14;
    renderMultilineDescription(
      draw,
      options.description,
      margin + 45,
      descY,
      { ...options.descriptionFont, fontSize: descFontSize },
      "start",
    );
  }

  return draw.node as SVGSVGElement;
}
