import { FunctionalComponent } from "preact";
import { SelectOption } from "../../layouts/types.ts";

export interface SegmentedControlProps<T = any> {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (val: T) => void;
  description?: string;
}

export const SegmentedControl: FunctionalComponent<SegmentedControlProps> = ({
  label,
  value,
  options,
  onChange,
  description,
}) => {
  return (
    <div class="flex flex-col gap-1.5 w-full">
      <div class="flex justify-between items-center min-h-[22px]">
        <span class="text-xs font-semibold text-base-content">{label}</span>
        {description && (
          <span class="text-[10px] text-base-content/60">{description}</span>
        )}
      </div>

      <div class="flex flex-wrap gap-1 p-1 bg-base-200/80 rounded-xl border border-base-300 w-full">
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              type="button"
              key={String(opt.value)}
              onClick={() => onChange(opt.value)}
              class={`flex-1 min-w-[fit-content] py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all text-center leading-tight whitespace-nowrap ${
                isActive
                  ? "bg-primary text-primary-content font-bold shadow-xs"
                  : "text-base-content/70 hover:bg-base-300/80 hover:text-base-content"
              }`}
              title={opt.description
                ? `${opt.label} (${opt.description})`
                : opt.label}
            >
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
