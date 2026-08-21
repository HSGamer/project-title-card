import { FunctionalComponent } from "preact";
import { BorderStyle, CardOptions, ShadowEffect } from "../../types.ts";
import { FieldGuide } from "../FieldGuide.tsx";
import { SliderControl } from "../SliderControl.tsx";
import { COLOR_SWATCHES } from "../../data/suggestions.ts";

interface BorderTabProps {
  options: CardOptions;
  setOptions: (fn: (prev: CardOptions) => CardOptions) => void;
}

export const BorderTab: FunctionalComponent<BorderTabProps> = (
  { options, setOptions },
) => {
  const borderStyles: { label: string; value: BorderStyle }[] = [
    { label: "Solid", value: "solid" },
    { label: "Dashed", value: "dashed" },
    { label: "Dotted", value: "dotted" },
    { label: "None", value: "none" },
  ];

  const shadowEffects: { label: string; value: ShadowEffect }[] = [
    { label: "None", value: "none" },
    { label: "Subtle", value: "subtle" },
    { label: "Soft", value: "soft" },
    { label: "Deep", value: "strong" },
    { label: "Glow", value: "glow" },
  ];

  return (
    <div class="flex flex-col gap-4">
      {/* 1. Border Style */}
      <div class="flex flex-col gap-1.5 w-full">
        <div class="flex justify-between items-center min-h-[22px]">
          <label class="text-xs font-semibold text-base-content flex items-center gap-1">
            <span>Border Style</span>
            <FieldGuide fieldKey="border" />
          </label>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full">
          {borderStyles.map((st) => (
            <button
              type="button"
              key={st.value}
              class={`btn btn-sm text-[11px] sm:text-xs px-1.5 py-1 h-auto min-h-[32px] sm:min-h-[36px] text-center leading-tight flex items-center justify-center ${
                (options.border?.style || "solid") === st.value
                  ? "btn-active btn-primary shadow-xs font-semibold"
                  : "btn-ghost bg-base-200 hover:bg-base-300"
              }`}
              onClick={() =>
                setOptions((prev) => ({
                  ...prev,
                  border: { ...prev.border, style: st.value },
                }))}
            >
              <span>{st.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Border Color */}
      <div class="flex flex-col gap-1.5 w-full">
        <div class="flex justify-between items-center min-h-[22px]">
          <span class="text-xs font-semibold text-base-content">
            Border Color
          </span>
        </div>
        <div class="flex items-center gap-2">
          <input
            type="color"
            class="w-9 h-9 sm:w-8 sm:h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
            value={options.border?.color || "#334155"}
            onInput={(e) =>
              setOptions((prev) => ({
                ...prev,
                border: { ...prev.border, color: e.currentTarget.value },
              }))}
          />
          <input
            type="text"
            class="input input-bordered input-sm flex-1 min-w-0 font-mono text-xs"
            value={options.border?.color || "#334155"}
            onInput={(e) =>
              setOptions((prev) => ({
                ...prev,
                border: { ...prev.border, color: e.currentTarget.value },
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
              onClick={() =>
                setOptions((prev) => ({
                  ...prev,
                  border: { ...prev.border, color },
                }))}
              aria-label={`Select border color ${color}`}
            />
          ))}
        </div>
      </div>

      {/* 3. Border Sizing Controls */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-start">
        <SliderControl
          label="Thickness"
          value={options.border?.width ?? 2}
          min={0}
          max={16}
          step={1}
          quickValues={[0, 1, 2, 4]}
          onChange={(val) =>
            setOptions((prev) => ({
              ...prev,
              border: { ...prev.border, width: val },
            }))}
        />

        <SliderControl
          label="Corner Radius"
          value={options.border?.radius ?? 16}
          min={0}
          max={60}
          step={2}
          quickValues={[0, 8, 16, 24, 32]}
          onChange={(val) =>
            setOptions((prev) => ({
              ...prev,
              border: { ...prev.border, radius: val },
            }))}
        />

        <SliderControl
          label="Outer Margin"
          value={options.border?.margin ?? 10}
          min={0}
          max={40}
          step={2}
          quickValues={[0, 5, 10, 15, 20]}
          onChange={(val) =>
            setOptions((prev) => ({
              ...prev,
              border: { ...prev.border, margin: val },
            }))}
        />
      </div>

      <div class="divider my-0"></div>

      {/* 4. Shadow & Glow Effects */}
      <div class="flex flex-col gap-1.5 w-full">
        <div class="flex justify-between items-center min-h-[22px]">
          <label class="text-xs font-semibold text-base-content flex items-center gap-1">
            <span>Shadow & Glow Effect</span>
            <FieldGuide fieldKey="shadow" />
          </label>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full">
          {shadowEffects.map((sh) => (
            <button
              type="button"
              key={sh.value}
              class={`btn btn-sm text-[11px] sm:text-xs px-1.5 py-1 h-auto min-h-[32px] sm:min-h-[36px] text-center leading-tight flex items-center justify-center ${
                (options.border?.shadow || "soft") === sh.value
                  ? "btn-active btn-primary shadow-xs font-semibold"
                  : "btn-ghost bg-base-200 hover:bg-base-300"
              }`}
              onClick={() =>
                setOptions((prev) => ({
                  ...prev,
                  border: { ...prev.border, shadow: sh.value },
                }))}
            >
              <span>{sh.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Glow Color Input if Neon Glow selected */}
      {options.border?.shadow === "glow" && (
        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex justify-between items-center min-h-[22px]">
            <span class="text-xs font-semibold text-base-content">
              Glow Tint Color
            </span>
          </div>
          <div class="flex items-center gap-2">
            <input
              type="color"
              class="w-9 h-9 sm:w-8 sm:h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
              value={options.border?.glowColor || options.border?.color ||
                "#06b6d4"}
              onInput={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  border: { ...prev.border, glowColor: e.currentTarget.value },
                }))}
            />
            <input
              type="text"
              class="input input-bordered input-sm flex-1 font-mono text-xs"
              value={options.border?.glowColor || options.border?.color ||
                "#06b6d4"}
              onInput={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  border: { ...prev.border, glowColor: e.currentTarget.value },
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
                onClick={() =>
                  setOptions((prev) => ({
                    ...prev,
                    border: { ...prev.border, glowColor: color },
                  }))}
                aria-label={`Select glow color ${color}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
