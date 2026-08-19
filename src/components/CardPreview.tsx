import { FunctionalComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconEdit,
  IconFileTypePng,
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
  onBackToEdit?: () => void;
  onDownloadSVG?: () => void;
  onOpenPNGModal?: () => void;
}

type BackdropType = "checkerboard" | "dark" | "light";

export const CardPreview: FunctionalComponent<CardPreviewProps> = ({
  svgElement,
  options,
  onBackToEdit,
  onDownloadSVG,
  onOpenPNGModal,
}) => {
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
      class="card bg-base-100 shadow-md border border-base-300 p-3 sm:p-4 w-full"
      aria-labelledby="preview-heading"
    >
      {/* Header and Controls in a single streamlined bar */}
      <div class="flex flex-wrap justify-between items-center gap-1.5 sm:gap-2 mb-3 pb-2.5 sm:pb-3 border-b border-base-300 min-h-[36px]">
        <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <h2 id="preview-heading" class="text-xs sm:text-base font-bold truncate">
            Card Preview
          </h2>
          <span class="badge badge-info badge-xs sm:badge-sm font-semibold max-w-full truncate">
            {dimensionsLabel}
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-1 sm:gap-1.5">
          {/* Backdrop Switcher */}
          <div class="join">
            <div
              class="tooltip tooltip-bottom"
              data-tip="Checkerboard"
            >
              <button
                type="button"
                class={`join-item btn btn-xs px-1.5 ${
                  backdrop === "checkerboard"
                    ? "btn-active btn-primary shadow-xs"
                    : "btn-ghost bg-base-200"
                }`}
                onClick={() => setBackdrop("checkerboard")}
                aria-label="Checkerboard transparent backdrop"
              >
                <IconGridDots size={13} />
              </button>
            </div>
            <div class="tooltip tooltip-bottom" data-tip="Dark">
              <button
                type="button"
                class={`join-item btn btn-xs px-1.5 ${
                  backdrop === "dark"
                    ? "btn-active btn-primary shadow-xs"
                    : "btn-ghost bg-base-200"
                }`}
                onClick={() => setBackdrop("dark")}
                aria-label="Dark background"
              >
                <IconMoon size={13} />
              </button>
            </div>
            <div class="tooltip tooltip-bottom" data-tip="Light">
              <button
                type="button"
                class={`join-item btn btn-xs px-1.5 ${
                  backdrop === "light"
                    ? "btn-active btn-primary shadow-xs"
                    : "btn-ghost bg-base-200"
                }`}
                onClick={() => setBackdrop("light")}
                aria-label="Light background"
              >
                <IconSun size={13} />
              </button>
            </div>
          </div>

          <div class="divider divider-horizontal mx-0 my-0 h-4 hidden sm:flex"></div>

          {/* Zoom Controls */}
          <div class="join">
            <div class="tooltip tooltip-bottom" data-tip="Zoom Out">
              <button
                type="button"
                class="join-item btn btn-xs px-1.5 btn-ghost bg-base-200"
                onClick={handleZoomOut}
                aria-label="Zoom Out"
              >
                <IconZoomOut size={13} />
              </button>
            </div>

            <span class="join-item btn btn-xs btn-ghost pointer-events-none text-[11px] font-mono px-1 bg-base-200">
              {zoom}%
            </span>

            <div class="tooltip tooltip-bottom" data-tip="Zoom In">
              <button
                type="button"
                class="join-item btn btn-xs px-1.5 btn-ghost bg-base-200"
                onClick={handleZoomIn}
                aria-label="Zoom In"
              >
                <IconZoomIn size={13} />
              </button>
            </div>

            <div class="tooltip tooltip-bottom" data-tip="Reset Zoom">
              <button
                type="button"
                class="join-item btn btn-xs px-1.5 btn-ghost bg-base-200"
                onClick={handleResetZoom}
                aria-label="Reset Zoom"
              >
                <IconRotate size={13} />
              </button>
            </div>
          </div>

          <div class="divider divider-horizontal mx-0 my-0 h-4 hidden sm:flex"></div>

          {/* Copy SVG Button */}
          <div
            class="tooltip tooltip-left sm:tooltip-bottom"
            data-tip={copied ? "Copied!" : "Copy SVG Code"}
          >
            <button
              type="button"
              class={`btn btn-xs px-1.5 sm:px-2 ${
                copied
                  ? "btn-success text-success-content font-bold shadow-xs"
                  : "btn-outline btn-ghost"
              }`}
              onClick={handleCopySVG}
              aria-label={copied
                ? "Copied SVG to clipboard"
                : "Copy SVG Code"}
            >
              {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
              <span class="hidden sm:inline">
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        class={`flex justify-center items-start p-2.5 sm:p-4 rounded-xl border border-base-300 overflow-auto max-h-[60vh] sm:max-h-[75vh] transition-colors ${
          backdrop === "checkerboard" ? "preview-checkerboard" : ""
        }`}
        style={getBackdropStyle()}
      >
        <div
          class="w-full flex justify-center items-start"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
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

      {/* Mobile Quick Actions Bar */}
      {(onDownloadSVG || onOpenPNGModal || onBackToEdit) && (
        <div class="flex sm:hidden gap-2 pt-3 mt-3 border-t border-base-300">
          {onBackToEdit && (
            <button
              type="button"
              class="btn btn-sm btn-ghost flex-1 gap-1 text-xs"
              onClick={onBackToEdit}
            >
              <IconEdit size={14} />
              Edit
            </button>
          )}
          {onDownloadSVG && (
            <button
              type="button"
              class="btn btn-sm btn-outline flex-1 gap-1 text-xs"
              onClick={onDownloadSVG}
            >
              <IconDownload size={14} />
              SVG
            </button>
          )}
          {onOpenPNGModal && (
            <button
              type="button"
              class="btn btn-sm btn-primary flex-1 gap-1 text-xs"
              onClick={onOpenPNGModal}
            >
              <IconFileTypePng size={14} />
              PNG
            </button>
          )}
        </div>
      )}
    </section>
  );
};

