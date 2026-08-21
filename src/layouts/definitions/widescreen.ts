import { z } from "zod";
import {
  BaseCardOptionsSchema,
  CardOptions,
  DescriptionFontConfigSchema,
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

export const WidescreenLayoutSchema = z.enum([
  "split",
  "banner",
  "centered",
  "hero",
  "minimal",
]);
export type WidescreenLayout = z.infer<typeof WidescreenLayoutSchema>;

export const WidescreenCardOptionsSchema = BaseCardOptionsSchema.extend({
  generateType: z.literal("widescreen"),
  layoutStyle: WidescreenLayoutSchema.optional().describe(
    "Widescreen card layout variant",
  ),
  description: z.string().describe("Card description text"),
  descriptionFont: DescriptionFontConfigSchema,
});
export type WidescreenCardOptions = z.infer<
  typeof WidescreenCardOptionsSchema
>;

export const defaultWidescreenOptions: WidescreenCardOptions = {
  generateType: "widescreen",
  title: "MaskedGUI",
  description:
    "Fast • Lightweight • Type-Safe\nZero Dependency Inventory UI Framework",
  layoutStyle: "split",
  verticalAlign: "middle",
  verticalOffset: 0,
  horizontalOffset: 0,
  image: {
    url:
      "https://raw.githubusercontent.com/BetterGUI-MC/MaskedGUI/master/.github/image/logo.svg",
    shape: "rounded",
    size: 240,
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
    fontSize: 42,
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

export function generateWidescreen(
  options: CardOptions,
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
  const titleFontSize = options.titleFont.fontSize || 42;
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
    topPad = 32,
    bottomPad = 32,
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

  const computeImgY = (size: number, topPad = 32, bottomPad = 32) => {
    let y: number;
    if (imgVAlign === "top") y = margin + topPad;
    else if (imgVAlign === "bottom") y = height - margin - bottomPad - size;
    else y = (height - size) / 2;
    return y + imgOffsetY;
  };

  const textCenterY = margin + innerH / 2;

  // --------------------------------------------------------------------------
  // Variant 1: CENTERED
  // --------------------------------------------------------------------------
  if (layout === "centered") {
    const centeredImgSize = Math.min(
      options.image.size || 150,
      innerW - 40,
      innerH - 40,
    );
    const gapImgTitle = hasImage ? 20 : 0;

    const pos = computeVerticalStackPositions({
      cardH: height,
      margin,
      topPad: 28,
      bottomPad: 28,
      minGap: gapImgTitle,
      gapTitleDesc,
      hasImage,
      imgSize: centeredImgSize,
      imgVAlign,
      textH,
      titleFontSize,
      descFontSize,
      vAlign,
    });

    const imgY = pos.imgY;
    const titleY = pos.titleY + textOffsetY;
    const descY = pos.descY + textOffsetY;

    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: (width - centeredImgSize) / 2 + imgOffsetX, y: imgY + imgOffsetY },
        centeredImgSize,
        centeredImgSize,
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
      renderMultilineDescription(
        draw,
        description,
        width / 2 + textOffsetX,
        descY,
        { ...options.descriptionFont, fontSize: descFontSize },
        "middle",
      );
    }

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 2: BANNER
  // --------------------------------------------------------------------------
  if (layout === "banner") {
    const { titleY, descY } = computeTextY(
      textCenterY,
      titleFontSize,
      descFontSize,
      36,
      36,
    );

    if (hasImage) {
      const bannerImgSize = Math.min(
        options.image.size || 240,
        Math.round(innerW * 0.5),
        innerH - 30,
      );
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

    return draw.node as SVGSVGElement;
  }

  // --------------------------------------------------------------------------
  // Variant 3: HERO
  // --------------------------------------------------------------------------
  if (layout === "hero") {
    const cardPad = 25;
    const innerCardW = width - 2 * margin - 2 * cardPad;
    const innerCardH = height - 2 * margin - 2 * cardPad;
    const innerCardX = margin + cardPad;
    const innerCardY = margin + cardPad;
    const heroCenterY = innerCardY + innerCardH / 2;
    const { titleY, descY } = computeTextY(
      heroCenterY,
      titleFontSize,
      descFontSize,
      cardPad + 28,
      cardPad + 28,
    );

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
      const heroImgSize = Math.min(
        options.image.size || 180,
        Math.round(innerCardW * 0.5),
        innerCardH - 30,
      );
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
  // Variant 4: MINIMAL
  // --------------------------------------------------------------------------
  if (layout === "minimal") {
    const { titleY, descY } = computeTextY(
      textCenterY,
      titleFontSize,
      descFontSize,
      36,
      36,
    );

    if (hasImage) {
      const minImgSize = Math.min(
        options.image.size || 190,
        Math.round(innerW * 0.5),
        innerH - 30,
      );
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

      const divX = margin + 35 + minImgSize + 30;
      draw
        .line(divX, margin + 35, divX, height - margin - 35)
        .stroke({
          color: options.border.color || "#3b82f6",
          width: 2,
          opacity: 0.6,
        });

      const textX = margin + 35 + minImgSize + 60 + textOffsetX;
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
        margin + 45 + textOffsetX,
        titleY,
        { ...options.titleFont, fontSize: titleFontSize },
        "start",
      );
      if (numLines > 0) {
        renderMultilineDescription(
          draw,
          description,
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
  // Variant 5: SPLIT
  // --------------------------------------------------------------------------
  const splitRatio = 0.36;
  const panelWidth = Math.round(innerW * splitRatio);
  const splitX = margin + panelWidth;
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
    { x: margin, y: margin, width: panelWidth, height: innerH },
    bgClipId,
    "wsSplitBg",
  );

  draw
    .line(splitX, margin, splitX, height - margin)
    .stroke({ color: "#000000", width: 1, opacity: 0.35 });
  draw
    .line(splitX + 1, margin, splitX + 1, height - margin)
    .stroke({ color: "#ffffff", width: 1, opacity: 0.12 });

  const { titleY, descY } = computeTextY(
    textCenterY,
    titleFontSize,
    descFontSize,
    36,
    36,
  );

  if (hasImage) {
    const splitImgSize = Math.min(
      options.image.size || 220,
      panelWidth - 28,
      innerH - 28,
    );
    const imgX = margin + (panelWidth - splitImgSize) / 2 + imgOffsetX;
    const imgY = computeImgY(splitImgSize, 28, 28);

    renderImage(
      draw,
      options.image,
      { x: imgX, y: imgY },
      splitImgSize,
      splitImgSize,
      "wsSplitLogo",
    );

    const textX = splitX + 35 + textOffsetX;
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
    // When there is no logo: Put Title in left split panel, and Description in right panel!
    renderTitle(
      draw,
      options.title,
      margin + panelWidth / 2 + textOffsetX,
      titleY,
      { ...options.titleFont, fontSize: titleFontSize },
      "middle",
    );
    if (numLines > 0) {
      const textX = splitX + 35 + textOffsetX;
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

export const widescreenLayout: LayoutDefinition<WidescreenCardOptions> = {
  id: "widescreen",
  name: "16:9 Widescreen",
  description:
    "16:9 aspect ratio banner (720x405 px) suitable for presentations, video thumbnails, and hero headers",
  category: "Banner",
  supportsDescription: true,
  schema: WidescreenCardOptionsSchema,
  defaultOptions: defaultWidescreenOptions,
  getDimensions: () => ({ width: 720, height: 405 }),
  getDimensionsLabel: () => "720 × 405 px",
  generate: generateWidescreen,
  fields: [
    {
      key: "layoutStyle",
      label: "Widescreen Style Variant",
      type: "segmented",
      group: "Card Layout & Content",
      options: [
        { label: "Split", value: "split" },
        { label: "Banner", value: "banner" },
        { label: "Centered", value: "centered" },
        { label: "Hero", value: "hero" },
        { label: "Minimal", value: "minimal" },
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
      defaultImageSize: 240,
    }),
  ],
  normalize: (raw, baseDefault, helpers) => {
    const validVariants = ["split", "banner", "centered", "hero", "minimal"];
    const layoutStyle: WidescreenLayout = validVariants.includes(
        String(raw.layoutStyle),
      )
      ? (raw.layoutStyle as WidescreenLayout)
      : "split";
    const textAlign = raw.textAlign === "left" ? "left" : "center";

    return {
      ...baseDefault,
      generateType: "widescreen",
      layoutStyle,
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
