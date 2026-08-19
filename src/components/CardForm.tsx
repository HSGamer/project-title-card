import { FunctionalComponent } from "preact";
import { useRef, useState } from "preact/hooks";
import {
  IconDownload,
  IconEye,
  IconFileExport,
  IconFileImport,
  IconFileTypePng,
  IconFrame,
  IconLayout,
  IconPalette,
  IconTypography,
} from "@tabler/icons-preact";
import {
  BadgeCardOptions,
  CardOptions,
  GenerateType,
  StandardCardOptions,
  WideCardOptions,
  WidescreenCardOptions,
} from "../types.ts";
import { exportOptions, importOptions } from "../utils/export.ts";
import { LayoutTab } from "./form/LayoutTab.tsx";
import { BackgroundTab } from "./form/BackgroundTab.tsx";
import { BorderTab } from "./form/BorderTab.tsx";
import { TypographyTab } from "./form/TypographyTab.tsx";

interface CardFormProps {
  options: CardOptions;
  setOptions: (fn: (prev: CardOptions) => CardOptions) => void;
  onReview: () => void;
  onDownloadSVG: () => void;
  onOpenPNGModal: () => void;
}

export const CardForm: FunctionalComponent<CardFormProps> = ({
  options,
  setOptions,
  onReview,
  onDownloadSVG,
  onOpenPNGModal,
}) => {
  const [activeTab, setActiveTab] = useState<string>("layout");
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // Format switcher preserving common visual state
  const handleFormatChange = (newFormat: GenerateType) => {
    setOptions((prev) => {
      const base = {
        title: prev.title,
        background: { ...prev.background },
        border: { ...prev.border },
        titleFont: { ...prev.titleFont },
        image: { ...prev.image },
      };
      const desc = "description" in prev
        ? prev.description
        : "Fast • Lightweight • Type-Safe\nZero Dependencies";
      const descFont = "descriptionFont" in prev
        ? { ...prev.descriptionFont }
        : {
          color: "#94a3b8",
          fontFamily:
            'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: "500" as const,
          fontSize: 22,
          lineHeight: 1.3,
          opacity: 1,
        };

      if (newFormat === "widecard") {
        return {
          ...base,
          generateType: "widecard",
          imagePosition: "left",
          description: desc,
          descriptionFont: { ...descFont, fontSize: 24 },
          titleFont: { ...base.titleFont, fontSize: 44 },
          image: { ...base.image, size: 220 },
        } as WideCardOptions;
      }
      if (newFormat === "widescreen") {
        return {
          ...base,
          generateType: "widescreen",
          layoutStyle: "split",
          description: desc,
          descriptionFont: { ...descFont, fontSize: 24 },
          titleFont: { ...base.titleFont, fontSize: 42 },
          image: { ...base.image, size: 240 },
        } as WidescreenCardOptions;
      }
      if (newFormat === "badge") {
        return {
          ...base,
          generateType: "badge",
          badgeWidth: 400,
          badgeHeight: 120,
          iconPosition: "left",
          titleFont: { ...base.titleFont, fontSize: 32 },
          image: { ...base.image, size: 70 },
        } as BadgeCardOptions;
      }
      // Standard card
      return {
        ...base,
        generateType: "card",
        textAlign: "center",
        description: desc,
        descriptionFont: { ...descFont, fontSize: 22 },
        titleFont: { ...base.titleFont, fontSize: 34 },
        image: { ...base.image, size: 260 },
      } as StandardCardOptions;
    });
  };

  const handleJsonImport = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    try {
      const imported = await importOptions(file);
      setOptions(() => imported);
    } catch (err) {
      alert(
        "Failed to parse JSON file: " +
          (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      if (jsonFileInputRef.current) jsonFileInputRef.current.value = "";
    }
  };

  return (
    <section
      class="card bg-base-100 shadow-md border border-base-300 p-4"
      aria-labelledby="card-form-heading"
    >
      {/* Top Quick Actions Bar */}
      <div class="grid grid-cols-3 gap-2 mb-4">
        <button
          type="button"
          class="btn btn-sm btn-primary gap-1.5 shadow-sm"
          onClick={onReview}
          aria-label="Refresh SVG Preview"
        >
          <IconEye size={16} />
          Review
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline gap-1.5"
          onClick={onDownloadSVG}
          aria-label="Download Card as SVG file"
        >
          <IconDownload size={16} />
          Download SVG
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline gap-1.5"
          onClick={onOpenPNGModal}
          aria-label="Open PNG Download options dialog"
        >
          <IconFileTypePng size={16} />
          Download PNG
        </button>
      </div>

      <div class="flex justify-between items-center mb-3">
        <h2 id="card-form-heading" class="text-base font-bold">
          Card Customizer
        </h2>
        <span class="badge badge-primary badge-sm font-semibold">
          Live Interactive
        </span>
      </div>

      {/* Main Tabs */}
      <div role="tablist" class="tabs tabs-boxed bg-base-200 p-1 mb-4">
        <button
          type="button"
          role="tab"
          class={`tab text-xs font-semibold gap-1.5 transition-all ${
            activeTab === "layout"
              ? "tab-active !bg-primary !text-primary-content shadow-sm"
              : ""
          }`}
          onClick={() => setActiveTab("layout")}
        >
          <IconLayout size={15} />
          Layout
        </button>
        <button
          type="button"
          role="tab"
          class={`tab text-xs font-semibold gap-1.5 transition-all ${
            activeTab === "background"
              ? "tab-active !bg-primary !text-primary-content shadow-sm"
              : ""
          }`}
          onClick={() => setActiveTab("background")}
        >
          <IconPalette size={15} />
          Background
        </button>
        <button
          type="button"
          role="tab"
          class={`tab text-xs font-semibold gap-1.5 transition-all ${
            activeTab === "border"
              ? "tab-active !bg-primary !text-primary-content shadow-sm"
              : ""
          }`}
          onClick={() => setActiveTab("border")}
        >
          <IconFrame size={15} />
          Border & Shadow
        </button>
        <button
          type="button"
          role="tab"
          class={`tab text-xs font-semibold gap-1.5 transition-all ${
            activeTab === "typography"
              ? "tab-active !bg-primary !text-primary-content shadow-sm"
              : ""
          }`}
          onClick={() => setActiveTab("typography")}
        >
          <IconTypography size={15} />
          Typography
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "layout" && (
          <LayoutTab
            options={options}
            setOptions={setOptions}
            onFormatChange={handleFormatChange}
          />
        )}
        {activeTab === "background" && (
          <BackgroundTab options={options} setOptions={setOptions} />
        )}
        {activeTab === "border" && (
          <BorderTab options={options} setOptions={setOptions} />
        )}
        {activeTab === "typography" && (
          <TypographyTab options={options} setOptions={setOptions} />
        )}
      </div>

      {/* Bottom Import & Export Presets */}
      <div class="flex flex-wrap justify-between items-center gap-2 pt-4 mt-6 border-t border-base-300">
        <span class="text-xs text-base-content/60">
          Save or load card settings:
        </span>
        <div class="flex gap-2">
          <input
            type="file"
            ref={jsonFileInputRef}
            onChange={handleJsonImport}
            accept="application/json"
            class="hidden"
          />
          <button
            type="button"
            class="btn btn-xs btn-outline gap-1"
            onClick={() => jsonFileInputRef.current?.click()}
          >
            <IconFileImport size={14} />
            Import JSON
          </button>
          <button
            type="button"
            class="btn btn-xs btn-outline gap-1"
            onClick={() => exportOptions(options)}
          >
            <IconFileExport size={14} />
            Export JSON
          </button>
        </div>
      </div>
    </section>
  );
};
