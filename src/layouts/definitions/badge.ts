import { z } from "zod";
import {
  BaseCardOptionsSchema,
  CardOptions,
  IconPositionSchema,
  StatusPositionSchema,
} from "../../types.ts";
import { LayoutDefinition } from "../types.ts";
import { getStandardCardFields } from "../common-fields.ts";
import { COLOR_SWATCHES } from "../../data/suggestions.ts";
import { getCardDimensions } from "../../utils/dimensions.ts";
import { createBaseSvg, renderPanelBackground } from "../../generators/svg-base.ts";
import { renderImage, renderTitle } from "../../generators/elements.ts";

export const BadgeVariantSchema = z.enum([
  "standard",
  "pill",
  "split",
  "status",
  "outline",
]);
export type BadgeVariant = z.infer<typeof BadgeVariantSchema>;

export const BadgeStatusStyleSchema = z.enum(["pill", "dot"]);
export type BadgeStatusStyle = z.infer<typeof BadgeStatusStyleSchema>;

export const BadgeCardOptionsSchema = BaseCardOptionsSchema.extend({
  generateType: z.literal("badge"),
  badgeVariant: BadgeVariantSchema.optional().describe("Badge visual variant"),
  badgeWidth: z.number().describe("Badge width in px"),
  badgeHeight: z.number().describe("Badge height in px"),
  badgeAutoSize: z
    .boolean()
    .optional()
    .describe("Automatically compute badge width"),
  iconPosition: IconPositionSchema.describe("Icon position"),
  badgeLabel: z.string().optional().describe("Split badge left label text"),
  labelColor: z.string().optional().describe("Split badge label text color"),
  splitPosition: z.number().optional().describe("Split divider position in px"),
  statusText: z
    .string()
    .optional()
    .describe("Status text (for status badge variant)"),
  statusColor: z.string().optional().describe("Status indicator color"),
  statusStyle: BadgeStatusStyleSchema.optional().describe(
    "Status indicator shape style",
  ),
  statusPosition: StatusPositionSchema.optional().describe(
    "Status indicator position",
  ),
});
export type BadgeCardOptions = z.infer<typeof BadgeCardOptionsSchema>;

export const defaultBadgeOptions: BadgeCardOptions = {
  generateType: "badge",
  badgeVariant: "standard",
  title: "MaskedGUI",
  badgeWidth: 400,
  badgeHeight: 120,
  badgeAutoSize: false,
  iconPosition: "left",
  badgeLabel: "BUILD",
  labelColor: "#94a3b8",
  splitPosition: 0,
  statusText: "OPERATIONAL",
  statusColor: "#10b981",
  statusStyle: "pill",
  statusPosition: "right",
  verticalAlign: "middle",
  verticalOffset: 0,
  horizontalOffset: 0,
  image: {
    url:
      "https://raw.githubusercontent.com/BetterGUI-MC/MaskedGUI/master/.github/image/logo.svg",
    shape: "rounded",
    size: 70,
    show: true,
    verticalAlign: "middle",
    verticalOffset: 0,
    horizontalOffset: 0,
  },
  background: {
    type: "solid",
    color: "#0f172a",
    gradientStart: "#ea580c",
    gradientEnd: "#7c3aed",
    gradientDirection: "to-br",
    opacity: 1,
  },
  splitBackground: {
    type: "solid",
    color: "#1e293b",
    gradientStart: "#1e293b",
    gradientEnd: "#0f172a",
    gradientDirection: "to-br",
    opacity: 1,
  },
  border: {
    color: "#334155",
    width: 2,
    style: "solid",
    radius: 14,
    margin: 8,
    shadow: "soft",
  },
  titleFont: {
    color: "#f8fafc",
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: "800",
    fontSize: 32,
    letterSpacing: 0,
    uppercase: false,
  },
};

