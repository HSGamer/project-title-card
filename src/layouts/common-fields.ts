import { LayoutField } from "./types.ts";
import {
  COLOR_SWATCHES,
  DESCRIPTION_SUGGESTIONS,
  FONT_FAMILY_OPTIONS,
  LOGO_SUGGESTIONS,
  TITLE_SUGGESTIONS,
} from "../data/suggestions.ts";

export interface CommonFieldOptions {
  supportsDescription?: boolean;
  isSplitLayout?: (opts: any) => boolean;
  defaultImageSize?: number;
}

export function getTitleAndContentFields(
  supportsDescription: boolean = true,
): LayoutField[] {
  const fields: LayoutField[] = [
    {
      key: "title",
      label: "Title Text",
      type: "text",
      group: "Card Layout & Content",
      placeholder: "e.g. MaskedGUI",
      suggestions: TITLE_SUGGESTIONS,
      suggestionsLabel: "Quick:",
    },
  ];

  if (supportsDescription) {
    fields.push({
      key: "description",
      label: "Description Text",
      type: "textarea",
      group: "Card Layout & Content",
      placeholder: "Enter description lines (Enter creates new line)...",
      rows: 3,
      suggestions: DESCRIPTION_SUGGESTIONS,
      suggestionsLabel: "Templates:",
    });
  }

  return fields;
}

export function createBackgroundFields(
  prefix: "background" | "splitBackground" = "background",
  groupName: string = "Background & Fills",
  labelPrefix: string = "",
  isVisible?: (opts: any) => boolean,
): LayoutField[] {
  const isParentVisible = isVisible || (() => true);

  return [
    {
      key: `${prefix}.type`,
      label: `${labelPrefix}Style Type`,
      type: "segmented",
      group: groupName,
      options: [
        { label: "Solid", value: "solid" },
        { label: "Gradient", value: "gradient" },
        { label: "Glass", value: "glass" },
        { label: "Image", value: "image" },
      ],
      visibleIf: (opts) => isParentVisible(opts),
    },
    // Solid & Glass Background Color
    {
      key: `${prefix}.color`,
      label: `${labelPrefix}Color`,
      type: "color",
      group: groupName,
      fallback: prefix === "splitBackground" ? "#0b1329" : "#0f172a",
      swatches: COLOR_SWATCHES,
      visibleIf: (opts) =>
        isParentVisible(opts) &&
        (opts[prefix]?.type === "solid" ||
          opts[prefix]?.type === "glass" ||
          !opts[prefix]?.type),
    },
    // Gradient Direction
    {
      key: `${prefix}.gradientDirection`,
      label: `${labelPrefix}Gradient Direction`,
      type: "segmented",
      group: groupName,
      options: [
        { label: "→ Right", value: "to-r" },
        { label: "↘ Diag R", value: "to-br" },
        { label: "↓ Down", value: "to-b" },
        { label: "↙ Diag L", value: "to-bl" },
        { label: "◉ Radial", value: "radial" },
      ],
      visibleIf: (opts) =>
        isParentVisible(opts) && opts[prefix]?.type === "gradient",
    },
    // Gradient Stops
    {
      key: `${prefix}.gradientStart`,
      label: `${labelPrefix}Gradient Start Color`,
      type: "color",
      group: groupName,
      fallback: prefix === "splitBackground" ? "#0b1329" : "#ea580c",
      swatches: COLOR_SWATCHES,
      visibleIf: (opts) =>
        isParentVisible(opts) && opts[prefix]?.type === "gradient",
    },
    {
      key: `${prefix}.gradientMiddle`,
      label: `${labelPrefix}Gradient Middle Color (Optional)`,
      type: "color",
      group: groupName,
      fallback: "#db2777",
      swatches: COLOR_SWATCHES,
      visibleIf: (opts) =>
        isParentVisible(opts) && opts[prefix]?.type === "gradient",
    },
    {
      key: `${prefix}.gradientEnd`,
      label: `${labelPrefix}Gradient End Color`,
      type: "color",
      group: groupName,
      fallback: prefix === "splitBackground" ? "#1e293b" : "#7c3aed",
      swatches: COLOR_SWATCHES,
      visibleIf: (opts) =>
        isParentVisible(opts) && opts[prefix]?.type === "gradient",
    },
    // Image Background Controls
    {
      key: `${prefix}.imageUrl`,
      label: `${labelPrefix}Image Source`,
      type: "text",
      group: groupName,
      placeholder: "Paste image URL or upload...",
      allowUpload: true,
      allowClear: true,
      visibleIf: (opts) =>
        isParentVisible(opts) && opts[prefix]?.type === "image",
    },
    {
      key: `${prefix}.imageOpacity`,
      label: `${labelPrefix}Image Opacity`,
      type: "slider",
      min: 0.1,
      max: 1.0,
      step: 0.05,
      unit: "%",
      quickValues: [0.3, 0.5, 0.75, 1.0],
      group: groupName,
      visibleIf: (opts) =>
        isParentVisible(opts) && opts[prefix]?.type === "image",
    },
    {
      key: `${prefix}.overlayColor`,
      label: `${labelPrefix}Overlay Tint Color`,
      type: "color",
      group: groupName,
      fallback: "#0f172a",
      swatches: COLOR_SWATCHES,
      visibleIf: (opts) =>
        isParentVisible(opts) && opts[prefix]?.type === "image",
    },
    {
      key: `${prefix}.overlayOpacity`,
      label: `${labelPrefix}Tint Overlay Opacity`,
      type: "slider",
      min: 0,
      max: 0.95,
      step: 0.05,
      unit: "%",
      quickValues: [0, 0.25, 0.5, 0.75],
      group: groupName,
      visibleIf: (opts) =>
        isParentVisible(opts) && opts[prefix]?.type === "image",
    },
    // Global Opacity
    {
      key: `${prefix}.opacity`,
      label: `${labelPrefix}Global Opacity`,
      type: "slider",
      min: 0.1,
      max: 1.0,
      step: 0.05,
      unit: "%",
      quickValues: [0.25, 0.5, 0.75, 1.0],
      group: groupName,
      visibleIf: (opts) => isParentVisible(opts),
    },
  ];
}

