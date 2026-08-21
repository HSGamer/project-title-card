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
          wideVariant: "standard",
          imagePosition: "left",
          description: desc,
          descriptionFont: { ...descFont, fontSize: 22 },
          titleFont: { ...base.titleFont, fontSize: 42 },
          image: { ...base.image, size: 170 },
        } as WideCardOptions;
      }
      if (newFormat === "widescreen") {
        return {
          ...base,
          generateType: "widescreen",
          layoutStyle: "split",
          description: desc,
          descriptionFont: { ...descFont, fontSize: 22 },
          titleFont: { ...base.titleFont, fontSize: 40 },
          image: { ...base.image, size: 200 },
        } as WidescreenCardOptions;
      }
      if (newFormat === "badge") {
        return {
          ...base,
          generateType: "badge",
          badgeVariant: "standard",
          badgeWidth: 400,
          badgeHeight: 120,
          badgeAutoSize: false,
          iconPosition: "left",
          badgeLabel: "BUILD",
          labelColor: "#94a3b8",
          splitPosition: 0,
          statusText: "OPERATIONAL",
          statusColor: "#10b981",
          statusStyle: "pill",
          statusPosition: "right",
          titleFont: { ...base.titleFont, fontSize: 32 },
          image: { ...base.image, size: 60 },
        } as BadgeCardOptions;
      }
      // Standard card
      return {
        ...base,
        generateType: "card",
        cardVariant: "standard",
        textAlign: "center",
        description: desc,
        descriptionFont: { ...descFont, fontSize: 20 },
        titleFont: { ...base.titleFont, fontSize: 34 },
        image: { ...base.image, size: 220 },
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
      class="card bg-base-100 shadow-md border border-base-300 p-3 sm:p-4 w-full max-w-full min-w-0"
      aria-labelledby="card-form-heading"
    >
      {/* Header bar matching CardPreview */}
      <div class="flex flex-wrap justify-between items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-base-300 min-h-[36px]">
        <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <h2 id="card-form-heading" class="text-xs sm:text-base font-bold truncate">
            Card Customizer
          </h2>
          <span class="badge badge-primary badge-xs sm:badge-sm font-semibold hidden sm:inline-flex flex-shrink-0">
            Live Interactive
          </span>
        </div>

        <div class="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          <button
            type="button"
            class="btn btn-xs btn-primary gap-1 shadow-xs font-semibold px-2 sm:px-2.5"
            onClick={onReview}
            title="Refresh SVG Preview"
            aria-label="Refresh SVG Preview"
          >
            <IconEye size={13} />
            <span class="hidden sm:inline">Review</span>
          </button>
          <button
            type="button"
            class="btn btn-xs btn-outline gap-1 font-medium px-2 sm:px-2.5"
            onClick={onDownloadSVG}
            title="Download Card as SVG file"
            aria-label="Download Card as SVG file"
          >
            <IconDownload size={13} />
            <span class="hidden sm:inline">SVG</span>
          </button>
          <button
            type="button"
            class="btn btn-xs btn-outline gap-1 font-medium px-2 sm:px-2.5"
            onClick={onOpenPNGModal}
            title="Open PNG Download options"
            aria-label="Open PNG Download options dialog"
          >
            <IconFileTypePng size={13} />
            <span class="hidden sm:inline">PNG</span>
          </button>
        </div>
      </div>

      {/* Main Tabs (2x2 on mobile, 4 in a row on tablet/desktop) */}
      <div
        role="tablist"
        class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-base-200 p-1.5 rounded-xl mb-4 w-full"
      >
        <button
          type="button"
          role="tab"
          class={`btn btn-sm px-2.5 sm:px-3 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            activeTab === "layout"
              ? "btn-primary shadow-xs"
              : "btn-ghost text-base-content/70 hover:bg-base-300"
          }`}
          onClick={() => setActiveTab("layout")}
          aria-selected={activeTab === "layout"}
        >
          <IconLayout size={15} class="flex-shrink-0" />
          <span>Layout</span>
        </button>
        <button
          type="button"
          role="tab"
          class={`btn btn-sm px-2.5 sm:px-3 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            activeTab === "background"
              ? "btn-primary shadow-xs"
              : "btn-ghost text-base-content/70 hover:bg-base-300"
          }`}
          onClick={() => setActiveTab("background")}
          aria-selected={activeTab === "background"}
        >
          <IconPalette size={15} class="flex-shrink-0" />
          <span>Background</span>
        </button>
        <button
          type="button"
          role="tab"
          class={`btn btn-sm px-2.5 sm:px-3 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            activeTab === "border"
              ? "btn-primary shadow-xs"
              : "btn-ghost text-base-content/70 hover:bg-base-300"
          }`}
          onClick={() => setActiveTab("border")}
          aria-selected={activeTab === "border"}
        >
          <IconFrame size={15} class="flex-shrink-0" />
          <span>Border</span>
        </button>
        <button
          type="button"
          role="tab"
          class={`btn btn-sm px-2.5 sm:px-3 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            activeTab === "typography"
              ? "btn-primary shadow-xs"
              : "btn-ghost text-base-content/70 hover:bg-base-300"
          }`}
          onClick={() => setActiveTab("typography")}
          aria-selected={activeTab === "typography"}
        >
          <IconTypography size={15} class="flex-shrink-0" />
          <span>Typography</span>
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

      {/* Bottom Import & Export */}
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-4 mt-6 border-t border-base-300">
        <span class="text-xs text-base-content/60">
          Save or load card settings:
        </span>
        <div class="grid grid-cols-2 sm:flex gap-2">
          <input
            type="file"
            ref={jsonFileInputRef}
            onChange={handleJsonImport}
            accept="application/json"
            class="hidden"
          />
          <button
            type="button"
            class="btn btn-xs btn-outline gap-1 text-xs"
            onClick={() => jsonFileInputRef.current?.click()}
          >
            <IconFileImport size={14} />
            Import JSON
          </button>
          <button
            type="button"
            class="btn btn-xs btn-outline gap-1 text-xs"
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
