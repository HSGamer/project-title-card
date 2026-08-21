import { z } from "zod";
import {
  BaseCardOptionsSchema,
  CardOptions,
  DescriptionFontConfigSchema,
  TextAlignSchema,
} from "../../types.ts";
import { LayoutDefinition } from "../types.ts";
import { getStandardCardFields } from "../common-fields.ts";
import { getCardDimensions } from "../../utils/dimensions.ts";
import { createBaseSvg, renderPanelBackground } from "../../generators/svg-base.ts";
import {
  renderImage,
  renderMultilineDescription,
  renderTitle,
} from "../../generators/elements.ts";
import { computeVerticalStackPositions } from "../../generators/vertical-stack.ts";

export const CardVariantSchema = z.enum([
  "standard",
  "hero",
  "compact",
  "minimal",
  "split",
]);
export type CardVariant = z.infer<typeof CardVariantSchema>;

export const StandardCardOptionsSchema = BaseCardOptionsSchema.extend({
  generateType: z.literal("card"),
  cardVariant: CardVariantSchema.optional().describe(
    "Card visual layout variant",
  ),
  description: z.string().describe("Card description text"),
  descriptionFont: DescriptionFontConfigSchema,
  textAlign: TextAlignSchema.describe("Text alignment"),
});
export type StandardCardOptions = z.infer<typeof StandardCardOptionsSchema>;

export const defaultStandardOptions: StandardCardOptions = {
  generateType: "card",
  cardVariant: "standard",
  title: "MaskedGUI",
  description: "Fast • Lightweight • Type-Safe\nZero Dependencies",
  textAlign: "center",
  verticalAlign: "middle",
  verticalOffset: 0,
  horizontalOffset: 0,
  image: {
    url:
      "https://raw.githubusercontent.com/BetterGUI-MC/MaskedGUI/master/.github/image/logo.svg",
    shape: "rounded",
    size: 260,
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
    color: "#0b1329",
    gradientStart: "#0b1329",
    gradientEnd: "#1e293b",
    gradientDirection: "to-br",
    opacity: 1,
  },
  border: {
    color: "#334155",
    width: 2,
    style: "solid",
    radius: 16,
    margin: 10,
    shadow: "soft",
  },
  titleFont: {
    color: "#f8fafc",
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: "800",
    fontSize: 34,
    letterSpacing: 0,
    uppercase: false,
  },
  descriptionFont: {
    color: "#94a3b8",
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: "500",
    fontSize: 22,
    lineHeight: 1.3,
    opacity: 1,
  },
};