export function calculateAutoBadgeDimensions(options: BadgeCardOptions): {
  width: number;
  height: number;
} {
  const variant = options.badgeVariant || "standard";
  const autoHeight = options.badgeHeight || 120;
  const margin = options.border?.margin ?? 8;
  const titleText = options.title || "Untitled";
  const titleFontSize = Math.min(options.titleFont?.fontSize || 32, 48);
  const letterSpacing = options.titleFont?.letterSpacing || 0;

  const titleWidth = Math.round(
    titleText.length * (titleFontSize * 0.62) +
      (titleText.length - 1) * letterSpacing,
  );

  const hasImg = Boolean(
    options.image?.show && options.image?.url && options.iconPosition !== "none",
  );
  const imgSize = hasImg
    ? Math.min(options.image?.size || 70, autoHeight - 20)
    : 0;
  const imgSpacing = hasImg ? imgSize + 20 : 0;

  let autoWidth: number;

  if (variant === "split") {
    const labelText = options.badgeLabel || "LABEL";
    const labelFontSize = Math.min(
      Math.max(12, Math.round(titleFontSize * 0.75)),
      32,
    );
    const labelWidth = Math.round(labelText.length * (labelFontSize * 0.65));
    const labelColWidth = Math.max(70, labelWidth + 36);
    autoWidth = Math.round(
      labelColWidth + imgSpacing + titleWidth + 48 + margin * 2,
    );
  } else if (variant === "status") {
    const statusText = options.statusText || "STATUS";
    const statusStyle = options.statusStyle || "pill";
    const statusChipWidth = statusStyle === "pill"
      ? Math.round(statusText.length * 8.5) + 38
      : Math.round(statusText.length * 9) + 26;
    autoWidth = Math.round(
      imgSpacing + titleWidth + 24 + statusChipWidth + 36 + margin * 2,
    );
  } else {
    autoWidth = Math.round(imgSpacing + titleWidth + 44 + margin * 2);
  }

  return {
    width: Math.max(120, Math.min(2400, autoWidth)),
    height: autoHeight,
  };
}

