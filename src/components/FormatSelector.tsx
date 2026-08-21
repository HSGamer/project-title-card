import { FunctionalComponent } from "preact";
import { CardOptions } from "../types.ts";
import { getAllLayouts, getLayout } from "../layouts/registry.ts";
import { FieldGuide } from "./FieldGuide.tsx";
import { LayoutDefinition } from "../layouts/types.ts";

interface FormatSelectorProps {
  options: CardOptions;
  onFormatChange: (newFormatId: string) => void;
}

export const FormatSelector: FunctionalComponent<FormatSelectorProps> = ({
  options,
  onFormatChange,
}) => {
  const layouts = getAllLayouts();
  const currentLayout = getLayout(options.generateType);

  const getDimensionText = (l: LayoutDefinition<any>) => {
    if (l.getDimensionsLabel) {
      return l.getDimensionsLabel(
        l.id === options.generateType ? options : l.defaultOptions,
      );
    }
    const dims = l.getDimensions(
      l.id === options.generateType ? options : l.defaultOptions,
    );
    return `${dims.width} × ${dims.height} px`;
  };

  return (
    <div class="flex flex-col gap-1.5 w-full">
      <div class="flex justify-between items-center min-h-[22px]">
        <label class="text-xs font-semibold text-base-content flex items-center gap-1">
          <span>Card Layout Format</span>
          <FieldGuide fieldKey="generateType" />
        </label>
        <span class="badge badge-ghost badge-xs font-mono font-bold text-primary">
          {getDimensionText(currentLayout)}
        </span>
      </div>

      <div class="flex flex-wrap gap-1.5 w-full">
        {layouts.map((l) => {
          const isSelected = options.generateType === l.id;
          return (
            <button
              type="button"
              key={l.id}
              onClick={() => onFormatChange(l.id)}
              class={`flex-1 min-w-[120px] p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-xs"
                  : "border-base-300 bg-base-100 hover:bg-base-200/60 hover:border-base-content/20"
              }`}
            >
              <div class="flex items-center justify-between gap-1 w-full mb-1">
                <span
                  class={`text-xs font-bold truncate ${
                    isSelected ? "text-primary" : "text-base-content"
                  }`}
                >
                  {l.name}
                </span>
                <span class="badge badge-ghost badge-xs text-[9px] font-mono opacity-70 flex-shrink-0">
                  {l.category || "Layout"}
                </span>
              </div>
              <span class="text-[10px] text-base-content/60 font-mono truncate">
                {getDimensionText(l)}
              </span>
            </button>
          );
        })}
      </div>

      <p class="text-[11px] text-base-content/70 leading-snug px-0.5">
        {currentLayout.description}
      </p>
    </div>
  );
};