export function generateCard(options: CardOptions): SVGSVGElement {
  const { width, height } = getCardDimensions(options);
  const variant = options.cardVariant || "standard";
  const margin = options.border.margin ?? 10;
  const innerW = width - 2 * margin;
  const innerH = height - 2 * margin;
  const isLeft = options.textAlign === "left";
  const { draw, radius } = createBaseSvg(
    width,
    height,
    options,
    `Card (${variant})`,
  );

  const hasImage = Boolean(options.image.show && options.image.url);
  const titleFontSize = options.titleFont.fontSize || 34;
  const descFontSize = options.descriptionFont?.fontSize || 22;
  const lineHeight = options.descriptionFont?.lineHeight || 1.3;
  const vAlign = options.verticalAlign || "middle";
  const imgVAlign = options.image.verticalAlign || "middle";
  const textOffsetY = options.verticalOffset || 0;
  const textOffsetX = options.horizontalOffset || 0;
  const imgOffsetY = options.image.verticalOffset || 0;
  const imgOffsetX = options.image.horizontalOffset || 0;

  const description = options.description || "";
  const descLines = description
    ? description.split("\n").filter((l: string) => l.trim().length > 0)
    : [];
  const numLines = descLines.length;
  const gapTitleDesc = numLines > 0 ? 18 : 0;
  const descH = numLines > 0
    ? (numLines - 1) * (descFontSize * lineHeight) + descFontSize
    : 0;
  const textH = titleFontSize + (numLines > 0 ? gapTitleDesc + descH : 0);

  const computeStartY = (totalH: number, topPad = 24, bottomPad = 24) => {
    if (vAlign === "top") {
      return margin + topPad;
    }
    if (vAlign === "bottom") {
      return height - margin - bottomPad - totalH;
    }
    return margin + (innerH - totalH) / 2;
  };

  // --------------------------------------------------------------------------
  // Variant 1: HERO
  // --------------------------------------------------------------------------
  if (variant === "hero") {
    const heroImgSize = Math.min(
      options.image.size || 200,
      innerW - 40,
      innerH - 40,
    );
    const stagePad = 18;
    const stageW = innerW - 24;
    const stageH = hasImage ? heroImgSize + stagePad * 2 : 70;
    const stageX = (width - stageW) / 2;
    const gapStageTitle = 24;

    const pos = computeVerticalStackPositions({
      cardH: height,
      margin,
      topPad: 20,
      bottomPad: 20,
      minGap: gapStageTitle,
      gapTitleDesc,
      hasImage,
      imgSize: stageH,
      imgVAlign,
      textH,
      titleFontSize,
      descFontSize,
      vAlign,
    });

    const stageY = pos.imgY;
    const titleY = pos.titleY + textOffsetY;
    const descY = pos.descY + textOffsetY;

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
      titleY,
      { ...options.titleFont, fontSize: titleFontSize },
      textAnchor,
    );

    if (numLines > 0) {
      renderMultilineDescription(
        draw,
        description,
        textX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        textAnchor,
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 2: COMPACT
  // --------------------------------------------------------------------------
  if (variant === "compact") {
    const headerImgSize = Math.min(
      options.image.size || 80,
      innerW - 60,
      innerH - 60,
    );
    const compactTitleSize = Math.min(titleFontSize, 28);
    const headerH = hasImage
      ? Math.max(headerImgSize, compactTitleSize)
      : compactTitleSize;
    const dividerGap = 18;
    const descGap = numLines > 0 ? 22 : 0;
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
      : headerY + compactTitleSize * 0.85;

    renderTitle(
      draw,
      options.title,
      headerTextX,
      headerTitleY,
      { ...options.titleFont, fontSize: compactTitleSize },
      "start",
      hasImage ? "central" : undefined,
    );

    const dividerY = headerY + headerH + dividerGap;
    draw
      .line(margin + 18, dividerY, width - margin - 18, dividerY)
      .stroke({
        color: options.border.color || "#334155",
        width: 1.5,
        opacity: 0.4,
      });

    if (numLines > 0) {
      const descY = dividerY + descGap + descFontSize * 0.85;
      const descX = (isLeft ? margin + 20 : width / 2) + textOffsetX;
      const descAnchor = isLeft ? "start" : "middle";
      renderMultilineDescription(
        draw,
        description,
        descX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        descAnchor,
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 3: MINIMAL
  // --------------------------------------------------------------------------
  if (variant === "minimal") {
    const accentWidth = Math.min(60, Math.round(width * 0.16));
    draw
      .rect(accentWidth, 4)
      .move((width - accentWidth) / 2, margin + 14)
      .radius(2)
      .fill(options.border.color || "#3b82f6")
      .opacity(0.8);

    const minImgSize = Math.min(
      options.image.size || 160,
      innerW - 40,
      innerH - 40,
    );
    const gapImgTitle = hasImage ? 28 : 0;

    const pos = computeVerticalStackPositions({
      cardH: height,
      margin,
      topPad: 36,
      bottomPad: 24,
      minGap: gapImgTitle,
      gapTitleDesc,
      hasImage,
      imgSize: minImgSize,
      imgVAlign,
      textH,
      titleFontSize,
      descFontSize,
      vAlign,
    });

    const imgY = pos.imgY;
    const titleY = pos.titleY + textOffsetY;
    const descY = pos.descY + textOffsetY;

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
      titleY,
      { ...options.titleFont, fontSize: titleFontSize },
      textAnchor,
    );

    if (numLines > 0) {
      renderMultilineDescription(
        draw,
        description,
        textX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        textAnchor,
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 4: SPLIT
  // --------------------------------------------------------------------------
  if (variant === "split") {
    const splitRatio = 0.44;
    const topH = Math.round(innerH * splitRatio);
    const splitY = margin + topH;
    const bottomH = innerH - topH;
    const bgClipId = `cardBgClip_${width}_${height}_${margin}_${radius}`;

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

    draw
      .line(margin, splitY, width - margin, splitY)
      .stroke({ color: "#000000", width: 1, opacity: 0.4 });
    draw
      .line(margin, splitY + 1, width - margin, splitY + 1)
      .stroke({ color: "#ffffff", width: 1, opacity: 0.12 });

    const splitImgSize = Math.min(
      options.image.size || 160,
      topH - 16,
      innerW - 24,
    );
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

      let textStartY: number;
      if (vAlign === "top") {
        textStartY = splitY + 24;
      } else if (vAlign === "bottom") {
        textStartY = height - margin - 24 - textH;
      } else {
        textStartY = splitY + (bottomH - textH) / 2;
      }
      const titleY = textStartY + titleFontSize * 0.85 + textOffsetY;
      const descY = textStartY + titleFontSize + gapTitleDesc + descFontSize * 0.85 + textOffsetY;

      const textX = (isLeft ? margin + 25 : width / 2) + textOffsetX;
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
        renderMultilineDescription(
          draw,
          description,
          textX,
          descY,
          { ...options.descriptionFont, fontSize: descFontSize },
          textAnchor,
        );
      }
    } else {
      // When no logo is present: Split Title in top panel, and Description in bottom panel!
      const topTitleY = margin + topH / 2 + textOffsetY;
      const textX = (isLeft ? margin + 25 : width / 2) + textOffsetX;
      const textAnchor = isLeft ? "start" : "middle";

      renderTitle(
        draw,
        options.title,
        textX,
        topTitleY,
        { ...options.titleFont, fontSize: titleFontSize },
        textAnchor,
        "central",
      );

      if (numLines > 0) {
        let descStartY: number;
        if (vAlign === "top") {
          descStartY = splitY + 24;
        } else if (vAlign === "bottom") {
          descStartY = height - margin - 24 - descH;
        } else {
          descStartY = splitY + (bottomH - descH) / 2;
        }
        const descY = descStartY + descFontSize * 0.85 + textOffsetY;

        renderMultilineDescription(
          draw,
          description,
          textX,
          descY,
          { ...options.descriptionFont, fontSize: descFontSize },
          textAnchor,
        );
      }
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 5: STANDARD
  // --------------------------------------------------------------------------
  const stdImgSize = Math.min(
    options.image.size || 260,
    innerW - 30,
    innerH - 30,
  );
  const gapImgTitle = hasImage ? 28 : 0;

  const pos = computeVerticalStackPositions({
    cardH: height,
    margin,
    topPad: 24,
    bottomPad: 24,
    minGap: gapImgTitle,
    gapTitleDesc,
    hasImage,
    imgSize: stdImgSize,
    imgVAlign,
    textH,
    titleFontSize,
    descFontSize,
    vAlign,
  });

  const imgY = pos.imgY;
  const titleY = pos.titleY + textOffsetY;
  const descY = pos.descY + textOffsetY;

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

    renderTitle(
      draw,
      options.title,
      textX,
      titleY,
      { ...options.titleFont, fontSize: titleFontSize },
      "start",
    );

    if (numLines > 0) {
      renderMultilineDescription(
        draw,
        description,
        textX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "start",
      );
    }
  } else {
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
      titleY,
      { ...options.titleFont, fontSize: titleFontSize },
      "middle",
    );

    if (numLines > 0) {
      renderMultilineDescription(
        draw,
        description,
        width / 2 + textOffsetX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "middle",
      );
    }
  }

  return draw.node as SVGSVGElement;
}

export const cardLayout: LayoutDefinition<StandardCardOptions> = {
  id: "card",
  name: "Portrait Card",
  description:
    "Standard portrait card format (400x600 px) ideal for social shares and README profiles",
  category: "Card",
  supportsDescription: true,
  schema: StandardCardOptionsSchema,
  defaultOptions: defaultStandardOptions,
  getDimensions: () => ({ width: 400, height: 600 }),
  getDimensionsLabel: () => "400 × 600 px",
  generate: generateCard,
  fields: [
    {
      key: "cardVariant",
      label: "Card Style Variant",
      type: "segmented",
      group: "Card Layout & Content",
      options: [
        { label: "Standard", value: "standard" },
        { label: "Hero", value: "hero" },
        { label: "Compact", value: "compact" },
        { label: "Minimal", value: "minimal" },
        { label: "Split", value: "split" },
      ],
    },
    {
      key: "textAlign",
      label: "Text Alignment",
      type: "segmented",
      group: "Card Layout & Content",
      options: [
        { label: "Centered", value: "center" },
        { label: "Left Aligned", value: "left" },
      ],
    },
    {
      key: "verticalAlign",
      label: "Content Vertical Alignment",
      type: "segmented",
      group: "Card Layout & Content",
      options: [
        { label: "Top", value: "top" },
        { label: "Middle", value: "middle" },
        { label: "Bottom", value: "bottom" },
      ],
    },
    {
      key: "verticalOffset",
      label: "Vertical Offset",
      type: "slider",
      min: -150,
      max: 150,
      step: 1,
      unit: "px",
      quickValues: [-30, -10, 0, 10, 30],
      group: "Card Layout & Content",
    },
    {
      key: "horizontalOffset",
      label: "Horizontal Offset",
      type: "slider",
      min: -150,
      max: 150,
      step: 1,
      unit: "px",
      quickValues: [-30, -10, 0, 10, 30],
      group: "Card Layout & Content",
    },
    ...getStandardCardFields({
      supportsDescription: true,
      defaultImageSize: 260,
    }),
  ],
  normalize: (raw, baseDefault, helpers) => {
    const validVariants = ["standard", "hero", "compact", "minimal", "split"];
    const cardVariant: CardVariant = validVariants.includes(
        String(raw.cardVariant),
      )
      ? (raw.cardVariant as CardVariant)
      : "standard";
    const textAlign = raw.textAlign === "left" ? "left" : "center";

    return {
      ...baseDefault,
      generateType: "card",
      cardVariant,
      textAlign,
      title: typeof raw.title === "string" ? raw.title : baseDefault.title,
      description: typeof raw.description === "string"
        ? raw.description
        : baseDefault.description,
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
      descriptionFont: helpers.normalizeDescriptionFont(
        raw.descriptionFont,
        baseDefault.descriptionFont,
      ),
      image: helpers.normalizeImage(raw.image, baseDefault.image),
    };
  },
};