export function getBackgroundFields(
  isSplitPredicate?: (opts: any) => boolean,
): LayoutField[] {
  const isSplit = isSplitPredicate || ((opts: any) =>
    (opts.generateType === "card" && opts.cardVariant === "split") ||
    (opts.generateType === "widecard" && opts.wideVariant === "split") ||
    (opts.generateType === "widescreen" && opts.layoutStyle === "split") ||
    (opts.generateType === "badge" && opts.badgeVariant === "split"));

  return [
    ...createBackgroundFields(
      "background",
      "Background & Fills",
      "Background ",
    ),
    ...createBackgroundFields(
      "splitBackground",
      "Split Panel Background",
      "Split Panel ",
      isSplit,
    ),
  ];
}

export function getBorderFields(): LayoutField[] {
  return [
    {
      key: "border.style",
      label: "Border Style",
      type: "segmented",
      group: "Border & Elevation",
      options: [
        { label: "Solid", value: "solid" },
        { label: "Dashed", value: "dashed" },
        { label: "Dotted", value: "dotted" },
        { label: "None", value: "none" },
      ],
    },
    {
      key: "border.color",
      label: "Border Color",
      type: "color",
      group: "Border & Elevation",
      fallback: "#334155",
      swatches: COLOR_SWATCHES,
    },
    {
      key: "border.width",
      label: "Border Thickness",
      type: "slider",
      min: 0,
      max: 16,
      step: 1,
      unit: "px",
      quickValues: [0, 1, 2, 4],
      group: "Border & Elevation",
    },
    {
      key: "border.radius",
      label: "Corner Radius",
      type: "slider",
      min: 0,
      max: 60,
      step: 2,
      unit: "px",
      quickValues: [0, 8, 16, 24, 32],
      group: "Border & Elevation",
    },
    {
      key: "border.margin",
      label: "Outer Margin",
      type: "slider",
      min: 0,
      max: 40,
      step: 2,
      unit: "px",
      quickValues: [0, 5, 10, 15, 20],
      group: "Border & Elevation",
    },
    {
      key: "border.shadow",
      label: "Shadow & Elevation Effect",
      type: "segmented",
      group: "Border & Elevation",
      options: [
        { label: "None", value: "none" },
        { label: "Subtle", value: "subtle" },
        { label: "Soft", value: "soft" },
        { label: "Deep", value: "strong" },
        { label: "Glow", value: "glow" },
      ],
    },
    {
      key: "border.glowColor",
      label: "Neon Glow Tint Color",
      type: "color",
      group: "Border & Elevation",
      fallback: "#06b6d4",
      swatches: COLOR_SWATCHES,
      visibleIf: (opts) => opts.border?.shadow === "glow",
    },
  ];
}

