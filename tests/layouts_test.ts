import { assertEquals, assertExists } from "jsr:@std/assert";
import {
  calculateAutoBadgeDimensions,
  defaultBadgeOptions,
  defaultStandardOptions,
  defaultWideOptions,
  defaultWidescreenOptions,
  ensureHeadlessDOM,
  generateSVG,
  getAllLayouts,
  getCardDimensions,
  getCardDimensionsLabel,
  getDefaultLayout,
  getLayout,
  hasLayout,
  LayoutDefinition,
  normalizeCardOptions,
  registerLayout,
} from "../src/mod.ts";


ensureHeadlessDOM();

Deno.test("Layout Registry - default layouts registered", () => {
  const layouts = getAllLayouts();
  assertEquals(layouts.length >= 4, true);

  const ids = layouts.map((l) => l.id);
  assertEquals(ids.includes("card"), true);
  assertEquals(ids.includes("widecard"), true);
  assertEquals(ids.includes("widescreen"), true);
  assertEquals(ids.includes("badge"), true);

  const defaultLayout = getDefaultLayout();
  assertEquals(defaultLayout.id, "card");
});

Deno.test("Layout Registry - getLayout and hasLayout", () => {
  assertEquals(hasLayout("card"), true);
  assertEquals(hasLayout("widecard"), true);
  assertEquals(hasLayout("widescreen"), true);
  assertEquals(hasLayout("badge"), true);
  assertEquals(hasLayout("nonexistent_layout_xyz"), false);

  const cardLayout = getLayout("card");
  assertEquals(cardLayout.id, "card");
  assertEquals(cardLayout.name, "Portrait Card");
  assertEquals(cardLayout.supportsDescription, true);
  assertEquals(cardLayout.fields !== undefined, true);
  assertEquals((cardLayout.fields?.length || 0) > 0, true);

  const badgeLayout = getLayout("badge");
  assertEquals(badgeLayout.id, "badge");
  assertEquals(badgeLayout.name, "Badge / Shield");
  assertEquals(badgeLayout.supportsDescription, false);
  assertEquals((badgeLayout.fields?.length || 0) >= 8, true);
});

Deno.test("Layout Dimensions - computed correctly", () => {
  const cardDims = getCardDimensions(defaultStandardOptions);
  assertEquals(cardDims.width, 400);
  assertEquals(cardDims.height, 600);
  assertEquals(getCardDimensionsLabel(defaultStandardOptions), "400 × 600 px");

  const wideDims = getCardDimensions(defaultWideOptions);
  assertEquals(wideDims.width, 800);
  assertEquals(wideDims.height, 300);
  assertEquals(getCardDimensionsLabel(defaultWideOptions), "800 × 300 px");

  const wsDims = getCardDimensions(defaultWidescreenOptions);
  assertEquals(wsDims.width, 720);
  assertEquals(wsDims.height, 405);
  assertEquals(getCardDimensionsLabel(defaultWidescreenOptions), "720 × 405 px");

  const badgeDims = getCardDimensions(defaultBadgeOptions);
  assertEquals(badgeDims.width, 400);
  assertEquals(badgeDims.height, 120);
});