export function generateBadge(options: CardOptions): SVGSVGElement {
  const { width, height } = getCardDimensions(options);
  const variant = options.badgeVariant || "standard";
  const margin = options.border.margin ?? 8;
  const centerY = height / 2;

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

  const textOffsetY = options.verticalOffset || 0;
  const textOffsetX = options.horizontalOffset || 0;
  const imgOffsetY = options.image.verticalOffset || 0;
  const imgOffsetX = options.image.horizontalOffset || 0;

  const hasImage = Boolean(
    options.image.show && options.image.url && options.iconPosition !== "none",
  );
  const imgSize = Math.max(
    14,
    Math.min(options.image.size || 60, height - 2 * margin - 12),
  );
  const imgVAlign = options.image.verticalAlign || "middle";
  let imgY = (height - imgSize) / 2;
  if (imgVAlign === "top") {
    imgY = margin + 6;
  } else if (imgVAlign === "bottom") {
    imgY = height - margin - 6 - imgSize;
  }
  imgY += imgOffsetY;

  const titleFontSize = options.titleFont.fontSize ||
    Math.min(Math.max(14, height * 0.32), 48);

  // --------------------------------------------------------------------------
  // Variant 1: SPLIT BADGE
  // --------------------------------------------------------------------------
  if (variant === "split") {
    const labelText = options.badgeLabel || "BUILD";
    const valueText = options.title || "PASSING";
    const labelColor = options.labelColor || "#94a3b8";
    const labelFontSize = Math.min(titleFontSize * 0.88, Math.round(height * 0.32));

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

    const splitBg = options.splitBackground || {
      type: "solid",
      color: "#1e293b",
      gradientStart: "#1e293b",
      gradientEnd: "#0f172a",
      gradientDirection: "to-br",
      opacity: 1,
    };
    renderPanelBackground(
      draw,
      splitBg,
      {
        x: margin,
        y: margin,
        width: splitX - margin,
        height: height - 2 * margin,
      },
      bgClipId,
      "badgeSplitBg",
    );

    draw
      .line(splitX, margin, splitX, height - margin)
      .stroke({ color: "#000000", width: 1, opacity: 0.35 });
    draw
      .line(splitX + 1, margin, splitX + 1, height - margin)
      .stroke({ color: "#ffffff", width: 1, opacity: 0.12 });

    const leftPanelW = splitX - margin;
    const cleanLabel = (labelText || "").trim();

    if (hasImage && options.iconPosition === "left") {
      const leftImgSize = Math.min(imgSize, leftPanelW - 16, height - 2 * margin - 16);
      const leftImgY = (height - leftImgSize) / 2 + imgOffsetY;

      if (cleanLabel) {
        const imgX = margin + 10 + imgOffsetX;
        renderImage(
          draw,
          options.image,
          { x: imgX, y: leftImgY },
          leftImgSize,
          leftImgSize,
          "badgeSplitLogo",
        );

        const textX = imgX + leftImgSize + 8 + textOffsetX;
        renderTitle(
          draw,
          cleanLabel,
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
        // Logo is the sole occupant of the left split panel: Center it!
        const imgX = margin + (leftPanelW - leftImgSize) / 2 + imgOffsetX;
        renderImage(
          draw,
          options.image,
          { x: imgX, y: leftImgY },
          leftImgSize,
          leftImgSize,
          "badgeSplitLogo",
        );
      }
    } else if (cleanLabel) {
      renderTitle(
        draw,
        cleanLabel,
        (margin + splitX) / 2 + textOffsetX,
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
  // Variant 2: STATUS BADGE
  // --------------------------------------------------------------------------
  if (variant === "status") {
    const statusColor = options.statusColor || "#10b981";
    const statusText = (options.statusText || "OPERATIONAL").trim();
    const statusStyle = options.statusStyle || "pill";
    const statusPosition = options.statusPosition || "right";

    if (statusStyle === "pill") {
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

      const pillTextX = pillX + textStartOffset;
      draw
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
      const imgX = width - margin - 14 - imgSize + imgOffsetX;
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        imgSize,
        imgSize,
        "badgeLogo",
      );

      const textX = margin + 18 + textOffsetX;
      renderTitle(
        draw,
        options.title,
        textX,
        centerY + textOffsetY,
        { ...options.titleFont, fontSize: titleFontSize },
        "start",
        "central",
      );
    } else {
      const imgX = margin + 14 + imgOffsetX;
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        imgSize,
        imgSize,
        "badgeLogo",
      );

      const textX = margin + 14 + imgSize + 14 + textOffsetX;
      renderTitle(
        draw,
        options.title,
        textX,
        centerY + textOffsetY,
        { ...options.titleFont, fontSize: titleFontSize },
        "start",
        "central",
      );
    }
  } else {
    renderTitle(
      draw,
      options.title,
      width / 2 + textOffsetX,
      centerY + textOffsetY,
      { ...options.titleFont, fontSize: titleFontSize },
      "middle",
      "central",
    );
  }

  return draw.node as SVGSVGElement;
}

export const badgeLayout: LayoutDefinition<BadgeCardOptions> = {
  id: "badge",
  name: "Badge / Shield",
  description:
    "Compact badge/shield format for repository status, metrics, and npm versions",
  category: "Shield",
  supportsDescription: false,
  schema: BadgeCardOptionsSchema,
  defaultOptions: defaultBadgeOptions,
  getDimensions: (opts) =>
    opts.badgeAutoSize
      ? calculateAutoBadgeDimensions(opts)
      : { width: opts.badgeWidth || 400, height: opts.badgeHeight || 120 },
  getDimensionsLabel: (opts) =>
    opts.badgeAutoSize
      ? `Auto (${calculateAutoBadgeDimensions(opts).width} × ${
        calculateAutoBadgeDimensions(opts).height
      } px)`
      : `${opts.badgeWidth || 400} × ${opts.badgeHeight || 120} px`,
  generate: generateBadge,
  fields: [
    {
      key: "badgeVariant",
      label: "Badge Visual Variant",
      type: "segmented",
      group: "Card Layout & Content",
      options: [
        { label: "Standard", value: "standard" },
        { label: "Pill", value: "pill" },
        { label: "Split", value: "split" },
        { label: "Status", value: "status" },
        { label: "Outline", value: "outline" },
      ],
    },
    {
      key: "iconPosition",
      label: "Icon Placement",
      type: "segmented",
      group: "Card Layout & Content",
      options: [
        { label: "Icon Left", value: "left" },
        { label: "Icon Right", value: "right" },
        { label: "No Icon", value: "none" },
      ],
    },
    {
      key: "badgeAutoSize",
      label: "Auto-Fit Width",
      description: "Dynamically calculate badge width from content text length",
      type: "boolean",
      group: "Card Layout & Content",
    },
    {
      key: "badgeWidth",
      label: "Badge Width",
      type: "slider",
      min: 160,
      max: 1200,
      step: 10,
      unit: "px",
      quickValues: [240, 320, 400, 600, 800],
      group: "Card Layout & Content",
      visibleIf: (opts) => !opts.badgeAutoSize,
    },
    {
      key: "badgeHeight",
      label: "Badge Height",
      type: "slider",
      min: 40,
      max: 300,
      step: 10,
      unit: "px",
      quickValues: [60, 80, 100, 120, 160],
      group: "Card Layout & Content",
    },
    // Split Badge Group
    {
      key: "badgeLabel",
      label: "Left Label Text",
      type: "text",
      group: "Split / Shields Settings",
      placeholder: "e.g. BUILD, VERSION, NPM",
      visibleIf: (opts) => opts.badgeVariant === "split",
    },
    {
      key: "labelColor",
      label: "Label Text Color",
      type: "color",
      group: "Split / Shields Settings",
      fallback: "#94a3b8",
      swatches: COLOR_SWATCHES,
      visibleIf: (opts) => opts.badgeVariant === "split",
    },
    {
      key: "splitPosition",
      label: "Split Divider Position",
      type: "slider",
      min: 0,
      max: 80,
      step: 5,
      unit: "%",
      quickValues: [0, 25, 33, 50],
      group: "Split / Shields Settings",
      visibleIf: (opts) => opts.badgeVariant === "split",
    },
    // Status Badge Group
    {
      key: "statusText",
      label: "Status Text",
      type: "text",
      group: "Status Indicator Settings",
      placeholder: "e.g. OPERATIONAL, PASSING",
      visibleIf: (opts) => opts.badgeVariant === "status",
    },
    {
      key: "statusColor",
      label: "Status Indicator Color",
      type: "color",
      group: "Status Indicator Settings",
      fallback: "#10b981",
      swatches: COLOR_SWATCHES,
      visibleIf: (opts) => opts.badgeVariant === "status",
    },
    {
      key: "statusStyle",
      label: "Status Indicator Style",
      type: "segmented",
      options: [
        { label: "Pill Chip", value: "pill" },
        { label: "Dot Light", value: "dot" },
      ],
      group: "Status Indicator Settings",
      visibleIf: (opts) => opts.badgeVariant === "status",
    },
    {
      key: "statusPosition",
      label: "Status Position",
      type: "segmented",
      options: [
        { label: "Right", value: "right" },
        { label: "Left", value: "left" },
      ],
      group: "Status Indicator Settings",
      visibleIf: (opts) => opts.badgeVariant === "status",
    },
    ...getStandardCardFields({
      supportsDescription: false,
      defaultImageSize: 70,
    }),
  ],
  normalize: (raw, baseDefault, helpers) => {
    const validVariants = ["standard", "pill", "split", "status", "outline"];
    const badgeVariant: BadgeVariant = validVariants.includes(
        String(raw.badgeVariant),
      )
      ? (raw.badgeVariant as BadgeVariant)
      : "standard";

    const iconPosition =
      raw.iconPosition === "right" || raw.iconPosition === "none"
        ? raw.iconPosition
        : "left";
    const badgeWidth = typeof raw.badgeWidth === "number"
      ? raw.badgeWidth
      : baseDefault.badgeWidth;
    const badgeHeight = typeof raw.badgeHeight === "number"
      ? raw.badgeHeight
      : baseDefault.badgeHeight;
    const badgeAutoSize = typeof raw.badgeAutoSize === "boolean"
      ? raw.badgeAutoSize
      : false;

    return {
      ...baseDefault,
      generateType: "badge",
      badgeVariant,
      iconPosition,
      badgeWidth,
      badgeHeight,
      badgeAutoSize,
      badgeLabel: typeof raw.badgeLabel === "string"
        ? raw.badgeLabel
        : baseDefault.badgeLabel,
      labelColor: helpers.normalizeColor(
        raw.labelColor as string,
        baseDefault.labelColor || "#94a3b8",
      ),
      splitPosition: typeof raw.splitPosition === "number"
        ? raw.splitPosition
        : 0,
      statusText: typeof raw.statusText === "string"
        ? raw.statusText
        : baseDefault.statusText,
      statusColor: helpers.normalizeColor(
        raw.statusColor as string,
        baseDefault.statusColor || "#10b981",
      ),
      statusStyle: raw.statusStyle === "dot" ? "dot" : "pill",
      statusPosition: raw.statusPosition === "left" ? "left" : "right",
      title: typeof raw.title === "string" ? raw.title : baseDefault.title,
      verticalAlign:
        raw.verticalAlign === "top" || raw.verticalAlign === "bottom"
          ? raw.verticalAlign
          : "middle",
      verticalOffset: typeof raw.verticalOffset === "number"
        ? raw.verticalOffset
        : 0,
      horizontalOffset: typeof raw.horizontalOffset === "number"
        ? raw.horizontalOffset
        : 0,
      background: helpers.normalizeBackground(
        raw.background,
        baseDefault.background,
      ),
      splitBackground: raw.splitBackground
        ? helpers.normalizeBackground(
          raw.splitBackground,
          baseDefault.splitBackground || baseDefault.background,
        )
        : baseDefault.splitBackground,
      border: helpers.normalizeBorder(raw.border, baseDefault.border),
      titleFont: helpers.normalizeTitleFont(
        raw.titleFont,
        baseDefault.titleFont,
      ),
      image: helpers.normalizeImage(raw.image, baseDefault.image),
    };
  },
};
