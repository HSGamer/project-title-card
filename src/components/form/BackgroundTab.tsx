import { FunctionalComponent } from "preact";
import { useRef, useState } from "preact/hooks";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-preact";
import {
  BackgroundConfig,
  BackgroundType,
  CardOptions,
  GradientDirection,
} from "../../types.ts";
import {
  DEFAULT_SPLIT_BACKGROUND,
  defaultStandardOptions,
} from "../../generators/defaults.ts";
import { FieldGuide } from "../FieldGuide.tsx";
import { SliderControl } from "../SliderControl.tsx";
import {
  COLOR_SWATCHES,
  GRADIENT_PALETTES,
  GradientPalette,
} from "../../data/suggestions.ts";

interface BackgroundTabProps {
  options: CardOptions;
  setOptions: (fn: (prev: CardOptions) => CardOptions) => void;
}

export const BackgroundTab: FunctionalComponent<BackgroundTabProps> = (
  { options, setOptions },
) => {
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const [targetSide, setTargetSide] = useState<"primary" | "split">("primary");

  const isSplitLayout =
    (options.generateType === "card" && options.cardVariant === "split") ||
    (options.generateType === "widecard" && options.wideVariant === "split") ||
    (options.generateType === "widescreen" && options.layoutStyle === "split") ||
    (options.generateType === "badge" && options.badgeVariant === "split");

  const currentBg: BackgroundConfig = (isSplitLayout && targetSide === "split")
    ? (options.splitBackground || DEFAULT_SPLIT_BACKGROUND)
    : (options.background || defaultStandardOptions.background);

  const isBgDataUrl = currentBg.imageUrl?.startsWith("data:");

  const updateCurrentBg = (
    updater: (bg: BackgroundConfig) => BackgroundConfig,
  ) => {
    setOptions((prev) => {
      if (isSplitLayout && targetSide === "split") {
        const existing = prev.splitBackground || DEFAULT_SPLIT_BACKGROUND;
        const nextSplitBg = updater(existing);
        return {
          ...prev,
          splitBackground: nextSplitBg,
        };
      } else {
        const existing = prev.background || defaultStandardOptions.background;
        return {
          ...prev,
          background: updater(existing),
        };
      }
    });
  };

  const bgModes: { label: string; value: BackgroundType }[] = [
    { label: "Solid", value: "solid" },
    { label: "Gradient", value: "gradient" },
    { label: "Glass", value: "glass" },
    { label: "Image", value: "image" },
  ];

  const handleApplyGradientPalette = (palette: GradientPalette) => {
    updateCurrentBg((bg) => ({
      ...bg,
      type: "gradient",
      gradientStart: palette.start,
      gradientMiddle: palette.middle,
      gradientEnd: palette.end,
      gradientDirection: palette.direction || bg.gradientDirection || "to-br",
    }));
  };

  const handleBgImageUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const dataUrl = reader.result;
        updateCurrentBg((bg) => ({
          ...bg,
          type: "image",
          imageUrl: dataUrl,
        }));
      }
      if (bgFileInputRef.current) bgFileInputRef.current.value = "";
    };
    reader.onerror = () => {
      if (bgFileInputRef.current) bgFileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const gradDirections: { label: string; value: GradientDirection }[] = [
    { label: "→ Right", value: "to-r" },
    { label: "↘ Diag R", value: "to-br" },
    { label: "↓ Down", value: "to-b" },
    { label: "↙ Diag L", value: "to-bl" },
    { label: "◉ Radial", value: "radial" },
  ];

  // Dynamic side tab labels based on card type
  const primarySideLabel = options.generateType === "card"
    ? "Content Side (Bottom)"
    : options.generateType === "badge"
    ? "Value Side (Right)"
    : "Content Side";

  const splitSideLabel = options.generateType === "card"
    ? "Logo Side (Top)"
    : options.generateType === "badge"
    ? "Label Side (Left)"
    : "Logo Side (Panel)";

  return (
    <div class="flex flex-col gap-4">
      {/* Split Section Switcher (when Split Variant is active) */}
      {isSplitLayout && (
        <div class="flex flex-col gap-1.5 p-2 rounded-xl bg-base-200/70 border border-base-300">
          <div class="flex items-center justify-between min-h-[20px]">
            <span class="text-xs font-semibold text-base-content flex items-center gap-1.5">
              <span>Split Panel Background</span>
              <span class="badge badge-xs badge-primary font-medium">
                Split Active
              </span>
            </span>
          </div>
          <div class="grid grid-cols-2 gap-1.5 w-full">
            <button
              type="button"
              class={`btn btn-sm text-[11px] sm:text-xs h-auto min-h-[32px] sm:min-h-[34px] px-2 py-1 flex items-center justify-center font-medium ${
                targetSide === "primary"
                  ? "btn-primary shadow-xs font-semibold"
                  : "btn-ghost bg-base-100 hover:bg-base-300"
              }`}
              onClick={() => setTargetSide("primary")}
            >
              {primarySideLabel}
            </button>
            <button
              type="button"
              class={`btn btn-sm text-[11px] sm:text-xs h-auto min-h-[32px] sm:min-h-[34px] px-2 py-1 flex items-center justify-center font-medium ${
                targetSide === "split"
                  ? "btn-primary shadow-xs font-semibold"
                  : "btn-ghost bg-base-100 hover:bg-base-300"
              }`}
              onClick={() => setTargetSide("split")}
            >
              {splitSideLabel}
            </button>
          </div>
        </div>
      )}

      {/* Background Type */}
      <div class="flex flex-col gap-1.5 w-full">
        <div class="flex justify-between items-center min-h-[22px]">
          <label class="text-xs font-semibold text-base-content flex items-center gap-1">
            <span>
              {isSplitLayout
                ? `${
                  targetSide === "primary" ? primarySideLabel : splitSideLabel
                } Mode`
                : "Background Mode"}
            </span>
            <FieldGuide fieldKey="background" />
          </label>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full">
          {bgModes.map((mode) => (
            <button
              type="button"
              key={mode.value}
              class={`btn btn-sm text-[11px] sm:text-xs px-1.5 py-1 h-auto min-h-[32px] sm:min-h-[36px] text-center leading-tight flex items-center justify-center ${
                (currentBg.type || "solid") === mode.value
                  ? "btn-active btn-primary shadow-xs font-semibold"
                  : "btn-ghost bg-base-200 hover:bg-base-300"
              }`}
              onClick={() =>
                updateCurrentBg((bg) => ({ ...bg, type: mode.value }))}
            >
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. SOLID / GLASS COLOR */}
      {(currentBg.type === "solid" || currentBg.type === "glass") && (
        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex justify-between items-center min-h-[22px]">
            <span class="text-xs font-semibold text-base-content">
              Background Color
            </span>
          </div>
          <div class="flex items-center gap-2">
            <input
              type="color"
              class="w-9 h-9 sm:w-8 sm:h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
              value={currentBg.color || "#0f172a"}
              onInput={(e) =>
                updateCurrentBg((bg) => ({
                  ...bg,
                  color: e.currentTarget.value,
                }))}
            />
            <input
              type="text"
              class="input input-bordered input-sm flex-1 min-w-0 font-mono text-xs"
              value={currentBg.color || "#0f172a"}
              onInput={(e) =>
                updateCurrentBg((bg) => ({
                  ...bg,
                  color: e.currentTarget.value,
                }))}
            />
          </div>

          <div class="flex flex-wrap gap-2 sm:gap-1.5 mt-1.5">
            {COLOR_SWATCHES.map((color) => (
              <button
                type="button"
                key={color}
                class="w-7 h-7 sm:w-6 sm:h-6 rounded-full border border-base-content/20 hover:scale-110 active:scale-95 transition-transform cursor-pointer flex-shrink-0 shadow-xs"
                style={{ backgroundColor: color }}
                onClick={() => updateCurrentBg((bg) => ({ ...bg, color }))}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. GRADIENT CONTROLS */}
      {currentBg.type === "gradient" && (
        <div class="flex flex-col gap-3">
          <div>
            <span class="text-[11px] text-base-content/70 font-semibold block mb-1">
              Popular Gradient Themes:
            </span>
            <div class="flex flex-wrap gap-1.5">
              {GRADIENT_PALETTES.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  class="px-2.5 py-1 rounded-md text-xs font-medium bg-base-200 hover:bg-base-300 text-base-content/80 flex items-center gap-1.5 transition-colors"
                  onClick={() => handleApplyGradientPalette(p)}
                >
                  <span
                    class="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                    style={{
                      background:
                        `linear-gradient(135deg, ${p.start}, ${p.end})`,
                    }}
                  />
                  <span class="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content">
                Gradient Direction
              </span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full">
              {gradDirections.map((d) => (
                <button
                  type="button"
                  key={d.value}
                  class={`btn btn-sm text-[11px] sm:text-xs px-1.5 py-1 h-auto min-h-[32px] sm:min-h-[36px] text-center leading-tight flex items-center justify-center ${
                    (currentBg.gradientDirection || "to-br") === d.value
                      ? "btn-active btn-primary shadow-xs font-semibold"
                      : "btn-ghost bg-base-200 hover:bg-base-300"
                  }`}
                  onClick={() =>
                    updateCurrentBg((bg) => ({
                      ...bg,
                      gradientDirection: d.value,
                    }))}
                >
                  <span>{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gradient Stops */}
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-start">
            <div class="flex flex-col gap-1.5 w-full">
              <div class="flex justify-between items-center min-h-[22px]">
                <span class="text-xs font-semibold text-base-content">
                  Start Color
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <input
                  type="color"
                  class="w-9 h-9 sm:w-8 sm:h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
                  value={currentBg.gradientStart || "#ea580c"}
                  onInput={(e) =>
                    updateCurrentBg((bg) => ({
                      ...bg,
                      gradientStart: e.currentTarget.value,
                    }))}
                />
                <input
                  type="text"
                  class="input input-bordered input-sm flex-1 font-mono text-xs"
                  value={currentBg.gradientStart || "#ea580c"}
                  onInput={(e) =>
                    updateCurrentBg((bg) => ({
                      ...bg,
                      gradientStart: e.currentTarget.value,
                    }))}
                />
              </div>
            </div>

            <div class="flex flex-col gap-1.5 w-full">
              <div class="flex justify-between items-center min-h-[22px]">
                <span class="text-xs font-semibold text-base-content">
                  Middle Color (Opt)
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <input
                  type="color"
                  class="w-9 h-9 sm:w-8 sm:h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
                  value={currentBg.gradientMiddle || "#db2777"}
                  onInput={(e) =>
                    updateCurrentBg((bg) => ({
                      ...bg,
                      gradientMiddle: e.currentTarget.value,
                    }))}
                />
                <input
                  type="text"
                  class="input input-bordered input-sm flex-1 font-mono text-xs"
                  placeholder="None"
                  value={currentBg.gradientMiddle || ""}
                  onInput={(e) =>
                    updateCurrentBg((bg) => ({
                      ...bg,
                      gradientMiddle: e.currentTarget.value || undefined,
                    }))}
                />
              </div>
            </div>

            <div class="flex flex-col gap-1.5 w-full">
              <div class="flex justify-between items-center min-h-[22px]">
                <span class="text-xs font-semibold text-base-content">
                  End Color
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <input
                  type="color"
                  class="w-9 h-9 sm:w-8 sm:h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
                  value={currentBg.gradientEnd || "#7c3aed"}
                  onInput={(e) =>
                    updateCurrentBg((bg) => ({
                      ...bg,
                      gradientEnd: e.currentTarget.value,
                    }))}
                />
                <input
                  type="text"
                  class="input input-bordered input-sm flex-1 font-mono text-xs"
                  value={currentBg.gradientEnd || "#7c3aed"}
                  onInput={(e) =>
                    updateCurrentBg((bg) => ({
                      ...bg,
                      gradientEnd: e.currentTarget.value,
                    }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CUSTOM BACKGROUND IMAGE CONTROLS */}
      {currentBg.type === "image" && (
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content flex items-center gap-1">
                <span>Background Image Source</span>
                {isBgDataUrl && (
                  <span class="badge badge-sm badge-neutral gap-1 text-[10px] py-0 px-1.5">
                    <IconPhoto size={10} />
                    Uploaded
                  </span>
                )}
              </span>
              {currentBg.imageUrl && (
                <button
                  type="button"
                  class="btn btn-xs btn-ghost text-error gap-0.5"
                  onClick={() =>
                    updateCurrentBg((bg) => ({ ...bg, imageUrl: "" }))}
                >
                  <IconX size={12} />
                  Clear
                </button>
              )}
            </div>

            <div class="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                class="input input-bordered input-sm flex-1 font-mono text-xs w-full"
                value={currentBg.imageUrl || ""}
                onInput={(e) =>
                  updateCurrentBg((bg) => ({
                    ...bg,
                    imageUrl: e.currentTarget.value,
                  }))}
                placeholder="Paste background image URL or upload file..."
              />
              <input
                type="file"
                ref={bgFileInputRef}
                onChange={handleBgImageUpload}
                accept="image/*"
                class="hidden"
              />
              <button
                type="button"
                class="btn btn-sm btn-outline gap-1 text-xs w-full sm:w-auto"
                onClick={() => bgFileInputRef.current?.click()}
              >
                <IconUpload size={14} />
                Upload Image
              </button>
            </div>
          </div>

          <SliderControl
            label="Image Opacity"
            value={Math.round((currentBg.imageOpacity ?? 1) * 100)}
            min={10}
            max={100}
            step={5}
            unit="%"
            quickValues={[30, 50, 75, 100]}
            onChange={(val) =>
              updateCurrentBg((bg) => ({
                ...bg,
                imageOpacity: val / 100,
              }))}
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
            <div class="flex flex-col gap-1.5 w-full">
              <div class="flex justify-between items-center min-h-[22px]">
                <span class="text-xs font-semibold text-base-content">
                  Overlay Tint Color
                </span>
              </div>
              <div class="flex items-center gap-2">
                <input
                  type="color"
                  class="w-9 h-9 sm:w-8 sm:h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
                  value={currentBg.overlayColor || "#0f172a"}
                  onInput={(e) =>
                    updateCurrentBg((bg) => ({
                      ...bg,
                      overlayColor: e.currentTarget.value,
                    }))}
                />
                <input
                  type="text"
                  class="input input-bordered input-sm flex-1 font-mono text-xs"
                  value={currentBg.overlayColor || "#0f172a"}
                  onInput={(e) =>
                    updateCurrentBg((bg) => ({
                      ...bg,
                      overlayColor: e.currentTarget.value,
                    }))}
                />
              </div>
            </div>

            <SliderControl
              label="Tint Overlay Opacity"
              value={Math.round(
                (currentBg.overlayOpacity ?? 0.4) * 100,
              )}
              min={0}
              max={95}
              step={5}
              unit="%"
              quickValues={[0, 25, 50, 75]}
              onChange={(val) =>
                updateCurrentBg((bg) => ({
                  ...bg,
                  overlayOpacity: val / 100,
                }))}
            />
          </div>
        </div>
      )}

      {/* Global Background Opacity */}
      <SliderControl
        label="Background Opacity"
        value={Math.round((currentBg.opacity ?? 1) * 100)}
        min={10}
        max={100}
        step={5}
        unit="%"
        quickValues={[25, 50, 75, 100]}
        onChange={(val) =>
          updateCurrentBg((bg) => ({ ...bg, opacity: val / 100 }))}
      />
    </div>
  );
};
