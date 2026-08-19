import { BadgeCardOptions } from "../../types.ts";
import { getCardDimensions } from "../../utils/dimensions.ts";
import { createBaseSvg } from "../svg-base.ts";
import { renderImage, renderTitle } from "../elements.ts";

export function generateBadge(options: BadgeCardOptions): SVGSVGElement {
  const { width, height } = getCardDimensions(options);
  const variant = options.badgeVariant || "standard";
  const margin = options.border.margin ?? 8;
  const centerY = height / 2;

  // Custom pill radius calculation
  const pillRadius = variant === "pill"
    ? Math.round((height - 2 * margin) / 2)
    : undefined;

  const { draw, radius } = createBaseSvg(
    width,
    height,
    options,
    `Badge (${variant})`,
    false,
    pillRadius,
  );

  const hasImage = Boolean(
    options.image.show && options.image.url && options.iconPosition !== "none",
  );
  const imgSize = Math.max(
    14,
    Math.min(options.image.size || 60, height - 2 * margin - 12),
  );
  const imgY = (height - imgSize) / 2;

  const titleFontSize = options.titleFont.fontSize ||
    Math.min(Math.max(14, height * 0.32), 48);

  // --------------------------------------------------------------------------
  // Variant 1: SPLIT BADGE (Shields.io / Authentic Two-Tone)
  // --------------------------------------------------------------------------
  if (variant === "split") {
    const labelText = options.badgeLabel || "BUILD";
    const valueText = options.title || "PASSING";
    const labelColor = options.labelColor || "#94a3b8";
    const labelFontSize = Math.min(titleFontSize * 0.88, Math.round(height * 0.32));

    // Calculate dynamic split boundary
    let splitX: number;
    if (options.splitPosition && options.splitPosition > 0) {
      splitX = margin + Math.round((width - 2 * margin) * (options.splitPosition / 100));
    } else {
      const labelCharW = labelFontSize * 0.62;
      const valueCharW = titleFontSize * 0.62;
      const leftPad = (hasImage && options.iconPosition === "left" ? imgSize + 16 : 0) + 32;
      const rightPad = (hasImage && options.iconPosition === "right" ? imgSize + 16 : 0) + 32;
      const leftEst = leftPad + labelText.length * labelCharW;
      const rightEst = rightPad + valueText.length * valueCharW;
      const ratio = leftEst / (leftEst + rightEst);
      splitX = margin + Math.round((width - 2 * margin) * Math.max(0.22, Math.min(0.78, ratio)));
    }

    const bgClipId = `cardBgClip_${width}_${height}_${margin}_${radius}`;

    // Left label compartment background (clipped to card's outer radius)
    draw
      .rect(splitX - margin, height - 2 * margin)
      .move(margin, margin)
      .attr({
        fill: options.labelBackground || "#1e293b",
        "clip-path": `url(#${bgClipId})`,
      });

    // Inset vertical seam line
    draw
      .line(splitX, margin, splitX, height - margin)
      .stroke({ color: "#000000", width: 1, opacity: 0.35 });
    draw
      .line(splitX + 1, margin, splitX + 1, height - margin)
      .stroke({ color: "#ffffff", width: 1, opacity: 0.12 });

    // Render Left Compartment Content (Logo + Label)
    if (hasImage && options.iconPosition === "left") {
      const leftImgSize = Math.min(imgSize, splitX - margin - 20);
      const imgX = margin + 10;
      const leftImgY = (height - leftImgSize) / 2;

      renderImage(
        draw,
        options.image,
        { x: imgX, y: leftImgY },
        leftImgSize,
        leftImgSize,
        "badgeSplitLogo",
      );

      const textX = imgX + leftImgSize + 8;
      renderTitle(
        draw,
        labelText,
        textX,
        centerY,
        {
          ...options.titleFont,
          fontSize: labelFontSize,
          color: labelColor,
          fontWeight: "700",
        },
        "start",
        "central",
      );
    } else {
      renderTitle(
        draw,
        labelText,
        (margin + splitX) / 2,
        centerY,
        {
          ...options.titleFont,
          fontSize: labelFontSize,
          color: labelColor,
          fontWeight: "700",
        },
        "middle",
        "central",
      );
    }

    // Render Right Compartment Content (Value + optional Logo)
    if (hasImage && options.iconPosition === "right") {
      const rightImgX = width - margin - 10 - imgSize;
      renderImage(
        draw,
        options.image,
        { x: rightImgX, y: imgY },
        imgSize,
        imgSize,
        "badgeSplitRightLogo",
      );

      const titleX = (splitX + rightImgX) / 2;
      renderTitle(
        draw,
        valueText,
        titleX,
        centerY,
        { ...options.titleFont, fontSize: titleFontSize },
        "middle",
        "central",
      );
    } else {
      const titleX = (splitX + width - margin) / 2;
      renderTitle(
        draw,
        valueText,
        titleX,
        centerY,
        { ...options.titleFont, fontSize: titleFontSize },
        "middle",
        "central",
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 2: STATUS BADGE (Modern SaaS Status Pill / Banner)
  // --------------------------------------------------------------------------
  if (variant === "status") {
    const statusColor = options.statusColor || "#10b981";
    const statusText = (options.statusText || "OPERATIONAL").trim();
    const statusStyle = options.statusStyle || "pill";
    const statusPosition = options.statusPosition || "right";

    if (statusStyle === "pill") {
      // Modern SaaS Status Pill Chip
      const chipHeight = Math.max(26, Math.min(38, Math.round((height - 2 * margin) * 0.44)));
      const chipY = centerY - chipHeight / 2;
      const chipRadius = Math.round(chipHeight / 2);
      const chipFontSize = Math.max(10, Math.min(13, Math.round(chipHeight * 0.42)));
      const dotRadius = 3.5;
      const dotCenterOffset = 12 + dotRadius;
      const textStartOffset = dotCenterOffset + dotRadius + 7;
      const textWidth = Math.round(statusText.length * (chipFontSize * 0.65));
      const chipWidth = textStartOffset + textWidth + 12;

      let pillX: number;
      let titleStartX: number;

      if (statusPosition === "right") {
        // Status pill on the right side
        if (hasImage && options.iconPosition === "right") {
          const imgX = width - margin - 12 - imgSize;
          renderImage(
            draw,
            options.image,
            { x: imgX, y: imgY },
            imgSize,
            imgSize,
            "badgeStatusLogo",
          );
          pillX = imgX - 12 - chipWidth;
          titleStartX = margin + 18;
        } else if (hasImage && options.iconPosition === "left") {
          const imgX = margin + 12;
          renderImage(
            draw,
            options.image,
            { x: imgX, y: imgY },
            imgSize,
            imgSize,
            "badgeStatusLogo",
          );
          titleStartX = imgX + imgSize + 14;
          pillX = width - margin - 14 - chipWidth;
        } else {
          titleStartX = margin + 18;
          pillX = width - margin - 14 - chipWidth;
        }
      } else {
        // Status pill on the left side
        if (hasImage && options.iconPosition === "left") {
          const imgX = margin + 12;
          renderImage(
            draw,
            options.image,
            { x: imgX, y: imgY },
            imgSize,
            imgSize,
            "badgeStatusLogo",
          );
          pillX = imgX + imgSize + 12;
          titleStartX = pillX + chipWidth + 14;
        } else if (hasImage && options.iconPosition === "right") {
          pillX = margin + 14;
          titleStartX = pillX + chipWidth + 14;
          const imgX = width - margin - 12 - imgSize;
          renderImage(
            draw,
            options.image,
            { x: imgX, y: imgY },
            imgSize,
            imgSize,
            "badgeStatusLogo",
          );
        } else {
          pillX = margin + 14;
          titleStartX = pillX + chipWidth + 14;
        }
      }

      // Draw Status Pill Container
      draw
        .rect(chipWidth, chipHeight)
        .move(pillX, chipY)
        .radius(chipRadius)
        .attr({
          fill: statusColor,
          "fill-opacity": 0.14,
          stroke: statusColor,
          "stroke-width": 1.5,
          "stroke-opacity": 0.4,
        });

      // Status Pill Glowing Indicator Dot
      const dotX = pillX + dotCenterOffset;
      draw
        .circle(dotRadius * 2.8)
        .center(dotX, centerY)
        .fill(statusColor)
        .opacity(0.3);

      draw
        .circle(dotRadius * 1.5)
        .center(dotX, centerY)
        .fill(statusColor)
        .opacity(1);

      // Status Text inside Pill (properly centered with central dominant-baseline)
      const pillTextX = pillX + textStartOffset;
      const statusLabel = draw
        .text(statusText)
        .font({
          family: options.titleFont.fontFamily || "Inter, sans-serif",
          size: chipFontSize,
          weight: "800",
        })
        .attr({
          x: pillTextX,
          y: centerY,
          fill: statusColor,
          "dominant-baseline": "central",
          "alignment-baseline": "central",
          "letter-spacing": "0.5px",
        });

      // Render Title Text with dynamic fit
      const availableTitleWidth = statusPosition === "right"
        ? Math.max(40, pillX - titleStartX - 14)
        : Math.max(40, (hasImage && options.iconPosition === "right" ? width - margin - 12 - imgSize : width - margin - 14) - titleStartX);
      const estTitleWidth = options.title.length * (titleFontSize * 0.6);
      const fittedTitleSize = estTitleWidth > availableTitleWidth
        ? Math.max(12, Math.round(titleFontSize * (availableTitleWidth / estTitleWidth)))
        : titleFontSize;

      renderTitle(
        draw,
        options.title,
        titleStartX,
        centerY,
        { ...options.titleFont, fontSize: fittedTitleSize },
        "start",
        "central",
      );

      return draw.node as SVGSVGElement;
    } else {
      // Classic Dot Indicator + Status Text & Title
      const dotRadius = 4.5;
      const statusFontSize = Math.max(12, Math.min(16, Math.round((height - 2 * margin) * 0.24)));
      const textWidth = Math.round(statusText.length * (statusFontSize * 0.65));
      const groupWidth = dotRadius * 2 + 8 + textWidth;

      let titleStartX: number;
      let dotX: number;
      let statusTextX: number;

      if (statusPosition === "right") {
        if (hasImage && options.iconPosition === "right") {
          const imgX = width - margin - 12 - imgSize;
          renderImage(
            draw,
            options.image,
            { x: imgX, y: imgY },
            imgSize,
            imgSize,
            "badgeStatusLogo",
          );
          const groupX = imgX - 14 - groupWidth;
          dotX = groupX + dotRadius;
          statusTextX = dotX + dotRadius + 8;
          titleStartX = margin + 18;
        } else if (hasImage && options.iconPosition === "left") {
          const imgX = margin + 12;
          renderImage(
            draw,
            options.image,
            { x: imgX, y: imgY },
            imgSize,
            imgSize,
            "badgeStatusLogo",
          );
          titleStartX = imgX + imgSize + 14;
          const groupX = width - margin - 16 - groupWidth;
          dotX = groupX + dotRadius;
          statusTextX = dotX + dotRadius + 8;
        } else {
          titleStartX = margin + 18;
          const groupX = width - margin - 16 - groupWidth;
          dotX = groupX + dotRadius;
          statusTextX = dotX + dotRadius + 8;
        }
      } else {
        if (hasImage && options.iconPosition === "left") {
          const imgX = margin + 12;
          renderImage(
            draw,
            options.image,
            { x: imgX, y: imgY },
            imgSize,
            imgSize,
            "badgeStatusLogo",
          );
          dotX = imgX + imgSize + 14 + dotRadius;
          statusTextX = dotX + dotRadius + 8;
          titleStartX = statusTextX + textWidth + 16;
        } else if (hasImage && options.iconPosition === "right") {
          dotX = margin + 16 + dotRadius;
          statusTextX = dotX + dotRadius + 8;
          titleStartX = statusTextX + textWidth + 16;
          const imgX = width - margin - 12 - imgSize;
          renderImage(
            draw,
            options.image,
            { x: imgX, y: imgY },
            imgSize,
            imgSize,
            "badgeStatusLogo",
          );
        } else {
          dotX = margin + 16 + dotRadius;
          statusTextX = dotX + dotRadius + 8;
          titleStartX = statusTextX + textWidth + 16;
        }
      }

      // Draw Glowing Dot
      draw
        .circle(dotRadius * 3)
        .center(dotX, centerY)
        .fill(statusColor)
        .opacity(0.25);

      draw
        .circle(dotRadius * 1.5)
        .center(dotX, centerY)
        .fill(statusColor)
        .opacity(1);

      // Draw Status Text
      draw
        .text(statusText)
        .font({
          family: options.titleFont.fontFamily || "Inter, sans-serif",
          size: statusFontSize,
          weight: "800",
        })
        .attr({
          x: statusTextX,
          y: centerY,
          fill: statusColor,
          "dominant-baseline": "central",
          "alignment-baseline": "central",
          "letter-spacing": "0.5px",
        });

      // Draw Title Text with boundary fitting
      const availableWidth = statusPosition === "right"
        ? Math.max(40, (dotX - dotRadius - 14) - titleStartX)
        : Math.max(40, (hasImage && options.iconPosition === "right" ? width - margin - 12 - imgSize : width - margin - 14) - titleStartX);
      const estTitleWidth = options.title.length * (titleFontSize * 0.6);
      const fittedTitleSize = estTitleWidth > availableWidth
        ? Math.max(12, Math.round(titleFontSize * (availableWidth / estTitleWidth)))
        : titleFontSize;

      renderTitle(
        draw,
        options.title,
        titleStartX,
        centerY,
        { ...options.titleFont, fontSize: fittedTitleSize },
        "start",
        "central",
      );

      return draw.node as SVGSVGElement;
    }
  }

  // --------------------------------------------------------------------------
  // Variant 3, 4, 5: STANDARD / PILL / OUTLINE BADGE
  // --------------------------------------------------------------------------
  if (hasImage) {
    if (options.iconPosition === "right") {
      const imgX = width - margin - 14 - imgSize;
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        imgSize,
        imgSize,
        "badgeLogo",
      );

      const textX = margin + 18;
      renderTitle(
        draw,
        options.title,
        textX,
        centerY,
        { ...options.titleFont, fontSize: titleFontSize },
        "start",
        "central",
      );
    } else {
      const imgX = margin + 14;
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        imgSize,
        imgSize,
        "badgeLogo",
      );

      const textX = imgX + imgSize + 14;
      renderTitle(
        draw,
        options.title,
        textX,
        centerY,
        { ...options.titleFont, fontSize: titleFontSize },
        "start",
        "central",
      );
    }
  } else {
    renderTitle(
      draw,
      options.title,
      width / 2,
      centerY,
      { ...options.titleFont, fontSize: titleFontSize },
      "middle",
      "central",
    );
  }

  return draw.node as SVGSVGElement;
}

