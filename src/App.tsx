import { FunctionalComponent } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
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
        class="flex-1 container mx-auto px-4 py-6 max-w-7xl"
        tabIndex={-1}
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <CardForm
            options={options}
            setOptions={setOptions}
            onReview={handleReview}
            onDownloadSVG={handleDownloadSVG}
            onOpenPNGModal={() => setIsPngModalOpen(true)}
          />
          <CardPreview svgElement={svgElement} options={options} />
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
