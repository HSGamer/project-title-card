import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import {
  IconAdjustments,
  IconCode,
  IconDownload,
  IconEye,
  IconFileTypePng,
  IconSparkles,
} from "@tabler/icons-preact";
import { CardOptions } from "../types.ts";
import { getLayout } from "../layouts/registry.ts";
import { DynamicFieldRenderer } from "./fields/DynamicFieldRenderer.tsx";
import { JsonInspector } from "./JsonInspector.tsx";
import { ThemePicker } from "./ThemePicker.tsx";
import { FormatSelector } from "./FormatSelector.tsx";
import { CardPreview } from "./CardPreview.tsx";

interface CardFormProps {
  options: CardOptions;
  setOptions: (fn: (prev: CardOptions) => CardOptions) => void;
  svgElement?: SVGSVGElement | null;
  onReview?: () => void;
  onDownloadSVG?: () => void;
  onOpenPNGModal?: () => void;
}

export type FormTab = "visual" | "themes" | "json" | "preview";

export const CardForm: FunctionalComponent<CardFormProps> = ({
  options,
  setOptions,
  svgElement,
  onReview,
  onDownloadSVG,
  onOpenPNGModal,
}) => {
  const [activeTab, setActiveTab] = useState<FormTab>("visual");

  const currentLayout = getLayout(options.generateType);

  const handleFormatChange = (newFormatId: string) => {
    if (newFormatId === options.generateType) return;
    const targetLayout = getLayout(newFormatId);
    setOptions((prev) => {
      const nextDefaults = { ...targetLayout.defaultOptions };
      return {
        ...nextDefaults,
        generateType: targetLayout.id,
        title: prev.title || nextDefaults.title,
        description: "description" in prev
          ? prev.description
          : (nextDefaults as any).description,
        background: { ...prev.background },
        ...(prev.splitBackground
          ? { splitBackground: { ...prev.splitBackground } }
          : {}),
        border: { ...prev.border },
        titleFont: {
          ...prev.titleFont,
          fontSize: nextDefaults.titleFont.fontSize,
        },
        descriptionFont:
          "descriptionFont" in prev && "descriptionFont" in nextDefaults
            ? {
              ...prev.descriptionFont,
              fontSize: nextDefaults.descriptionFont.fontSize,
            }
            : (nextDefaults as any).descriptionFont,
        image: { ...prev.image, size: nextDefaults.image.size },
      } as CardOptions;
    });
  };

  const getHeading = () => {
    switch (activeTab) {
      case "themes":
        return "Preset Themes";
      case "json":
        return "JSON Config";
      case "preview":
        return "Card Preview";
      case "visual":
      default:
        return "Customize Card";
    }
  };

  return (
    <div
      class="card bg-base-100 shadow-md border border-base-300 p-3 sm:p-4 w-full max-w-full min-w-0"
      role="region"
      aria-labelledby="card-form-heading"
    >
      {/* Top action header */}
      <div class="flex flex-wrap justify-between items-center gap-2 mb-3 pb-2.5 sm:pb-3 border-b border-base-300">
        <h2 id="card-form-heading" class="text-xs sm:text-base font-bold truncate">
          {getHeading()}
        </h2>

        <div class="flex flex-wrap items-center gap-1 sm:gap-1.5">
          {onReview && (
            <button
              type="button"
              class="btn btn-xs sm:btn-sm btn-ghost gap-1 text-[11px] sm:text-xs px-1.5 sm:px-2.5"
              onClick={onReview}
            >
              <IconEye size={14} />
              <span class="hidden sm:inline">Refresh Preview</span>
            </button>
          )}
          {onDownloadSVG && (
            <button
              type="button"
              class="btn btn-xs sm:btn-sm btn-outline gap-1 text-[11px] sm:text-xs px-2 sm:px-3"
              onClick={onDownloadSVG}
            >
              <IconDownload size={14} />
              <span>SVG</span>
            </button>
          )}
          {onOpenPNGModal && (
            <button
              type="button"
              class="btn btn-xs sm:btn-sm btn-primary gap-1 text-[11px] sm:text-xs px-2 sm:px-3"
              onClick={onOpenPNGModal}
            >
              <IconFileTypePng size={14} />
              <span>PNG</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs: on desktop shows 3 tabs; on mobile shows 4 tabs with flex-wrap so it never overflows */}
      <div class="bg-base-200/80 p-1 rounded-xl border border-base-300 mb-4 w-full">
        <div
          role="tablist"
          class="flex flex-wrap gap-1 w-full"
        >
          <button
            type="button"
            role="tab"
            class={`flex-1 min-w-[fit-content] flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg py-2 px-2.5 sm:px-3 transition-all ${
              activeTab === "visual"
                ? "bg-primary text-primary-content shadow-xs font-bold"
                : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
            }`}
            onClick={() => setActiveTab("visual")}
            aria-selected={activeTab === "visual"}
          >
            <IconAdjustments size={15} class="shrink-0" />
            <span>Visual Editor</span>
          </button>

          <button
            type="button"
            role="tab"
            class={`flex-1 min-w-[fit-content] flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg py-2 px-2.5 sm:px-3 transition-all ${
              activeTab === "themes"
                ? "bg-primary text-primary-content shadow-xs font-bold"
                : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
            }`}
            onClick={() => setActiveTab("themes")}
            aria-selected={activeTab === "themes"}
          >
            <IconSparkles size={15} class="shrink-0" />
            <span>Preset Themes</span>
          </button>

          <button
            type="button"
            role="tab"
            class={`flex-1 min-w-[fit-content] flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg py-2 px-2.5 sm:px-3 transition-all ${
              activeTab === "json"
                ? "bg-primary text-primary-content shadow-xs font-bold"
                : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
            }`}
            onClick={() => setActiveTab("json")}
            aria-selected={activeTab === "json"}
          >
            <IconCode size={15} class="shrink-0" />
            <span>JSON Config</span>
          </button>

          <button
            type="button"
            role="tab"
            class={`lg:hidden flex-1 min-w-[fit-content] flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg py-2 px-2.5 sm:px-3 transition-all ${
              activeTab === "preview"
                ? "bg-primary text-primary-content shadow-xs font-bold"
                : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
            }`}
            onClick={() => setActiveTab("preview")}
            aria-selected={activeTab === "preview"}
          >
            <IconEye size={15} class="shrink-0" />
            <span>Card Preview</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      {activeTab === "preview" && (
        <div class="lg:hidden w-full min-w-0">
          <CardPreview
            svgElement={svgElement || null}
            options={options}
            onBackToEdit={() => setActiveTab("visual")}
            onDownloadSVG={onDownloadSVG}
            onOpenPNGModal={onOpenPNGModal}
          />
        </div>
      )}

      {activeTab === "json" && (
        <JsonInspector options={options} setOptions={setOptions} />
      )}

      {activeTab === "themes" && (
        <ThemePicker options={options} setOptions={setOptions} />
      )}

      {activeTab === "visual" && (
        <div class="flex flex-col gap-3.5">
          {/* Scalable Layout Format Combobox */}
          <FormatSelector
            options={options}
            onFormatChange={handleFormatChange}
          />

          {/* Dynamic Field Renderer handles all fields declared by the layout definition */}
          <DynamicFieldRenderer
            fields={currentLayout.fields || []}
            options={options}
            setOptions={setOptions}
          />
        </div>
      )}
    </div>
  );
};
