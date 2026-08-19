import { FunctionalComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import {
  IconCheck,
  IconCopy,
  IconGridDots,
  IconMoon,
  IconRotate,
  IconSun,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-preact";
import { CardOptions } from "../types.ts";
import { getCardDimensionsLabel } from "../utils/dimensions.ts";

interface CardPreviewProps {
  svgElement: SVGSVGElement | null;
  options: CardOptions;
}

type BackdropType = "checkerboard" | "dark" | "light";

export const CardPreview: FunctionalComponent<CardPreviewProps> = (
  { svgElement, options },
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [backdrop, setBackdrop] = useState<BackdropType>("checkerboard");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      if (svgElement) {
        containerRef.current.appendChild(svgElement.cloneNode(true));
      }
    }
  }, [svgElement]);

  const dimensionsLabel = getCardDimensionsLabel(options);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 50));
  const handleResetZoom = () => setZoom(100);

  const handleCopySVG = async () => {
    if (!svgElement) return;
    try {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      await navigator.clipboard.writeText(svgString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      console.warn("Failed to copy SVG code to clipboard");
    }
  };

  const getBackdropStyle = () => {
    switch (backdrop) {
      case "dark":
        return { backgroundColor: "#090d16" };
      case "light":
        return { backgroundColor: "#ffffff" };
      case "checkerboard":
      default:
        return {};
    }
  };

  return (
    <section
      class="card bg-base-100 shadow-md border border-base-300 p-4 lg:sticky lg:top-20"
      aria-labelledby="preview-heading"
    >
      <div class="flex flex-wrap justify-between items-center gap-2 mb-4 pb-3 border-b border-base-300">
        <div class="flex items-center gap-2">
          <h2 id="preview-heading" class="text-base font-bold">
            Card Preview
          </h2>
          <span class="badge badge-info badge-sm font-semibold">
            {dimensionsLabel}
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-1.5">
          {/* Backdrop Switcher */}
          <div class="join">
            <div
              class="tooltip tooltip-bottom"
              data-tip="Checkerboard (Transparent)"
            >
              <button
                type="button"
                class={`join-item btn btn-xs ${
                  backdrop === "checkerboard"
                    ? "btn-active btn-primary"
                    : "btn-ghost"
                }`}
                onClick={() => setBackdrop("checkerboard")}
                aria-label="Checkerboard transparent backdrop"
              >
                <IconGridDots size={14} />
              </button>
            </div>
            <div class="tooltip tooltip-bottom" data-tip="Dark backdrop">
              <button
                type="button"
                class={`join-item btn btn-xs ${
                  backdrop === "dark" ? "btn-active btn-primary" : "btn-ghost"
                }`}
                onClick={() => setBackdrop("dark")}
                aria-label="Dark background"
              >
                <IconMoon size={14} />
              </button>
            </div>
            <div class="tooltip tooltip-bottom" data-tip="Light backdrop">
              <button
                type="button"
                class={`join-item btn btn-xs ${
                  backdrop === "light" ? "btn-active btn-primary" : "btn-ghost"
                }`}
                onClick={() => setBackdrop("light")}
                aria-label="Light background"
              >
                <IconSun size={14} />
              </button>
            </div>
          </div>

          <div class="divider divider-horizontal mx-0.5 my-0 h-6"></div>

          {/* Zoom Controls */}
          <div class="join">
            <div class="tooltip tooltip-bottom" data-tip="Zoom Out">
              <button
                type="button"
                class="join-item btn btn-xs btn-ghost"
                onClick={handleZoomOut}
                aria-label="Zoom Out"
              >
                <IconZoomOut size={14} />
              </button>
            </div>

            <span class="join-item btn btn-xs btn-ghost pointer-events-none text-xs font-mono px-1.5">
              {zoom}%
            </span>

            <div class="tooltip tooltip-bottom" data-tip="Zoom In">
              <button
                type="button"
                class="join-item btn btn-xs btn-ghost"
                onClick={handleZoomIn}
                aria-label="Zoom In"
              >
                <IconZoomIn size={14} />
              </button>
            </div>

            <div class="tooltip tooltip-bottom" data-tip="Reset Zoom">
              <button
                type="button"
                class="join-item btn btn-xs btn-ghost"
                onClick={handleResetZoom}
                aria-label="Reset Zoom"
              >
                <IconRotate size={14} />
              </button>
            </div>
          </div>

          <div class="divider divider-horizontal mx-0.5 my-0 h-6"></div>

          {/* Copy SVG Button */}
          <div
            class="tooltip tooltip-bottom"
            data-tip={copied ? "Copied!" : "Copy SVG Code"}
          >
            <button
              type="button"
              class={`btn btn-xs ${
                copied
                  ? "btn-success text-success-content"
                  : "btn-outline btn-ghost"
              }`}
              onClick={handleCopySVG}
              aria-label={copied ? "Copied SVG to clipboard" : "Copy SVG Code"}
            >
              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        class={`flex justify-center items-center p-6 rounded-xl border border-base-300 overflow-auto min-h-[360px] max-h-[70vh] transition-colors ${
          backdrop === "checkerboard" ? "preview-checkerboard" : ""
        }`}
        style={getBackdropStyle()}
      >
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "center center",
            transition: "transform 0.15s ease-out",
          }}
        >
          <div
            id="svgContainer"
            ref={containerRef}
            role="region"
            aria-label="SVG Preview Display"
          />
        </div>
      </div>
    </section>
  );
};
