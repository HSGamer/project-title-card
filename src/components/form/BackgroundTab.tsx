import { FunctionalComponent } from "preact";
import { useRef } from "preact/hooks";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-preact";
import { BackgroundType, CardOptions, GradientDirection } from "../../types.ts";
import { FieldGuide } from "../FieldGuide.tsx";
import { SliderControl } from "../SliderControl.tsx";
import {
  COLOR_SWATCHES,
  GRADIENT_PRESETS,
  GradientPreset,
} from "../../data/suggestions.ts";

interface BackgroundTabProps {
  options: CardOptions;
  setOptions: (fn: (prev: CardOptions) => CardOptions) => void;
}

export const BackgroundTab: FunctionalComponent<BackgroundTabProps> = (
  { options, setOptions },
) => {
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const isBgDataUrl = options.background?.imageUrl?.startsWith("data:");

  const bgModes: { label: string; value: BackgroundType }[] = [
    { label: "Solid Color", value: "solid" },
    { label: "Gradient", value: "gradient" },
    { label: "Frosted Glass", value: "glass" },
    { label: "Custom Image", value: "image" },
  ];

  const handleApplyGradientPreset = (preset: GradientPreset) => {
    setOptions((prev) => ({
      ...prev,
      background: {
        ...prev.background,
        type: "gradient",
        gradientStart: preset.start,
        gradientMiddle: preset.middle,
        gradientEnd: preset.end,
        gradientDirection: preset.direction ||
          prev.background.gradientDirection || "to-br",
      },
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
        setOptions((prev) => ({
          ...prev,
          background: {
            ...prev.background,
            type: "image",
            imageUrl: dataUrl,
          },
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
    { label: "↘ Diagonal", value: "to-br" },
    { label: "↓ Down", value: "to-b" },
    { label: "↙ Left-Down", value: "to-bl" },
    { label: "◉ Radial", value: "radial" },
  ];

  return (
    <div class="flex flex-col gap-4">
      {/* Background Type */}
      <div class="flex flex-col gap-1.5 w-full">
        <div class="flex justify-between items-center h-5">
          <label class="text-xs font-semibold text-base-content flex items-center gap-1">
            Background Mode
            <FieldGuide fieldKey="background" />
          </label>
        </div>
        <div class="join w-full h-8">
          {bgModes.map((mode) => (
            <button
              type="button"
              key={mode.value}
              class={`join-item btn btn-sm h-8 min-h-0 flex-1 text-xs ${
                (options.background?.type || "solid") === mode.value
                  ? "btn-active btn-primary"
                  : "btn-ghost bg-base-200"
              }`}
              onClick={() =>
                setOptions((prev) => ({
                  ...prev,
                  background: {
                    ...prev.background,
                    type: mode.value,
                  },
                }))}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. SOLID / GLASS COLOR */}
      {(options.background?.type === "solid" ||
        options.background?.type === "glass") && (
        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex justify-between items-center h-5">
            <span class="text-xs font-semibold text-base-content">
              Background Color
            </span>
          </div>
          <div class="flex items-center gap-2 h-8">
            <input
              type="color"
              class="w-8 h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
              value={options.background?.color || "#0f172a"}
              onInput={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  background: {
                    ...prev.background,
                    color: e.currentTarget.value,
                  },
                }))}
            />
            <input
              type="text"
              class="input input-bordered input-sm h-8 flex-1 font-mono text-xs"
              value={options.background?.color || "#0f172a"}
              onInput={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  background: {
                    ...prev.background,
                    color: e.currentTarget.value,
                  },
                }))}
            />
          </div>

          <div class="flex flex-wrap gap-1.5 mt-1.5">
            {COLOR_SWATCHES.map((color) => (
              <button
                type="button"
                key={color}
                class="w-5 h-5 rounded-full border border-base-content/20 hover:scale-110 transition-transform cursor-pointer flex-shrink-0"
                style={{ backgroundColor: color }}
                onClick={() =>
                  setOptions((prev) => ({
                    ...prev,
                    background: { ...prev.background, color },
                  }))}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. GRADIENT CONTROLS */}
      {options.background?.type === "gradient" && (
        <div class="flex flex-col gap-3">
          <div>
            <span class="text-xs text-base-content/70 font-semibold block mb-1">
              Popular Gradient Themes:
            </span>
            <div class="flex flex-wrap gap-1">
              {GRADIENT_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  class="btn btn-xs h-6 min-h-0 text-[11px] btn-ghost border border-base-300 px-2 gap-1.5"
                  onClick={() => handleApplyGradientPreset(p)}
                >
                  <span
                    class="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                    style={{
                      background:
                        `linear-gradient(135deg, ${p.start}, ${p.end})`,
                    }}
                  />
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center h-5">
              <span class="text-xs font-semibold text-base-content">
                Gradient Direction
              </span>
            </div>
            <div class="join w-full h-8">
              {gradDirections.map((d) => (
                <button
                  type="button"
                  key={d.value}
                  class={`join-item btn btn-sm h-8 min-h-0 flex-1 text-xs ${
                    (options.background?.gradientDirection || "to-br") ===
                        d.value
                      ? "btn-active btn-primary"
                      : "btn-ghost bg-base-200"
                  }`}
                  onClick={() =>
                    setOptions((prev) => ({
                      ...prev,
                      background: {
                        ...prev.background,
                        gradientDirection: d.value,
                      },
                    }))}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gradient Stops */}
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
            <div class="flex flex-col gap-1.5 w-full">
              <div class="flex justify-between items-center h-5">
                <span class="text-xs font-semibold text-base-content">
                  Start Color
                </span>
              </div>
              <div class="flex items-center gap-1.5 h-8">
                <input
                  type="color"
                  class="w-8 h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
                  value={options.background?.gradientStart || "#ea580c"}
                  onInput={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      background: {
                        ...prev.background,
                        gradientStart: e.currentTarget.value,
                      },
                    }))}
                />
                <input
                  type="text"
                  class="input input-bordered input-sm h-8 flex-1 font-mono text-xs"
                  value={options.background?.gradientStart || "#ea580c"}
                  onInput={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      background: {
                        ...prev.background,
                        gradientStart: e.currentTarget.value,
                      },
                    }))}
                />
              </div>
            </div>

            <div class="flex flex-col gap-1.5 w-full">
              <div class="flex justify-between items-center h-5">
                <span class="text-xs font-semibold text-base-content">
                  Middle Color (Opt)
                </span>
              </div>
              <div class="flex items-center gap-1.5 h-8">
                <input
                  type="color"
                  class="w-8 h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
                  value={options.background?.gradientMiddle || "#db2777"}
                  onInput={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      background: {
                        ...prev.background,
                        gradientMiddle: e.currentTarget.value,
                      },
                    }))}
                />
                <input
                  type="text"
                  class="input input-bordered input-sm h-8 flex-1 font-mono text-xs"
                  placeholder="None"
                  value={options.background?.gradientMiddle || ""}
                  onInput={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      background: {
                        ...prev.background,
                        gradientMiddle: e.currentTarget.value || undefined,
                      },
                    }))}
                />
              </div>
            </div>

            <div class="flex flex-col gap-1.5 w-full">
              <div class="flex justify-between items-center h-5">
                <span class="text-xs font-semibold text-base-content">
                  End Color
                </span>
              </div>
              <div class="flex items-center gap-1.5 h-8">
                <input
                  type="color"
                  class="w-8 h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
                  value={options.background?.gradientEnd || "#7c3aed"}
                  onInput={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      background: {
                        ...prev.background,
                        gradientEnd: e.currentTarget.value,
                      },
                    }))}
                />
                <input
                  type="text"
                  class="input input-bordered input-sm h-8 flex-1 font-mono text-xs"
                  value={options.background?.gradientEnd || "#7c3aed"}
                  onInput={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      background: {
                        ...prev.background,
                        gradientEnd: e.currentTarget.value,
                      },
                    }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CUSTOM BACKGROUND IMAGE CONTROLS */}
      {options.background?.type === "image" && (
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center h-5">
              <span class="text-xs font-semibold text-base-content flex items-center gap-1">
                Background Image Source
                {isBgDataUrl && (
                  <span class="badge badge-sm badge-neutral gap-1 text-[10px] h-4">
                    <IconPhoto size={10} />
                    Uploaded File
                  </span>
                )}
              </span>
              {options.background?.imageUrl && (
                <button
                  type="button"
                  class="btn btn-xs h-5 min-h-0 btn-ghost text-error gap-0.5 px-1 text-[11px]"
                  onClick={() =>
                    setOptions((prev) => ({
                      ...prev,
                      background: { ...prev.background, imageUrl: "" },
                    }))}
                >
                  <IconX size={12} />
                  Clear Image
                </button>
              )}
            </div>

            <div class="flex gap-2 h-8">
              <input
                type="text"
                class="input input-bordered input-sm h-8 flex-1 font-mono text-xs"
                value={options.background?.imageUrl || ""}
                onInput={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    background: {
                      ...prev.background,
                      imageUrl: e.currentTarget.value,
                    },
                  }))}
                placeholder="Paste background image URL or upload image file..."
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
                class="btn btn-sm h-8 min-h-0 btn-outline border-base-300 gap-1 text-xs px-3"
                onClick={() => bgFileInputRef.current?.click()}
              >
                <IconUpload size={14} />
                Upload
              </button>
            </div>
          </div>

          <SliderControl
            label="Image Opacity"
            value={Math.round((options.background?.imageOpacity ?? 1) * 100)}
            min={10}
            max={100}
            step={5}
            unit="%"
            presets={[30, 50, 75, 100]}
            onChange={(val) =>
              setOptions((prev) => ({
                ...prev,
                background: { ...prev.background, imageOpacity: val / 100 },
              }))}
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div class="flex flex-col gap-1.5 w-full">
              <div class="flex justify-between items-center h-5">
                <span class="text-xs font-semibold text-base-content">
                  Overlay Tint Color
                </span>
              </div>
              <div class="flex items-center gap-2 h-8">
                <input
                  type="color"
                  class="w-8 h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
                  value={options.background?.overlayColor || "#0f172a"}
                  onInput={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      background: {
                        ...prev.background,
                        overlayColor: e.currentTarget.value,
                      },
                    }))}
                />
                <input
                  type="text"
                  class="input input-bordered input-sm h-8 flex-1 font-mono text-xs"
                  value={options.background?.overlayColor || "#0f172a"}
                  onInput={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      background: {
                        ...prev.background,
                        overlayColor: e.currentTarget.value,
                      },
                    }))}
                />
              </div>
            </div>

            <SliderControl
              label="Tint Overlay Opacity"
              value={Math.round(
                (options.background?.overlayOpacity ?? 0.4) * 100,
              )}
              min={0}
              max={95}
              step={5}
              unit="%"
              presets={[0, 25, 50, 75]}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  background: { ...prev.background, overlayOpacity: val / 100 },
                }))}
            />
          </div>
        </div>
      )}

      {/* Global Background Opacity */}
      <SliderControl
        label="Background Opacity"
        value={Math.round((options.background?.opacity ?? 1) * 100)}
        min={10}
        max={100}
        step={5}
        unit="%"
        presets={[25, 50, 75, 100]}
        onChange={(val) =>
          setOptions((prev) => ({
            ...prev,
            background: { ...prev.background, opacity: val / 100 },
          }))}
      />
    </div>
  );
};
