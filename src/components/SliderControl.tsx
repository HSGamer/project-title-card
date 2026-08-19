import { FunctionalComponent } from "preact";
import { FieldGuide } from "./FieldGuide.tsx";
import { FIELD_GUIDES } from "../data/suggestions.ts";

interface SliderControlProps {
  label: string;
  fieldKey?: keyof typeof FIELD_GUIDES;
  value: number;
  min: number;
  max: number;
  step?: number;
  presets?: number[];
  unit?: string;
  onChange: (val: number) => void;
  ariaLabel?: string;
}

export const SliderControl: FunctionalComponent<SliderControlProps> = ({
  label,
  fieldKey,
  value,
  min,
  max,
  step = 1,
  presets = [],
  unit = "px",
  onChange,
  ariaLabel,
}) => {
  return (
    <div class="flex flex-col gap-1.5 w-full">
      <div class="flex justify-between items-center h-5">
        <label class="text-xs font-semibold text-base-content flex items-center gap-1">
          {label}{" "}
          <span class="text-primary font-mono font-bold">({value}{unit})</span>
          {fieldKey && <FieldGuide fieldKey={fieldKey} />}
        </label>
      </div>

      <div class="flex items-center gap-2 h-8">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onInput={(e) => onChange(Number(e.currentTarget.value))}
          class="range range-primary range-xs flex-1"
          aria-label={ariaLabel || `${label} in ${unit}`}
        />
        <input
          type="number"
          min={min}
          max={max * 2}
          step={step}
          value={value}
          onInput={(e) => onChange(Number(e.currentTarget.value || min))}
          class="input input-bordered input-sm h-8 w-20 text-center font-mono text-xs flex-shrink-0"
          aria-label={`${label} numeric input`}
        />
      </div>

      {presets.length > 0 && (
        <div class="flex flex-wrap gap-1 mt-0.5">
          {presets.map((preset) => (
            <button
              type="button"
              key={preset}
              class={`btn btn-xs h-6 min-h-0 text-[11px] px-2 ${
                value === preset
                  ? "btn-primary"
                  : "btn-ghost border border-base-300 hover:bg-base-200"
              }`}
              onClick={() => onChange(preset)}
            >
              {preset}
              {unit}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
