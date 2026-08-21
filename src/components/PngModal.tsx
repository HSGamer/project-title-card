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

  const scaleOptions = [50, 100, 150, 200];

  return (
    <dialog class="modal modal-open modal-bottom sm:modal-middle">
      <div class="modal-box w-full max-w-md p-4 sm:p-6 rounded-t-2xl sm:rounded-2xl">
        <h3 class="font-bold text-base sm:text-lg flex items-center gap-2 mb-4">
          <IconPhoto size={20} class="text-primary flex-shrink-0" />
          Download as PNG
        </h3>

        <div class="flex flex-col gap-4">
          <div class="form-control w-full">
            <label class="label py-1">
              <span class="label-text font-semibold text-xs">File Name</span>
            </label>
            <input
              type="text"
              class="input input-bordered input-sm w-full font-mono text-xs"
              value={filename}
              onInput={(e) => setFilename(e.currentTarget.value)}
              placeholder="card.png"
            />
          </div>

          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[26px]">
              <label class="text-xs font-semibold text-base-content">
                Scale Percentage
              </label>
              <div class="flex items-center gap-1">
                <input
                  type="number"
                  min={10}
                  max={200}
                  step={5}
                  value={scale}
                  onInput={(e) => {
                    const val = parseFloat((e.currentTarget as HTMLInputElement).value);
                    if (!isNaN(val)) setScale(val);
                  }}
                  onBlur={(e) => {
                    const val = parseFloat((e.currentTarget as HTMLInputElement).value);
                    if (isNaN(val) || val < 10) setScale(10);
                    else if (val > 200) setScale(200);
                  }}
                  class="input input-bordered input-xs w-16 text-right font-mono font-semibold text-xs px-1.5 py-0.5 rounded-md focus:input-primary"
                  aria-label="Manual scale percentage"
                />
                <span class="text-[11px] font-mono text-base-content/60 select-none">
                  %
                </span>
              </div>
            </div>

            <div class="py-1">
              <input
                type="range"
                min={10}
                max={200}
                step={5}
                value={scale}
                onInput={(e) => setScale(Number(e.currentTarget.value))}
                class="range range-primary range-sm w-full cursor-pointer"
                aria-label={`Scale percentage: ${scale}%`}
              />
            </div>

            <div class="flex flex-wrap items-center gap-1 pt-0.5">
              {scaleOptions.map((p) => (
                <button
                  type="button"
                  key={p}
                  class={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                    scale === p
                      ? "bg-primary text-primary-content font-bold shadow-xs"
                      : "bg-base-200 hover:bg-base-300 text-base-content/80"
                  }`}
                  onClick={() => setScale(p)}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

          <div class="bg-base-200 p-3 rounded-xl flex justify-between items-center border border-base-300">
            <span class="text-xs text-base-content/70">Output Resolution:</span>
            <span class="text-xs sm:text-sm font-bold text-primary font-mono">
              {outputWidth} × {outputHeight} px
            </span>
          </div>
        </div>

        <div class="modal-action flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
          <button
            type="button"
            class="btn btn-sm btn-ghost w-full sm:w-auto"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            class={`btn btn-sm btn-primary w-full sm:w-auto ${loading ? "loading" : ""}`}
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
