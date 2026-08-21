import { SVG, Svg } from "@svgdotjs/svg.js";
import { BackgroundConfig, CardOptions, GradientDirection } from "../types.ts";
import { getSvgFontImports, loadWebFont } from "../utils/fonts.ts";

export interface BaseSvgResult {
  draw: Svg;
  margin: number;
  radius: number;
}

/**
 * Maps gradient direction enum to SVG coordinate percentages
 */
export function getGradientCoordinates(dir: GradientDirection): {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
} {
  switch (dir) {
    case "to-r":
      return { x1: "0%", y1: "0%", x2: "100%", y2: "0%" };
    case "to-b":
      return { x1: "0%", y1: "0%", x2: "0%", y2: "100%" };
    case "to-bl":
      return { x1: "100%", y1: "0%", x2: "0%", y2: "100%" };
    case "to-br":
    default:
      return { x1: "0%", y1: "0%", x2: "100%", y2: "100%" };
  }
}

/**
 * Creates SVG base canvas with defs, background rect/image, and accessibility metadata
 */
export function createBaseSvg(
  width: number,
  height: number,
  options: CardOptions,
  typeLabel: string,
  includeDesc = true,
  customRadius?: number,
): BaseSvgResult {
  const margin = options.border.margin ?? 10;
  const radius = customRadius !== undefined
    ? customRadius
    : options.border.radius ?? 14;

  const draw: Svg = SVG().size(width, height).viewbox(0, 0, width, height);
  draw.attr({
    xmlns: "http://www.w3.org/2000/svg",
    role: "img",
    "aria-label": `${typeLabel}: ${options.title || "Untitled"}`,
  });

  // 1. Accessibility Metadata
  if (typeof globalThis.document?.createElementNS === "function") {
    const titleElem = globalThis.document.createElementNS(
      "http://www.w3.org/2000/svg",
      "title",
    );
    titleElem.textContent = options.title
      ? `${typeLabel}: ${options.title}`
      : typeLabel;
    draw.node.appendChild(titleElem);

    if (includeDesc && "description" in options && options.description) {
      const descElem = globalThis.document.createElementNS(
        "http://www.w3.org/2000/svg",
        "desc",
      );
      descElem.textContent = options.description;
      draw.node.appendChild(descElem);
    }
  }

  // 2. Load Web Fonts in Browser DOM (if in browser)
  if (
    typeof globalThis.window !== "undefined" &&
    typeof globalThis.document?.head?.appendChild === "function"
  ) {
    if (options.titleFont?.fontFamily) {
      loadWebFont(options.titleFont.fontFamily);
    }
    if ("descriptionFont" in options && options.descriptionFont?.fontFamily) {
      loadWebFont(options.descriptionFont.fontFamily);
    }
  }

  // 3. Build Defs
  const defs = draw.defs();

  // Embed Font Imports in SVG
  const descFont = "descriptionFont" in options
    ? options.descriptionFont?.fontFamily
    : undefined;
  const svgFontStyles = getSvgFontImports(
    options.titleFont?.fontFamily,
    descFont,
  );
  if (svgFontStyles) {
    const styleElem = defs.element("style");
    styleElem.node.textContent = svgFontStyles;
  }

  // Background Gradient Def
  if (options.background.type === "gradient") {
    if (options.background.gradientDirection === "radial") {
      const radGrad = defs.element("radialGradient").attr({
        id: "cardBgGradient",
        cx: "50%",
        cy: "50%",
        r: "70%",
      });
      radGrad.element("stop").attr({
        offset: "0%",
        "stop-color": options.background.gradientStart,
      });
      if (options.background.gradientMiddle) {
        radGrad.element("stop").attr({
          offset: "50%",
          "stop-color": options.background.gradientMiddle,
        });
      }
      radGrad.element("stop").attr({
        offset: "100%",
        "stop-color": options.background.gradientEnd,
      });
    } else {
      const coords = getGradientCoordinates(
        options.background.gradientDirection,
      );
      const linGrad = defs.element("linearGradient").attr({
        id: "cardBgGradient",
        ...coords,
      });
      linGrad.element("stop").attr({
        offset: "0%",
        "stop-color": options.background.gradientStart,
      });
      if (options.background.gradientMiddle) {
        linGrad.element("stop").attr({
          offset: "50%",
          "stop-color": options.background.gradientMiddle,
        });
      }
      linGrad.element("stop").attr({
        offset: "100%",
        "stop-color": options.background.gradientEnd,
      });
    }
  }

  // Shadow / Glow Filter Defs
  if (options.border.shadow && options.border.shadow !== "none") {
    const filter = defs.element("filter").attr({
      id: "cardShadowFilter",
      x: "-20%",
      y: "-20%",
      width: "140%",
      height: "140%",
    });

    if (options.border.shadow === "subtle") {
      filter.element("feDropShadow").attr({
        dx: "0",
        dy: "3",
        stdDeviation: "5",
        "flood-color": "#000000",
        "flood-opacity": "0.18",
      });
    } else if (options.border.shadow === "soft") {
      filter.element("feDropShadow").attr({
        dx: "0",
        dy: "8",
        stdDeviation: "14",
        "flood-color": "#000000",
        "flood-opacity": "0.28",
      });
    } else if (options.border.shadow === "strong") {
      filter.element("feDropShadow").attr({
        dx: "0",
        dy: "14",
        stdDeviation: "22",
        "flood-color": "#000000",
        "flood-opacity": "0.45",
      });
    } else if (options.border.shadow === "glow") {
      const glowColor = options.border.glowColor || options.border.color ||
        "#06b6d4";
      filter.element("feDropShadow").attr({
        dx: "0",
        dy: "0",
        stdDeviation: "8",
        "flood-color": glowColor,
        "flood-opacity": "0.85",
      });
      filter.element("feDropShadow").attr({
        dx: "0",
        dy: "0",
        stdDeviation: "16",
        "flood-color": glowColor,
        "flood-opacity": "0.45",
      });
    }
  }

  // 4. Background Rendering
  const bgWidth = Math.max(0, width - 2 * margin);
  const bgHeight = Math.max(0, height - 2 * margin);

  // Background ClipPath for custom images & overlays
  const bgClipId = `cardBgClip_${width}_${height}_${margin}_${radius}`;
  const bgClip = defs.element("clipPath").attr("id", bgClipId);
  bgClip.element("rect").attr({
    x: margin,
    y: margin,
    width: bgWidth,
    height: bgHeight,
    rx: radius,
    ry: radius,
  });

  // Base background rect
  const rect = draw.rect(bgWidth, bgHeight).move(margin, margin).radius(radius);

  if (options.background.type === "gradient") {
    rect.attr("fill", "url(#cardBgGradient)");
  } else if (
    options.background.type === "image" && options.background.imageUrl
  ) {
    // Underneath base fallback color
    rect.attr("fill", options.background.color || "#0f172a");

    // Render Background Image inside clip-path
    const bgImg = draw
      .image(options.background.imageUrl)
      .size(bgWidth, bgHeight)
      .move(margin, margin)
      .attr({
        "clip-path": `url(#${bgClipId})`,
        preserveAspectRatio: "xMidYMid slice",
        role: "img",
        "aria-label": "Card Background Image",
      });

    if (
      options.background.imageOpacity !== undefined &&
      options.background.imageOpacity < 1
    ) {
      bgImg.attr("opacity", options.background.imageOpacity);
    }

    // Optional color overlay for text contrast
    if (
      options.background.overlayColor &&
      (options.background.overlayOpacity ?? 0) > 0
    ) {
      draw
        .rect(bgWidth, bgHeight)
        .move(margin, margin)
        .radius(radius)
        .attr({
          fill: options.background.overlayColor,
          "fill-opacity": options.background.overlayOpacity ?? 0.5,
          "clip-path": `url(#${bgClipId})`,
        });
    }
  } else {
    // Solid or Glass
    rect.attr("fill", options.background.color || "#0f172a");
  }

  if (
    options.background.opacity !== undefined && options.background.opacity < 1
  ) {
    rect.attr("fill-opacity", options.background.opacity);
  }

  // 5. Apply Border
  if (options.border.style && options.border.style !== "none") {
    rect.attr({
      stroke: options.border.color || "#334155",
      "stroke-width": options.border.width ?? 2,
    });

    if (options.border.style === "dashed") {
      rect.attr("stroke-dasharray", "8,6");
    } else if (options.border.style === "dotted") {
      rect.attr("stroke-dasharray", "3,3");
    }
  } else {
    rect.attr("stroke", "none");
  }

  // 6. Apply Shadow Filter
  if (options.border.shadow && options.border.shadow !== "none") {
    rect.attr("filter", "url(#cardShadowFilter)");
  }

  return { draw, margin, radius };
}

