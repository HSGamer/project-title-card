import { FunctionalComponent } from "preact";
import { SelectOption } from "../../layouts/types.ts";

export interface SelectControlProps<T = any> {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (val: T) => void;
  description?: string;
}

export const SelectControl: FunctionalComponent<SelectControlProps> = ({
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
      <select
        class="select select-bordered select-sm w-full font-medium text-xs"
        value={String(value)}
        onChange={(e) => {
          const selected = options.find(
            (opt) => String(opt.value) === e.currentTarget.value,
          );
          if (selected) {
            onChange(selected.value);
          }
        }}
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label} {opt.description ? `(${opt.description})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
};