export function getTypographyFields(
  supportsDescription: boolean = true,
): LayoutField[] {
  const fontOptions = FONT_FAMILY_OPTIONS.map((f) => ({
    label: f.label,
    value: f.value,
  }));

  const weightOptions = [
    { label: "Regular (400)", value: "400" },
    { label: "Medium (500)", value: "500" },
    { label: "Semibold (600)", value: "600" },
    { label: "Bold (700)", value: "700" },
    { label: "Heavy (800)", value: "800" },
  ];

  const fields: LayoutField[] = [
    // Title Font
    {
      key: "titleFont.fontFamily",
      label: "Title Font Stack",
      type: "select",
      group: "Typography & Fonts",
      options: fontOptions,
    },
    {
      key: "titleFont.fontWeight",
      label: "Title Font Weight",
      type: "select",
      group: "Typography & Fonts",
      options: weightOptions,
    },
    {
      key: "titleFont.fontSize",
      label: "Title Font Size",
      type: "slider",
      min: 16,
      max: 72,
      step: 1,
      unit: "px",
      quickValues: [24, 32, 40, 48, 56],
      group: "Typography & Fonts",
    },
    {
      key: "titleFont.letterSpacing",
      label: "Title Letter Spacing",
      type: "slider",
      min: -2,
      max: 10,
      step: 0.5,
      unit: "px",
      quickValues: [-1, 0, 1, 2, 4],
      group: "Typography & Fonts",
    },
    {
      key: "titleFont.uppercase",
      label: "Uppercase Title",
      type: "boolean",
      group: "Typography & Fonts",
    },
    {
      key: "titleFont.color",
      label: "Title Text Color",
      type: "color",
      group: "Typography & Fonts",
      fallback: "#f8fafc",
      swatches: COLOR_SWATCHES,
    },
  ];

  if (supportsDescription) {
    fields.push(
      {
        key: "descriptionFont.fontFamily",
        label: "Description Font Stack",
        type: "select",
        group: "Typography & Fonts",
        options: fontOptions,
      },
      {
        key: "descriptionFont.fontWeight",
        label: "Description Font Weight",
        type: "select",
        group: "Typography & Fonts",
        options: weightOptions,
      },
      {
        key: "descriptionFont.fontSize",
        label: "Description Font Size",
        type: "slider",
        min: 12,
        max: 36,
        step: 1,
        unit: "px",
        quickValues: [16, 18, 20, 24, 28],
        group: "Typography & Fonts",
      },
      {
        key: "descriptionFont.lineHeight",
        label: "Description Line Spacing",
        type: "slider",
        min: 1.0,
        max: 2.0,
        step: 0.05,
        quickValues: [1.1, 1.2, 1.3, 1.4, 1.6],
        group: "Typography & Fonts",
      },
      {
        key: "descriptionFont.opacity",
        label: "Description Text Opacity",
        type: "slider",
        min: 0.2,
        max: 1.0,
        step: 0.05,
        unit: "%",
        quickValues: [0.5, 0.7, 0.85, 1.0],
        group: "Typography & Fonts",
      },
      {
        key: "descriptionFont.color",
        label: "Description Text Color",
        type: "color",
        group: "Typography & Fonts",
        fallback: "#94a3b8",
        swatches: COLOR_SWATCHES,
      },
    );
  }

  return fields;
}

export function getMediaFields(defaultSize: number = 200): LayoutField[] {
  return [
    {
      key: "image.show",
      label: "Show Logo / Image",
      type: "boolean",
      group: "Media & Logo",
    },
    {
      key: "image.url",
      label: "Logo Image URL / Upload",
      type: "text",
      placeholder: "Paste image URL or upload...",
      allowUpload: true,
      allowClear: true,
      suggestions: LOGO_SUGGESTIONS,
      suggestionsLabel: "Demo Logos:",
      group: "Media & Logo",
      visibleIf: (opts) => opts.image?.show !== false,
    },
    {
      key: "image.shape",
      label: "Image Shape",
      type: "segmented",
      group: "Media & Logo",
      options: [
        { label: "Original", value: "original" },
        { label: "Rounded", value: "rounded" },
        { label: "Circle", value: "circle" },
      ],
      visibleIf: (opts) => opts.image?.show !== false,
    },
    {
      key: "image.size",
      label: "Logo Size",
      type: "slider",
      min: 20,
      max: 550,
      step: 5,
      unit: "px",
      quickValues: [60, 100, defaultSize, 280, 360],
      group: "Media & Logo",
      visibleIf: (opts) => opts.image?.show !== false,
    },
    {
      key: "image.verticalAlign",
      label: "Logo Vertical Alignment",
      type: "segmented",
      group: "Media & Logo",
      options: [
        { label: "Top", value: "top" },
        { label: "Middle", value: "middle" },
        { label: "Bottom", value: "bottom" },
      ],
      visibleIf: (opts) => opts.image?.show !== false,
    },
    {
      key: "image.verticalOffset",
      label: "Logo Vertical Offset",
      type: "slider",
      min: -150,
      max: 150,
      step: 1,
      unit: "px",
      quickValues: [-30, -10, 0, 10, 30],
      group: "Media & Logo",
      visibleIf: (opts) => opts.image?.show !== false,
    },
    {
      key: "image.horizontalOffset",
      label: "Logo Horizontal Offset",
      type: "slider",
      min: -150,
      max: 150,
      step: 1,
      unit: "px",
      quickValues: [-30, -10, 0, 10, 30],
      group: "Media & Logo",
      visibleIf: (opts) => opts.image?.show !== false,
    },
  ];
}

export function getStandardCardFields(config: CommonFieldOptions): LayoutField[] {
  const supportsDesc = config.supportsDescription ?? true;
  const defaultImgSize = config.defaultImageSize ?? 200;

  return [
    ...getTitleAndContentFields(supportsDesc),
    ...getBackgroundFields(config.isSplitLayout),
    ...getBorderFields(),
    ...getTypographyFields(supportsDesc),
    ...getMediaFields(defaultImgSize),
  ];
}
