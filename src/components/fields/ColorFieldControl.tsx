import { FunctionalComponent } from "preact";

interface ColorFieldControlProps {
  label: string;
  description?: string;
  value: string;
  fallback?: string;
  swatches?: string[];
  onChange: (val: string) => void;
}

export const ColorFieldControl: FunctionalComponent<ColorFieldControlProps> = ({
  label,
  description,
  value,
  fallback = "#ffffff",
  swatches,
  onChange,
}) => {
  const displayColor = value || fallback;

  return (
    <div class="flex flex-col gap-1.5 w-full">
      <div class="flex justify-between items-center min-h-[22px]">
        <span class="text-xs font-semibold text-base-content">{label}</span>
        {description && (
          <span class="text-[11px] text-base-content/60 font-mono">
            {description}
          </span>
        )}
      </div>

      <div class="flex items-center gap-2">
        <input
          type="color"
          class="w-9 h-9 sm:w-8 sm:h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
          value={displayColor}
          onInput={(e) => onChange(e.currentTarget.value)}
        />
        <input
          type="text"
          class="input input-bordered input-sm flex-1 min-w-0 font-mono text-xs"
          value={displayColor}
          onInput={(e) => onChange(e.currentTarget.value)}
        />
      </div>

      {swatches && swatches.length > 0 && (
        <div class="flex flex-wrap gap-1.5 pt-0.5">
          {swatches.map((color) => (
            <button
              type="button"
              key={color}
              class="w-6 h-6 rounded-full border border-base-content/20 hover:scale-110 active:scale-95 transition-transform cursor-pointer flex-shrink-0 shadow-xs"
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
