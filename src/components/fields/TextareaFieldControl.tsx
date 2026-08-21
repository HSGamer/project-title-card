import { FunctionalComponent } from "preact";
import { SuggestionChip } from "../../layouts/types.ts";

interface TextareaFieldControlProps {
  label: string;
  description?: string;
  value: string;
  placeholder?: string;
  rows?: number;
  suggestions?: SuggestionChip[];
  suggestionsLabel?: string;
  onChange: (val: string) => void;
}

export const TextareaFieldControl: FunctionalComponent<
  TextareaFieldControlProps
> = ({
  label,
  description,
  value,
  placeholder,
  rows = 3,
  suggestions,
  suggestionsLabel = "Templates:",
  onChange,
}) => {
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

      <textarea
        rows={rows}
        class="textarea textarea-bordered textarea-sm w-full font-medium text-xs leading-relaxed min-h-[64px]"
        value={value}
        placeholder={placeholder}
        onInput={(e) => onChange(e.currentTarget.value)}
      />

      {suggestions && suggestions.length > 0 && (
        <div class="flex flex-wrap items-center gap-1 pt-0.5">
          {suggestionsLabel && (
            <span class="text-[10px] text-base-content/60 font-medium">
              {suggestionsLabel}
            </span>
          )}
          {suggestions.map((chip) => (
            <button
              type="button"
              key={chip.label}
              class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-base-200 hover:bg-base-300 text-base-content/80 transition-colors"
              onClick={() => onChange(chip.value)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
