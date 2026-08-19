import { CardOptions } from "../types.ts";
import { generateSVG } from "../generators/index.ts";
import { Resvg } from "@resvg/resvg-js";
import { parseHTML } from "linkedom";
import { registerWindow } from "@svgdotjs/svg.js";

let isDomInitialized = false;

/**
 * Initializes a headless DOM environment if running in Deno/Node without a browser.
 */
export function ensureHeadlessDOM() {
  if (isDomInitialized) return;
  if (typeof globalThis.document === "undefined") {
    const dom = parseHTML("<!DOCTYPE html><html><body></body></html>");
    const win = dom.window as unknown as Record<string, unknown>;
    const svgElem = dom.SVGElement as unknown as {
      prototype: Record<string, unknown>;
    };

    if (typeof win.getComputedStyle !== "function") {
      win.getComputedStyle = (elem: unknown) => {
        const el = elem as { style?: Record<string, string> };
        return {
          getPropertyValue: (prop: string) => el?.style?.[prop] || "",
        };
      };
    }

    if (typeof svgElem.prototype.getBBox !== "function") {
      svgElem.prototype.getBBox = function (this: Element) {
        const textLen = (this.textContent || "").length;
        const fontSize = parseFloat(
          this.getAttribute("font-size") ||
            (this as unknown as { style?: { fontSize?: string } }).style
              ?.fontSize ||
            "16",
        );
        return {
          x: parseFloat(this.getAttribute("x") || "0"),
          y: parseFloat(this.getAttribute("y") || "0"),
          width: textLen * fontSize * 0.6,
          height: fontSize * 1.2,
        };
      };
    }

    if (typeof svgElem.prototype.getBoundingClientRect !== "function") {
      svgElem.prototype.getBoundingClientRect = function (this: {
        getBBox: () => { x: number; y: number; width: number; height: number };
      }) {
        const bbox = this.getBBox();
        return {
          x: bbox.x,
          y: bbox.y,
          top: bbox.y,
          left: bbox.x,
          right: bbox.x + bbox.width,
          bottom: bbox.y + bbox.height,
          width: bbox.width,
          height: bbox.height,
        };
      };
    }

    if (typeof svgElem.prototype.getScreenCTM !== "function") {
      svgElem.prototype.getScreenCTM = function () {
        return {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: 0,
          f: 0,
          inverse: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }),
          multiply: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }),
        };
      };
    }

    globalThis.document = dom.document as unknown as Document;
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.customElements = dom
      .customElements as unknown as CustomElementRegistry;
    (globalThis as unknown as Record<string, unknown>).HTMLElement =
      dom.HTMLElement;
    (globalThis as unknown as Record<string, unknown>).SVGElement =
      dom.SVGElement;
    registerWindow(
      dom.window as unknown as Window,
      dom.document as unknown as Document,
    );
  }
  isDomInitialized = true;
}

/**
 * Generates an SVG string representation from CardOptions in headless Deno/Node or browser.
 */
export function generateSVGString(options: CardOptions): string {
  ensureHeadlessDOM();
  const svgElement = generateSVG(options);
  if (typeof globalThis.XMLSerializer !== "undefined") {
    return new globalThis.XMLSerializer().serializeToString(svgElement);
  }
  return (svgElement as unknown as { outerHTML?: string }).outerHTML ||
    String(svgElement);
}

/**
 * Generates a PNG binary Uint8Array from CardOptions using resvg-js in headless Deno.
 */
export function generatePNGBuffer(
  options: CardOptions,
  scale = 1,
): Uint8Array {
  ensureHeadlessDOM();
  const svgString = generateSVGString(options);
  const resvg = new Resvg(svgString, {
    fitTo: {
      mode: "zoom",
      value: scale,
    },
    font: {
      loadSystemFonts: true,
      defaultFontFamily: "sans-serif",
    },
    shapeRendering: 2,
    textRendering: 2,
    imageRendering: 0,
  });

  const pngData = resvg.render();
  return pngData.asPng();
}

/**
 * Writes generated SVG or PNG card to disk.
 */
export async function writeCardToFile(
  options: CardOptions,
  filePath: string,
  scale = 1,
): Promise<void> {
  const isPng = filePath.toLowerCase().endsWith(".png");
  if (isPng) {
    const pngBuffer = generatePNGBuffer(options, scale);
    await Deno.writeFile(filePath, pngBuffer);
  } else {
    const svgString = generateSVGString(options);
    await Deno.writeTextFile(filePath, svgString);
  }
}