Deno.test("Extensible Layout System - registering a custom layout with declarative fields", () => {
  const customId = "custom_test_banner";

  registerLayout({
    id: customId,
    name: "Custom Test Banner",
    description: "A custom test layout definition",
    supportsDescription: true,
    defaultOptions: {
      generateType: customId,
      title: "Custom Banner Title",
      description: "Custom banner description",
      customVariant: "featured",
      customPadding: 24,
      customActive: true,
      background: {
        type: "solid",
        color: "#1e1e2e",
        gradientStart: "#1e1e2e",
        gradientEnd: "#11111b",
        gradientDirection: "to-br",
        opacity: 1,
      },
      border: {
        color: "#cba6f7",
        width: 2,
        style: "solid",
        radius: 12,
        margin: 8,
        shadow: "glow",
      },
      titleFont: {
        color: "#cdd6f4",
        fontFamily: "Inter",
        fontWeight: "700",
        fontSize: 32,
        letterSpacing: 0,
        uppercase: false,
      },
      descriptionFont: {
        color: "#a6adc8",
        fontFamily: "Inter",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 1.4,
        opacity: 1,
      },
      image: {
        show: false,
        url: "",
        shape: "rounded",
        size: 64,
        verticalAlign: "middle",
      },
    },
    fields: [
      {
        key: "customVariant",
        label: "Custom Variant",
        type: "segmented",
        options: [
          { label: "Featured", value: "featured" },
          { label: "Normal", value: "normal" },
        ],
      },
      {
        key: "customPadding",
        label: "Custom Padding",
        type: "slider",
        min: 10,
        max: 50,
      },
      {
        key: "customActive",
        label: "Active Indicator",
        type: "boolean",
      },
    ],
    schema: {} as any,
    getDimensions: () => ({ width: 500, height: 250 }),
    getDimensionsLabel: () => "500 × 250 px",
    generate: (opts) => {
      const svg = globalThis.document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", "500");
      svg.setAttribute("height", "250");
      svg.setAttribute("data-custom", opts.customVariant || "none");
      return svg;
    },
  });

  assertEquals(hasLayout(customId), true);
  const layout = getLayout(customId);
  assertEquals(layout.name, "Custom Test Banner");
  assertEquals(layout.fields?.length, 3);
  assertEquals(layout.fields?.[0].type, "segmented");
  assertEquals(layout.fields?.[1].type, "slider");
  assertEquals(layout.fields?.[2].type, "boolean");

  const dims = getCardDimensions(layout.defaultOptions);
  assertEquals(dims.width, 500);
  assertEquals(dims.height, 250);

  const normalized = normalizeCardOptions(layout.defaultOptions);
  assertEquals(normalized.generateType, customId);
  assertEquals(normalized.title, "Custom Banner Title");

  const generated = generateSVG(normalized);
  assertExists(generated);
  assertEquals(generated.getAttribute("width"), "500");
  assertEquals(generated.getAttribute("height"), "250");
});

Deno.test("SVG Generation - standard formats produce SVGs", () => {
  const cardSvg = generateSVG(defaultStandardOptions);
  assertExists(cardSvg);
  assertEquals(cardSvg.tagName.toLowerCase(), "svg");

  const wideSvg = generateSVG(defaultWideOptions);
  assertExists(wideSvg);
  assertEquals(wideSvg.tagName.toLowerCase(), "svg");

  const wsSvg = generateSVG(defaultWidescreenOptions);
  assertExists(wsSvg);
  assertEquals(wsSvg.tagName.toLowerCase(), "svg");

  const badgeSvg = generateSVG(defaultBadgeOptions);
  assertExists(badgeSvg);
  assertEquals(badgeSvg.tagName.toLowerCase(), "svg");
});

Deno.test("Content Vertical Alignment - top, middle, and bottom shift positions correctly", () => {
  // 1. Wide Card Format
  const wideTopSvg = generateSVG({ ...defaultWideOptions, verticalAlign: "top" });
  const wideMidSvg = generateSVG({ ...defaultWideOptions, verticalAlign: "middle" });
  const wideBotSvg = generateSVG({ ...defaultWideOptions, verticalAlign: "bottom" });

  const getFirstTextY = (svg: SVGSVGElement) => {
    const text = svg.querySelector("text");
    assertExists(text, "Expected a text element");
    return parseFloat(text.getAttribute("y") || "0");
  };

  const wideTopY = getFirstTextY(wideTopSvg);
  const wideMidY = getFirstTextY(wideMidSvg);
  const wideBotY = getFirstTextY(wideBotSvg);

  assertEquals(wideTopY < wideMidY, true, `Top Y (${wideTopY}) should be less than Middle Y (${wideMidY})`);
  assertEquals(wideMidY < wideBotY, true, `Middle Y (${wideMidY}) should be less than Bottom Y (${wideBotY})`);

  // 2. Widescreen Format
  const wsTopSvg = generateSVG({ ...defaultWidescreenOptions, verticalAlign: "top" });
  const wsMidSvg = generateSVG({ ...defaultWidescreenOptions, verticalAlign: "middle" });
  const wsBotSvg = generateSVG({ ...defaultWidescreenOptions, verticalAlign: "bottom" });

  const wsTopY = getFirstTextY(wsTopSvg);
  const wsMidY = getFirstTextY(wsMidSvg);
  const wsBotY = getFirstTextY(wsBotSvg);

  assertEquals(wsTopY < wsMidY, true, `Widescreen Top Y (${wsTopY}) should be less than Middle Y (${wsMidY})`);
  assertEquals(wsMidY < wsBotY, true, `Widescreen Middle Y (${wsMidY}) should be less than Bottom Y (${wsBotY})`);

  // 3. Portrait Card Format
  const cardTopSvg = generateSVG({ ...defaultStandardOptions, verticalAlign: "top" });
  const cardMidSvg = generateSVG({ ...defaultStandardOptions, verticalAlign: "middle" });
  const cardBotSvg = generateSVG({ ...defaultStandardOptions, verticalAlign: "bottom" });

  const cardTopY = getFirstTextY(cardTopSvg);
  const cardMidY = getFirstTextY(cardMidSvg);
  const cardBotY = getFirstTextY(cardBotSvg);

  assertEquals(cardTopY < cardMidY, true, `Card Top Y (${cardTopY}) should be less than Middle Y (${cardMidY})`);
  assertEquals(cardMidY < cardBotY, true, `Card Middle Y (${cardMidY}) should be less than Bottom Y (${cardBotY})`);
});

