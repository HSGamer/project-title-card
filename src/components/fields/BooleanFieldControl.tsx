import { FunctionalComponent } from "preact";

export interface BooleanFieldControlProps {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
  description?: string;
}

export const BooleanFieldControl: FunctionalComponent<
  BooleanFieldControlProps
> = ({
  label,
  value,
  onChange,
  description,
}) => {
  return (
    <div class="flex items-center justify-between p-2 rounded-lg bg-base-200/60 border border-base-300">
      <div class="flex flex-col">
        <span class="text-xs font-semibold text-base-content">{label}</span>
        {description && (
          <span class="text-[10px] text-base-content/60 leading-tight">
            {description}
          </span>
        )}
      </div>
      <input
        type="checkbox"
        class="toggle toggle-primary toggle-sm"
        checked={Boolean(value)}
        onChange={(e) => onChange(e.currentTarget.checked)}
      />
    </div>
  );
};
