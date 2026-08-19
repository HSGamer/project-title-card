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
    { label: "Soft Shadow", value: "soft" },
    { label: "Deep Shadow", value: "strong" },
    { label: "Neon Glow", value: "glow" },
  ];

  return (
    <div class="flex flex-col gap-4">
      {/* Border Style & Width */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex justify-between items-center h-5">
            <label class="text-xs font-semibold text-base-content flex items-center gap-1">
              Border Style
              <FieldGuide fieldKey="border" />
            </label>
          </div>
          <div class="join w-full h-8">
            {borderStyles.map((st) => (
              <button
                type="button"
                key={st.value}
                class={`join-item btn btn-sm h-8 min-h-0 flex-1 text-xs ${
                  (options.border?.style || "solid") === st.value
                    ? "btn-active btn-primary"
                    : "btn-ghost bg-base-200"
                }`}
                onClick={() =>
                  setOptions((prev) => ({
                    ...prev,
                    border: { ...prev.border, style: st.value },
                  }))}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        <SliderControl
          label="Border Thickness"
          value={options.border?.width ?? 2}
          min={0}
          max={16}
          step={1}
          presets={[0, 1, 2, 4]}
          onChange={(val) =>
            setOptions((prev) => ({
              ...prev,
              border: { ...prev.border, width: val },
            }))}
        />
      </div>

      {/* Border Color */}
      <div class="flex flex-col gap-1.5 w-full">
        <div class="flex justify-between items-center h-5">
          <span class="text-xs font-semibold text-base-content">
            Border Color
          </span>
        </div>
        <div class="flex items-center gap-2 h-8">
          <input
            type="color"
            class="w-8 h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
            value={options.border?.color || "#334155"}
            onInput={(e) =>
              setOptions((prev) => ({
                ...prev,
                border: { ...prev.border, color: e.currentTarget.value },
              }))}
          />
          <input
            type="text"
            class="input input-bordered input-sm h-8 flex-1 font-mono text-xs"
            value={options.border?.color || "#334155"}
            onInput={(e) =>
              setOptions((prev) => ({
                ...prev,
                border: { ...prev.border, color: e.currentTarget.value },
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
                  border: { ...prev.border, color },
                }))}
              aria-label={`Select border color ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Border Radius & Margin */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <SliderControl
          label="Border Corner Radius"
          value={options.border?.radius ?? 16}
          min={0}
          max={60}
          step={2}
          presets={[0, 8, 16, 24, 32]}
          onChange={(val) =>
            setOptions((prev) => ({
              ...prev,
              border: { ...prev.border, radius: val },
            }))}
        />

        <SliderControl
          label="Border Margin"
          value={options.border?.margin ?? 10}
          min={0}
          max={40}
          step={2}
          presets={[0, 5, 10, 15, 20]}
          onChange={(val) =>
            setOptions((prev) => ({
              ...prev,
              border: { ...prev.border, margin: val },
            }))}
        />
      </div>

      <div class="divider my-0"></div>

      {/* Shadow & Glow Effects */}
      <div class="flex flex-col gap-1.5 w-full">
        <div class="flex justify-between items-center h-5">
          <label class="text-xs font-semibold text-base-content flex items-center gap-1">
            Shadow & Glow Effect
            <FieldGuide fieldKey="shadow" />
          </label>
        </div>
        <div class="join w-full h-8">
          {shadowEffects.map((sh) => (
            <button
              type="button"
              key={sh.value}
              class={`join-item btn btn-sm h-8 min-h-0 flex-1 text-xs ${
                (options.border?.shadow || "soft") === sh.value
                  ? "btn-active btn-primary"
                  : "btn-ghost bg-base-200"
              }`}
              onClick={() =>
                setOptions((prev) => ({
                  ...prev,
                  border: { ...prev.border, shadow: sh.value },
                }))}
            >
              {sh.label}
            </button>
          ))}
        </div>
      </div>

      {/* Glow Color Input if Neon Glow selected */}
      {options.border?.shadow === "glow" && (
        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex justify-between items-center h-5">
            <span class="text-xs font-semibold text-base-content">
              Glow Tint Color
            </span>
          </div>
          <div class="flex items-center gap-2 h-8">
            <input
              type="color"
              class="w-8 h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
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
              class="input input-bordered input-sm h-8 flex-1 font-mono text-xs"
              value={options.border?.glowColor || options.border?.color ||
                "#06b6d4"}
              onInput={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  border: { ...prev.border, glowColor: e.currentTarget.value },
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
