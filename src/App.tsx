import { FunctionalComponent } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { IconEdit, IconEye } from "@tabler/icons-preact";
import { CardOptions } from "./types.ts";
import { defaultOptions, generateSVG } from "./generators/index.ts";
import { downloadSVG } from "./utils/export.ts";
import { AppHeader } from "./components/AppHeader.tsx";
import { CardForm } from "./components/CardForm.tsx";
import { CardPreview } from "./components/CardPreview.tsx";
import { PngModal } from "./components/PngModal.tsx";

export const App: FunctionalComponent = () => {
  const [options, setOptions] = useState<CardOptions>(defaultOptions);
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);
  const [isPngModalOpen, setIsPngModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof globalThis !== "undefined" && globalThis.matchMedia) {
      return globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Sync theme attribute to html/document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const updatePreview = useCallback(async (currentOptions: CardOptions) => {
    try {
      const svg = await generateSVG(currentOptions);
      setSvgElement(svg);
    } catch (err) {
      console.error("Failed to generate SVG preview:", err);
    }
  }, []);

  useEffect(() => {
    updatePreview(options);
  }, [options, updatePreview]);

  const handleReview = () => {
    updatePreview(options);
    setMobileView("preview");
    setStatusMessage("Preview refreshed");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleDownloadSVG = async () => {
    try {
      await downloadSVG(options);
      setStatusMessage("SVG downloaded successfully");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (_err) {
      alert("Failed to download SVG");
    }
  };

  return (
    <div class="min-h-screen bg-base-200 text-base-content flex flex-col">
      {/* Skip to main content link for keyboard accessibility */}
      <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:btn focus:btn-primary focus:btn-sm"
      >
        Skip to main content
      </a>

      {/* Screen reader announcement region */}
      <div role="status" aria-live="polite" class="sr-only">
        {statusMessage}
      </div>

      <AppHeader
        setOptions={setOptions}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main
        id="main-content"
        class="flex-1 container mx-auto px-2 sm:px-4 py-3 sm:py-6 max-w-7xl"
        tabIndex={-1}
      >
        {/* Mobile View Switcher (Visible on < lg screens) */}
        <div class="lg:hidden flex mb-3 bg-base-100 p-1 rounded-xl border border-base-300 shadow-xs">
          <button
            type="button"
            class={`flex-1 btn btn-sm gap-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all ${
              mobileView === "form"
                ? "btn-primary shadow-xs"
                : "btn-ghost text-base-content/70 hover:bg-base-200"
            }`}
            onClick={() => setMobileView("form")}
          >
            <IconEdit size={14} />
            <span>Customize</span>
          </button>
          <button
            type="button"
            class={`flex-1 btn btn-sm gap-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all ${
              mobileView === "preview"
                ? "btn-primary shadow-xs"
                : "btn-ghost text-base-content/70 hover:bg-base-200"
            }`}
            onClick={() => setMobileView("preview")}
          >
            <IconEye size={14} />
            <span>Preview & Export</span>
          </button>
        </div>

        {/* Responsive Grid Layout */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div class={mobileView === "form" ? "block" : "hidden lg:block"}>
            <CardForm
              options={options}
              setOptions={setOptions}
              onReview={handleReview}
              onDownloadSVG={handleDownloadSVG}
              onOpenPNGModal={() => setIsPngModalOpen(true)}
            />
          </div>
          <div
            class={`${
              mobileView === "preview" ? "block" : "hidden lg:block"
            } lg:sticky lg:top-[68px]`}
          >
            <CardPreview
              svgElement={svgElement}
              options={options}
              onBackToEdit={() => setMobileView("form")}
              onDownloadSVG={handleDownloadSVG}
              onOpenPNGModal={() => setIsPngModalOpen(true)}
            />
          </div>
        </div>
      </main>

      <PngModal
        opened={isPngModalOpen}
        onClose={() => setIsPngModalOpen(false)}
        options={options}
      />
    </div>
  );
};

export default App;