Deno.test("Split Panel Background - supports full background customizations (gradient, solid)", () => {
  const wideSplitOptions = normalizeCardOptions({
    generateType: "widecard",
    wideVariant: "split",
    splitBackground: {
      type: "gradient",
      gradientStart: "#ff0055",
      gradientEnd: "#7928ca",
      gradientDirection: "to-br",
      opacity: 0.9,
    },
  });

  const svg = generateSVG(wideSplitOptions);
  assertExists(svg);
  assertEquals(svg.tagName.toLowerCase(), "svg");
  const svgStr = svg.outerHTML || (svg as any).innerHTML || "";
  // Check that the panel gradient def is created
  assertEquals(svgStr.includes("wideSplitBg"), true);
});

Deno.test("Split Variants - properly splits logo and text elements", () => {
  // 1. Widescreen Split Layout
  const wsSplitSvg = generateSVG(
    normalizeCardOptions({
      generateType: "widescreen",
      layoutStyle: "split",
      title: "Widescreen Title",
      description: "Widescreen Description",
      image: { show: true, url: "https://example.com/logo.png", size: 180 },
    }),
  );
  assertExists(wsSplitSvg);
  const wsImg = wsSplitSvg.querySelector("image");
  const wsText = wsSplitSvg.querySelector("text");
  assertExists(wsImg, "Logo image should exist");
  assertExists(wsText, "Title text should exist");
  const wsImgX = parseFloat(wsImg.getAttribute("x") || "0");
  const wsTextX = parseFloat(wsText.getAttribute("x") || "0");
  // Logo is on the left split panel, text is on the right main panel (x > imgX + imgSize)
  assertEquals(wsTextX > wsImgX + 180, true, "Widescreen text should be situated to the right of the split panel");

  // 2. Widecard Split Layout
  const wideSplitSvg = generateSVG(
    normalizeCardOptions({
      generateType: "widecard",
      wideVariant: "split",
      title: "Widecard Title",
      description: "Widecard Description",
      image: { show: true, url: "https://example.com/logo.png", size: 150 },
    }),
  );
  assertExists(wideSplitSvg);
  const wideImg = wideSplitSvg.querySelector("image");
  const wideText = wideSplitSvg.querySelector("text");
  assertExists(wideImg, "Logo image should exist");
  assertExists(wideText, "Title text should exist");
  const wideImgX = parseFloat(wideImg.getAttribute("x") || "0");
  const wideTextX = parseFloat(wideText.getAttribute("x") || "0");
  assertEquals(wideTextX > wideImgX + 150, true, "Widecard text should be situated to the right of the split panel");

  // 3. Portrait Card Split Layout (Top / Bottom split)
  const cardSplitSvg = generateSVG(
    normalizeCardOptions({
      generateType: "card",
      cardVariant: "split",
      title: "Card Title",
      description: "Card Description",
      image: { show: true, url: "https://example.com/logo.png", size: 160 },
    }),
  );
  assertExists(cardSplitSvg);
  const cardImg = cardSplitSvg.querySelector("image");
  const cardText = cardSplitSvg.querySelector("text");
  assertExists(cardImg, "Logo image should exist");
  assertExists(cardText, "Title text should exist");
  const cardImgY = parseFloat(cardImg.getAttribute("y") || "0");
  const cardTextY = parseFloat(cardText.getAttribute("y") || "0");
  assertEquals(cardTextY > cardImgY + 160, true, "Card text should be situated below the top split panel");
});


