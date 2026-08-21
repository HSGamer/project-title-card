import { z } from "zod";
import {
  BaseCardOptionsSchema,
  CardOptions,
  DescriptionFontConfigSchema,
  ImagePositionSchema,
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

export const WideVariantSchema = z.enum([
  "standard",
  "split",
  "centered",
  "minimal",
  "badge",
]);
export type WideVariant = z.infer<typeof WideVariantSchema>;

export const WideCardOptionsSchema = BaseCardOptionsSchema.extend({
  generateType: z.literal("widecard"),
  wideVariant: WideVariantSchema.optional().describe(
    "Wide card visual layout variant",
  ),
  description: z.string().describe("Card description text"),
  descriptionFont: DescriptionFontConfigSchema,
  imagePosition: ImagePositionSchema.describe("Logo position (left or right)"),
});
export type WideCardOptions = z.infer<typeof WideCardOptionsSchema>;

export const defaultWideOptions: WideCardOptions = {
  generateType: "widecard",
  wideVariant: "standard",
  title: "MaskedGUI",
  description:
    "A modern, high-performance inventory GUI library for developers",
  imagePosition: "left",
  verticalAlign: "middle",
  verticalOffset: 0,
  horizontalOffset: 0,
  image: {
    url:
      "https://raw.githubusercontent.com/BetterGUI-MC/MaskedGUI/master/.github/image/logo.svg",
    shape: "rounded",
    size: 220,
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
    fontSize: 44,
    letterSpacing: 0,
    uppercase: false,
  },
  descriptionFont: {
    color: "#94a3b8",
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: "500",
    fontSize: 24,
    lineHeight: 1.3,
    opacity: 1,
  },
};

export function generateWidecard(options: CardOptions): SVGSVGElement {
  const { width, height } = getCardDimensions(options);
  const variant = options.wideVariant || "standard";
  const margin = options.border.margin ?? 10;
  const innerW = width - 2 * margin;
  const innerH = height - 2 * margin;
  const hasImage = Boolean(options.image.show && options.image.url);
  const { draw, radius } = createBaseSvg(
    width,
    height,
    options,
    `Wide (${variant})`,
  );

  const titleFontSize = options.titleFont.fontSize || 44;
  const descFontSize = options.descriptionFont?.fontSize || 24;
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

  const computeTextY = (
    centerY = margin + innerH / 2,
    tSize = titleFontSize,
    dSize = descFontSize,
    topPad = 28,
    bottomPad = 28,
  ) => {
    let startY: number;
    if (vAlign === "top") {
      startY = margin + topPad;
    } else if (vAlign === "bottom") {
      startY = height - margin - bottomPad - textH;
    } else {
      startY = centerY - textH / 2;
    }

    const titleY = startY + tSize * 0.85 + textOffsetY;
    const descY = startY + tSize + gapTitleDesc + dSize * 0.85 + textOffsetY;
    return { titleY, descY };
  };

  const computeImgY = (size: number, topPad = 24, bottomPad = 24) => {
    if (imgVAlign === "top") {
      return margin + topPad + imgOffsetY;
    }
    if (imgVAlign === "bottom") {
      return height - margin - bottomPad - size + imgOffsetY;
    }
    return margin + (innerH - size) / 2 + imgOffsetY;
  };

  // --------------------------------------------------------------------------
  // Variant 1: SPLIT
  // --------------------------------------------------------------------------
  if (variant === "split") {
    const isRight = options.imagePosition === "right";
    const splitRatio = 0.32;
    const splitW = Math.round(innerW * splitRatio);
    const splitX = isRight ? width - margin - splitW : margin;
    const bgClipId = `wideBgClip_${width}_${height}_${margin}_${radius}`;

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
      { x: splitX, y: margin, width: splitW, height: innerH },
      bgClipId,
      "wideSplitBg",
    );

    const seamX = isRight ? splitX : splitX + splitW;
    draw
      .line(seamX, margin, seamX, height - margin)
      .stroke({ color: "#000000", width: 1, opacity: 0.4 });
    draw
      .line(seamX + 1, margin, seamX + 1, height - margin)
      .stroke({ color: "#ffffff", width: 1, opacity: 0.12 });

    const splitImgSize = Math.min(
      options.image.size || 150,
      splitW - 24,
      innerH - 24,
    );
    const imgX = splitX + (splitW - splitImgSize) / 2 + imgOffsetX;
    const imgY = computeImgY(splitImgSize, 20, 20);

    const textCenterY = margin + innerH / 2;
    const { titleY, descY } = computeTextY(textCenterY);

    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        splitImgSize,
        splitImgSize,
        "wideSplitLogo",
      );

      const textX = (isRight ? margin + 35 : splitX + splitW + 35) + textOffsetX;
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
      // When no logo is present: Split Title in split panel, and Description in main panel!
      const panelCenterX = splitX + splitW / 2 + textOffsetX;
      renderTitle(
        draw,
        options.title,
        panelCenterX,
        titleY,
        { ...options.titleFont, fontSize: titleFontSize },
        "middle",
      );
      if (numLines > 0) {
        const textX = (isRight ? margin + 35 : splitX + splitW + 35) + textOffsetX;
        renderMultilineDescription(
          draw,
          description,
          textX,
          descY,
          { ...options.descriptionFont, fontSize: descFontSize },
          "start",
        );
      }
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 2: CENTERED
  // --------------------------------------------------------------------------
  const textCenterY = margin + innerH / 2;

  if (variant === "centered") {
    const centeredTitleSize = Math.min(titleFontSize, 36);
    const centeredDescSize = Math.min(descFontSize, 20);
    const centerImgSize = Math.min(
      options.image.size || 110,
      innerW - 40,
      innerH - 40,
    );

    const gapImgTitle = hasImage ? 18 : 0;
    const centeredTextH = centeredTitleSize + (numLines > 0 ? gapTitleDesc + descH : 0);

    const pos = computeVerticalStackPositions({
      cardH: height,
      margin,
      topPad: 20,
      bottomPad: 20,
      minGap: gapImgTitle,
      gapTitleDesc,
      hasImage,
      imgSize: centerImgSize,
      imgVAlign,
      textH: centeredTextH,
      titleFontSize: centeredTitleSize,
      descFontSize: centeredDescSize,
      vAlign,
    });

    const imgY = pos.imgY + imgOffsetY;
    const titleY = pos.titleY + textOffsetY;
    const descY = pos.descY + textOffsetY;

    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: (width - centerImgSize) / 2 + imgOffsetX, y: imgY },
        centerImgSize,
        centerImgSize,
        "wideCenteredLogo",
      );
    }

    renderTitle(
      draw,
      options.title,
      width / 2 + textOffsetX,
      titleY,
      { ...options.titleFont, fontSize: centeredTitleSize },
      "middle",
    );

    if (numLines > 0) {
      renderMultilineDescription(
        draw,
        description,
        width / 2 + textOffsetX,
        descY,
        { ...options.descriptionFont, fontSize: centeredDescSize },
        "middle",
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 3: MINIMAL
  // --------------------------------------------------------------------------
  if (variant === "minimal") {
    const isRight = options.imagePosition === "right";
    const { titleY, descY } = computeTextY(textCenterY);

    if (hasImage) {
      const minImgSize = Math.min(
        options.image.size || 160,
        innerW - 40,
        innerH - 20,
      );
      const imgX = (isRight ? width - margin - minImgSize - 35 : margin + 35) +
        imgOffsetX;
      const imgY = computeImgY(minImgSize, 28, 28);

      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        minImgSize,
        minImgSize,
        "wideMinLogo",
      );

      const divX = isRight
        ? width - margin - minImgSize - 60
        : margin + 35 + minImgSize + 25;
      draw
        .line(divX, margin + 25, divX, height - margin - 25)
        .stroke({
          color: options.border.color || "#334155",
          width: 1.5,
          opacity: 0.5,
        });

      const textX =
        (isRight ? margin + 35 : margin + 35 + minImgSize + 55) + textOffsetX;
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
      renderTitle(
        draw,
        options.title,
        margin + 40 + textOffsetX,
        titleY,
        { ...options.titleFont, fontSize: titleFontSize },
        "start",
      );
      if (numLines > 0) {
        renderMultilineDescription(
          draw,
          description,
          margin + 40 + textOffsetX,
          descY,
          { ...options.descriptionFont, fontSize: descFontSize },
          "start",
        );
      }
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 4: BADGE
  // --------------------------------------------------------------------------
  if (variant === "badge") {
    const isRight = options.imagePosition === "right";
    const badgeImgSize = Math.min(
      options.image.size || 150,
      innerW - 40,
      innerH - 20,
    );
    const { titleY, descY } = computeTextY(textCenterY);

    if (hasImage) {
      const imgX = (isRight
        ? width - margin - badgeImgSize - 40
        : margin + 40) + imgOffsetX;
      const imgY = computeImgY(badgeImgSize, 28, 28);

      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        badgeImgSize,
        badgeImgSize,
        "wideBadgeLogo",
      );

      const textX =
        (isRight ? margin + 50 : margin + 40 + badgeImgSize + 35) + textOffsetX;
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

  // --------------------------------------------------------------------------
  // Variant 5: STANDARD
  // --------------------------------------------------------------------------
  const stdImgSize = Math.min(
    options.image.size || 220,
    innerW - 40,
    innerH - 20,
  );
  const { titleY, descY } = computeTextY(textCenterY);

  if (options.imagePosition === "right") {
    if (hasImage) {
      const imgX = width - margin - stdImgSize - 30 + imgOffsetX;
      const imgY = computeImgY(stdImgSize, 28, 28);
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        stdImgSize,
        stdImgSize,
        "wideLogo",
      );
    }
    renderTitle(
      draw,
      options.title,
      margin + 35 + textOffsetX,
      titleY,
      { ...options.titleFont, fontSize: titleFontSize },
      "start",
    );
    if (numLines > 0) {
      renderMultilineDescription(
        draw,
        description,
        margin + 35 + textOffsetX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "start",
      );
    }
  } else {
    if (hasImage) {
      const imgX = margin + 30 + imgOffsetX;
      const imgY = computeImgY(stdImgSize, 28, 28);
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        stdImgSize,
        stdImgSize,
        "wideLogo",
      );

      const textX = margin + 30 + stdImgSize + 32 + textOffsetX;
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
      renderTitle(
        draw,
        options.title,
        margin + 40 + textOffsetX,
        titleY,
        { ...options.titleFont, fontSize: titleFontSize },
        "start",
      );
      if (numLines > 0) {
        renderMultilineDescription(
          draw,
          description,
          margin + 40 + textOffsetX,
          descY,
          { ...options.descriptionFont, fontSize: descFontSize },
          "start",
        );
      }
    }
  }

  return draw.node as SVGSVGElement;
}

export const wideCardLayout: LayoutDefinition<WideCardOptions> = {
  id: "widecard",
  name: "Wide Banner",
  description:
    "Horizontal wide banner format (800x300 px) perfect for GitHub README header banners",
  category: "Banner",
  supportsDescription: true,
  schema: WideCardOptionsSchema,
  defaultOptions: defaultWideOptions,
  getDimensions: () => ({ width: 800, height: 300 }),
  getDimensionsLabel: () => "800 × 300 px",
  generate: generateWidecard,
  fields: [
    {
      key: "wideVariant",
      label: "Wide Banner Variant",
      type: "segmented",
      group: "Card Layout & Content",
      options: [
        { label: "Standard", value: "standard" },
        { label: "Split", value: "split" },
        { label: "Centered", value: "centered" },
        { label: "Minimal", value: "minimal" },
        { label: "Badge", value: "badge" },
      ],
    },
    {
      key: "imagePosition",
      label: "Logo Placement Side",
      type: "segmented",
      group: "Card Layout & Content",
      options: [
        { label: "Logo on Left", value: "left" },
        { label: "Logo on Right", value: "right" },
      ],
      visibleIf: (opts) => opts.wideVariant !== "centered",
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
      defaultImageSize: 220,
    }),
  ],
  normalize: (raw, baseDefault, helpers) => {
    const validVariants = [
      "standard",
      "split",
      "centered",
      "minimal",
      "badge",
    ];
    const wideVariant: WideVariant = validVariants.includes(
        String(raw.wideVariant),
      )
      ? (raw.wideVariant as WideVariant)
      : "standard";
    const imagePosition = raw.imagePosition === "right" ? "right" : "left";
    const textAlign = raw.textAlign === "left" ? "left" : "center";

    return {
      ...baseDefault,
      generateType: "widecard",
      wideVariant,
      imagePosition,
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
