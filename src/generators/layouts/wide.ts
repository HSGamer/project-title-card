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

  // --------------------------------------------------------------------------
  // Variant 1: SPLIT (Two-tone side panel for logo + content panel)
  // --------------------------------------------------------------------------
  if (variant === "split") {
    const isRight = options.imagePosition === "right";
    const splitRatio = 0.32;
    const panelWidth = Math.round((width - 2 * margin) * splitRatio);
    const splitX = isRight ? width - margin - panelWidth : margin + panelWidth;
    const bgClipId = `cardBgClip_${width}_${height}_${margin}_${radius}`;

    // Side panel background clipped inside card border
    const panelX = isRight ? splitX : margin;
    draw
      .rect(panelWidth, height - 2 * margin)
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
      const panelImgSize = Math.min(options.image.size || 160, panelWidth - 40, height - 2 * margin - 40);
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

    // Render Title & Description in main panel
    const textX = isRight ? margin + 35 : splitX + 35;
    const titleY = 95;
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

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 2: CENTERED
  // --------------------------------------------------------------------------
  if (variant === "centered") {
    const smallImg = Math.min(options.image.size || 90, 95);
    const imgX = (width - smallImg) / 2;
    const imgY = margin + 18;

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

    const centeredTitleSize = Math.min(titleFontSize, 36);
    const centeredDescSize = Math.min(descFontSize, 20);
    const titleY = hasImage ? imgY + smallImg + 32 : margin + 85;

    renderTitle(
      draw,
      options.title,
      width / 2,
      titleY,
      { ...options.titleFont, fontSize: centeredTitleSize },
      "middle",
    );

    const descY = titleY + centeredTitleSize + 12;
    renderMultilineDescription(
      draw,
      options.description,
      width / 2,
      descY,
      { ...options.descriptionFont, fontSize: centeredDescSize },
      "middle",
    );

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 3: MINIMAL (Vertical divider between logo and text)
  // --------------------------------------------------------------------------
  if (variant === "minimal") {
    const isRight = options.imagePosition === "right";

    if (hasImage) {
      const minImgSize = Math.min(options.image.size || 160, height - 2 * margin - 40);
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
      const titleY = 95;
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
      renderTitle(draw, options.title, margin + 40, 100, { ...options.titleFont, fontSize: titleFontSize }, "start");
      const descY = 100 + titleFontSize + 14;
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
  // Variant 4: BADGE (Capsule pill container)
  // --------------------------------------------------------------------------
  if (variant === "badge") {
    const isRight = options.imagePosition === "right";
    const badgeImgSize = Math.min(options.image.size || 150, height - 2 * margin - 40);

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
      const titleY = 95;
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
      renderTitle(draw, options.title, width / 2, 100, { ...options.titleFont, fontSize: titleFontSize }, "middle");
      const descY = 100 + titleFontSize + 14;
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
  // Variant 5: STANDARD (Classic horizontal default)
  // --------------------------------------------------------------------------
  const stdImgSize = Math.min(options.image.size || 170, height - 2 * margin - 35);

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
    renderTitle(draw, options.title, margin + 35, 95, { ...options.titleFont, fontSize: titleFontSize }, "start");
    const descY = 95 + titleFontSize + 14;
    renderMultilineDescription(
      draw,
      options.description,
      margin + 35,
      descY,
      { ...options.descriptionFont, fontSize: descFontSize },
      "start",
    );
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
      renderTitle(draw, options.title, textX, 95, { ...options.titleFont, fontSize: titleFontSize }, "start");
      const descY = 95 + titleFontSize + 14;
      renderMultilineDescription(
        draw,
        options.description,
        textX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "start",
      );
    } else {
      renderTitle(draw, options.title, margin + 40, 100, { ...options.titleFont, fontSize: titleFontSize }, "start");
      const descY = 100 + titleFontSize + 14;
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
