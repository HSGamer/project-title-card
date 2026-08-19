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
  const handleInputChange = (e: Event) => {
    const raw = (e.currentTarget as HTMLInputElement).value;
    const val = parseFloat(raw);
    if (!isNaN(val)) {
      onChange(val);
    }
  };

  const handleInputBlur = (e: Event) => {
    const target = e.currentTarget as HTMLInputElement;
    const val = parseFloat(target.value);
    if (isNaN(val) || val < min) {
      onChange(min);
    } else if (val > max) {
      onChange(max);
    }
  };

  return (
    <div class="flex flex-col gap-1.5 w-full">
      {/* Label and Value Header with Manual Input Field */}
      <div class="flex justify-between items-center min-h-[26px]">
        <label class="text-xs font-semibold text-base-content flex items-center gap-1">
          <span>{label}</span>
          {fieldKey && <FieldGuide fieldKey={fieldKey} />}
        </label>
        <div class="flex items-center gap-1">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onInput={handleInputChange}
            onBlur={handleInputBlur}
            class="input input-bordered input-xs w-16 text-right font-mono font-semibold text-xs px-1.5 py-0.5 rounded-md focus:input-primary"
            aria-label={ariaLabel || `Manual value for ${label}`}
          />
          {unit && (
            <span class="text-[11px] font-mono text-base-content/60 select-none">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Fluid Full-Width Range Slider */}
      <div class="py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onInput={(e) => onChange(Number(e.currentTarget.value))}
          class="range range-primary range-sm w-full cursor-pointer"
          aria-label={ariaLabel || `${label}: ${value}${unit}`}
        />
      </div>

      {/* Minimalist Preset Chips */}
      {presets.length > 0 && (
        <div class="flex flex-wrap items-center gap-1 pt-0.5">
          {presets.map((preset) => (
            <button
              type="button"
              key={preset}
              class={`px-2 py-0.5 rounded-md text-[11px] font-mono font-medium transition-colors ${
                value === preset
                  ? "bg-primary text-primary-content font-bold shadow-xs"
                  : "bg-base-200 hover:bg-base-300 text-base-content/80"
              }`}
              onClick={() => onChange(preset)}
              aria-label={`Set ${label} to ${preset}${unit}`}
            >
              {preset}{unit}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


