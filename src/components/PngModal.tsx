import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import { IconDownload, IconPhoto } from "@tabler/icons-preact";
import { CardOptions } from "../types.ts";
import { downloadPNG } from "../utils/export.ts";
import { getCardDimensions } from "../utils/dimensions.ts";

interface PngModalProps {
  opened: boolean;
  onClose: () => void;
  options: CardOptions;
}

export const PngModal: FunctionalComponent<PngModalProps> = (
  { opened, onClose, options },
) => {
  const [scale, setScale] = useState<number>(100);
  const [filename, setFilename] = useState<string>("card.png");
  const [loading, setLoading] = useState(false);

  if (!opened) return null;

  const { width: baseWidth, height: baseHeight } = getCardDimensions(options);

  const outputWidth = Math.round((baseWidth * scale) / 100);
  const outputHeight = Math.round((baseHeight * scale) / 100);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const safeFilename = filename.trim().endsWith(".png")
        ? filename.trim()
        : `${filename.trim()}.png`;
      await downloadPNG(options, scale, safeFilename);
      onClose();
    } catch (_err) {
      alert("Error generating PNG. Please check image CORS or format.");
    } finally {
      setLoading(false);
    }
  };

  const scalePresets = [50, 100, 150, 200];

  return (
    <dialog class="modal modal-open">
      <div class="modal-box max-w-md">
        <h3 class="font-bold text-lg flex items-center gap-2 mb-4">
          <IconPhoto size={20} class="text-primary" />
          Download as PNG
        </h3>

        <div class="flex flex-col gap-4">
          <div class="form-control w-full">
            <label class="label py-1">
              <span class="label-text font-semibold text-xs">File Name</span>
            </label>
            <input
              type="text"
              class="input input-bordered input-sm w-full font-mono"
              value={filename}
              onInput={(e) => setFilename(e.currentTarget.value)}
              placeholder="card.png"
            />
          </div>

          <div class="form-control w-full">
            <div class="flex justify-between items-center mb-1">
              <label class="label-text font-semibold text-xs">
                Scale Percentage ({scale}%)
              </label>
            </div>
            <div class="flex items-center gap-3">
              <input
                type="range"
                min={10}
                max={200}
                step={5}
                value={scale}
                onInput={(e) => setScale(Number(e.currentTarget.value))}
                class="range range-primary range-xs flex-1"
              />
              <input
                type="number"
                min={10}
                max={200}
                step={5}
                value={scale}
                onInput={(e) => setScale(Number(e.currentTarget.value || 100))}
                class="input input-bordered input-xs w-20 text-center font-mono"
              />
            </div>

            <div class="flex flex-wrap gap-1 mt-2">
              {scalePresets.map((p) => (
                <button
                  type="button"
                  key={p}
                  class={`btn btn-xs ${
                    scale === p ? "btn-primary" : "btn-ghost btn-outline"
                  }`}
                  onClick={() => setScale(p)}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

          <div class="bg-base-200 p-3 rounded-lg flex justify-between items-center border border-base-300">
            <span class="text-xs text-base-content/60">Output Resolution:</span>
            <span class="text-sm font-bold text-primary font-mono">
              {outputWidth} × {outputHeight} px
            </span>
          </div>
        </div>

        <div class="modal-action">
          <button type="button" class="btn btn-sm btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            class={`btn btn-sm btn-primary ${loading ? "loading" : ""}`}
            onClick={handleDownload}
            disabled={loading}
          >
            <IconDownload size={16} />
            Download PNG
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button type="button" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};
