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
  const { draw, radius } = createBaseSvg(width, height, options, `Card (${variant})`);

  const hasImage = Boolean(options.image.show && options.image.url);
  const titleFontSize = Math.min(options.titleFont.fontSize || 34, 40);
  const descFontSize = Math.min(options.descriptionFont.fontSize || 20, 24);

  // --------------------------------------------------------------------------
  // Variant 1: HERO
  // --------------------------------------------------------------------------
  if (variant === "hero") {
    const maxHeroImg = Math.min(height * 0.38, width - 2 * margin - 60);
    const heroImgSize = Math.min(options.image.size || 220, maxHeroImg);
    const imgX = (width - heroImgSize) / 2;
    const imgY = margin + 24;

    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        heroImgSize,
        heroImgSize,
        "cardHeroLogo",
      );
    }

    const titleY = hasImage ? imgY + heroImgSize + 36 : margin + 140;
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
  // Variant 2: COMPACT (Header row with logo & title, divider, full-width desc)
  // --------------------------------------------------------------------------
  if (variant === "compact") {
    const headerImgSize = Math.min(options.image.size || 80, 80);
    const headerY = margin + 22;
    let headerTextX = margin + 20;

    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: margin + 20, y: headerY },
        headerImgSize,
        headerImgSize,
        "cardCompactLogo",
      );
      headerTextX = margin + 20 + headerImgSize + 16;
    }

    const compactTitleSize = Math.min(titleFontSize, 26);
    const headerTitleY = hasImage ? headerY + headerImgSize / 2 : headerY + 22;
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
    const dividerY = hasImage ? headerY + headerImgSize + 18 : headerY + 50;
    draw
      .line(margin + 18, dividerY, width - margin - 18, dividerY)
      .stroke({
        color: options.border.color || "#334155",
        width: 1.5,
        opacity: 0.4,
      });

    const descY = dividerY + 24;
    renderMultilineDescription(
      draw,
      options.description,
      margin + 20,
      descY,
      { ...options.descriptionFont, fontSize: descFontSize },
      "start",
    );

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 3: MINIMAL (Top accent indicator stripe, spacious typography)
  // --------------------------------------------------------------------------
  if (variant === "minimal") {
    // Top accent bar
    const accentWidth = Math.min(60, Math.round(width * 0.16));
    draw
      .rect(accentWidth, 4)
      .move((width - accentWidth) / 2, margin + 14)
      .radius(2)
      .fill(options.border.color || "#3b82f6")
      .opacity(0.8);

    const minImgSize = Math.min(options.image.size || 150, 160);
    const imgX = (width - minImgSize) / 2;
    const imgY = margin + 36;

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

    const titleY = hasImage ? imgY + minImgSize + 36 : margin + 120;
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
  // Variant 4: SPLIT (Two-tone vertical panel for logo + content)
  // --------------------------------------------------------------------------
  if (variant === "split") {
    const splitY = margin + Math.round((height - 2 * margin) * 0.4);
    const bgClipId = `cardBgClip_${width}_${height}_${margin}_${radius}`;

    // Top logo compartment background
    draw
      .rect(width - 2 * margin, splitY - margin)
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

    const splitImgSize = Math.min(options.image.size || 160, splitY - margin - 32);
    const imgX = (width - splitImgSize) / 2;
    const imgY = margin + (splitY - margin - splitImgSize) / 2;

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

    const titleY = splitY + 40;
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
  // Variant 5: STANDARD (Classic default)
  // --------------------------------------------------------------------------
  const stdImgSize = Math.min(options.image.size || 220, Math.round(height * 0.38), width - 2 * margin - 40);

  if (options.textAlign === "left") {
    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: margin + 25, y: margin + 28 },
        stdImgSize,
        stdImgSize,
        "cardLogo",
      );
    }
    const titleY = hasImage ? margin + 28 + stdImgSize + 36 : margin + 130;
    renderTitle(draw, options.title, margin + 25, titleY, { ...options.titleFont, fontSize: titleFontSize }, "start");
    const descY = titleY + titleFontSize + 14;
    renderMultilineDescription(
      draw,
      options.description,
      margin + 25,
      descY,
      { ...options.descriptionFont, fontSize: descFontSize },
      "start",
    );
  } else {
    // Center (default)
    const imgX = (width - stdImgSize) / 2;
    const imgY = margin + 28;
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
    const titleY = hasImage ? imgY + stdImgSize + 36 : margin + 140;
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
  }

  return draw.node as SVGSVGElement;
}