/**
 * Renders a full background (solid, gradient, glass, or image) into a panel/sub-region of the SVG canvas.
 */
export function renderPanelBackground(
  draw: Svg,
  bg: BackgroundConfig | undefined,
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
    radius?: number;
  },
  clipId?: string,
  idPrefix = "panelBg",
): void {
  if (!bg) return;
  const defs = draw.defs();
  const { x, y, width, height, radius } = bounds;

  let fillValue = bg.color || "#0b1329";

  if (bg.type === "gradient") {
    const gradId = `${idPrefix}_grad_${Math.floor(x)}_${Math.floor(y)}`;
    if (bg.gradientDirection === "radial") {
      const radGrad = defs.element("radialGradient").attr({
        id: gradId,
        cx: "50%",
        cy: "50%",
        r: "70%",
      });
      radGrad.element("stop").attr({
        offset: "0%",
        "stop-color": bg.gradientStart,
      });
      if (bg.gradientMiddle) {
        radGrad.element("stop").attr({
          offset: "50%",
          "stop-color": bg.gradientMiddle,
        });
      }
      radGrad.element("stop").attr({
        offset: "100%",
        "stop-color": bg.gradientEnd,
      });
    } else {
      const coords = getGradientCoordinates(bg.gradientDirection || "to-br");
      const linGrad = defs.element("linearGradient").attr({
        id: gradId,
        ...coords,
      });
      linGrad.element("stop").attr({
        offset: "0%",
        "stop-color": bg.gradientStart,
      });
      if (bg.gradientMiddle) {
        linGrad.element("stop").attr({
          offset: "50%",
          "stop-color": bg.gradientMiddle,
        });
      }
      linGrad.element("stop").attr({
        offset: "100%",
        "stop-color": bg.gradientEnd,
      });
    }
    fillValue = `url(#${gradId})`;
  }

  const bgRect = draw.rect(width, height).move(x, y);
  if (radius) bgRect.radius(radius);
  bgRect.attr({
    fill: fillValue,
    ...(clipId ? { "clip-path": `url(#${clipId})` } : {}),
  });

  if (bg.opacity !== undefined && bg.opacity < 1) {
    bgRect.attr("fill-opacity", bg.opacity);
  }

  if (bg.type === "image" && bg.imageUrl) {
    const bgImg = draw
      .image(bg.imageUrl)
      .size(width, height)
      .move(x, y)
      .attr({
        ...(clipId ? { "clip-path": `url(#${clipId})` } : {}),
        preserveAspectRatio: "xMidYMid slice",
        role: "img",
        "aria-label": "Panel Background Image",
      });

    if (bg.imageOpacity !== undefined && bg.imageOpacity < 1) {
      bgImg.attr("opacity", bg.imageOpacity);
    }

    if (bg.overlayColor && (bg.overlayOpacity ?? 0) > 0) {
      const overlay = draw.rect(width, height).move(x, y);
      if (radius) overlay.radius(radius);
      overlay.attr({
        fill: bg.overlayColor,
        "fill-opacity": bg.overlayOpacity ?? 0.5,
        ...(clipId ? { "clip-path": `url(#${clipId})` } : {}),
      });
    }
  }
}
