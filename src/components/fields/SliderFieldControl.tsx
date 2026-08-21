import { FunctionalComponent } from "preact";

export interface SliderFieldControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  quickValues?: number[];
  onChange: (val: number) => void;
  description?: string;
}

export const SliderFieldControl: FunctionalComponent<SliderFieldControlProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "px",
  quickValues = [],
  onChange,
  description,
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
      {/* Label, Description and Value Header with Manual Input Field */}
      <div class="flex justify-between items-center min-h-[26px]">
        <div class="flex flex-col">
          <span class="text-xs font-semibold text-base-content">{label}</span>
          {description && (
            <span class="text-[10px] text-base-content/60">{description}</span>
          )}
        </div>
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
            aria-label={`Manual value for ${label}`}
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
          aria-label={`${label}: ${value}${unit}`}
        />
      </div>

      {/* Quick Value Chips */}
      {quickValues.length > 0 && (
        <div class="flex flex-wrap items-center gap-1 pt-0.5">
          {quickValues.map((val) => (
            <button
              type="button"
              key={val}
              class={`px-2 py-0.5 rounded-md text-[11px] font-mono font-medium transition-colors ${
                value === val
                  ? "bg-primary text-primary-content font-bold shadow-xs"
                  : "bg-base-200 hover:bg-base-300 text-base-content/80"
              }`}
              onClick={() => onChange(val)}
              aria-label={`Set ${label} to ${val}${unit}`}
            >
              {val}{unit}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
