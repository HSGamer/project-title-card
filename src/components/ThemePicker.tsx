import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import { IconCheck } from "@tabler/icons-preact";
import { CardOptions } from "../types.ts";
import { THEMES, Theme } from "../data/themes.ts";

interface ThemePickerProps {
  options: CardOptions;
  setOptions: (fn: (prev: CardOptions) => CardOptions) => void;
}

export const ThemePicker: FunctionalComponent<ThemePickerProps> = ({
  options,
  setOptions,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lastAppliedThemeId, setLastAppliedThemeId] = useState<string | null>(
    null,
  );

  const categories = ["All", ...Array.from(new Set(THEMES.map((t) => t.category)))];

  const filteredThemes = selectedCategory === "All"
    ? THEMES
    : THEMES.filter((t) => t.category === selectedCategory);

  const handleApplyTheme = (theme: Theme) => {
    setLastAppliedThemeId(theme.id);
    setOptions((prev) => {
      return {
        ...prev,
        background: { ...theme.background },
        ...(theme.splitBackground
          ? { splitBackground: { ...theme.splitBackground } }
          : {}),
        border: { ...theme.border },
        titleFont: {
          ...prev.titleFont,
          ...theme.titleFont,
          fontSize: prev.titleFont.fontSize,
        },
        ...(prev.descriptionFont
          ? {
            descriptionFont: {
              ...prev.descriptionFont,
              ...theme.descriptionFont,
              fontSize: prev.descriptionFont.fontSize,
            },
          }
          : {}),
        ...(theme.image && prev.image
          ? {
            image: {
              ...prev.image,
              ...theme.image,
              size: prev.image.size,
            },
          }
          : {}),
      } as CardOptions;
    });
  };

  const getBackgroundPreviewStyle = (theme: Theme) => {
    const bg = theme.background;
    if (bg.type === "gradient") {
      const dirMap: Record<string, string> = {
        "to-r": "to right",
        "to-br": "to bottom right",
        "to-b": "to bottom",
        "to-bl": "to bottom left",
        "radial": "circle at center",
      };
      const dir = dirMap[bg.gradientDirection] || "to bottom right";
      const stops = [
        bg.gradientStart,
        bg.gradientMiddle,
        bg.gradientEnd,
      ].filter(Boolean).join(", ");
      return {
        background: bg.gradientDirection === "radial"
          ? `radial-gradient(${dir}, ${stops})`
          : `linear-gradient(${dir}, ${stops})`,
      };
    }
    return { backgroundColor: bg.color };
  };

  return (
    <div class="flex flex-col gap-3.5 w-full">
      {/* Category Filter Pills */}
      <div class="flex flex-wrap items-center gap-1.5 pb-1 border-b border-base-300">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            class={`btn btn-xs rounded-lg text-[11px] font-medium transition-all ${
              selectedCategory === cat
                ? "btn-primary shadow-xs"
                : "btn-ghost bg-base-200/80 hover:bg-base-300 text-base-content/70"
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Theme Cards Grid */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
        {filteredThemes.map((theme) => {
          const isApplied = lastAppliedThemeId === theme.id ||
            (options.background.color === theme.background.color &&
              options.border.color === theme.border.color);

          return (
            <button
              type="button"
              key={theme.id}
              onClick={() => handleApplyTheme(theme)}
              class={`group relative flex flex-col p-3 rounded-xl border text-left transition-all duration-200 hover:shadow-md ${
                isApplied
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                  : "border-base-300 bg-base-100 hover:border-base-content/30 hover:bg-base-200/40"
              }`}
            >
              {/* Header: Title & Category */}
              <div class="flex items-center justify-between gap-1 mb-2 w-full">
                <span class="text-xs font-bold text-base-content truncate group-hover:text-primary transition-colors">
                  {theme.name}
                </span>
                <span class="badge badge-ghost badge-xs text-[10px] uppercase font-semibold flex-shrink-0 opacity-70">
                  {theme.category}
                </span>
              </div>

              {/* Color Swatch / Visual Preview Strip */}
              <div
                class="w-full h-10 rounded-lg border border-white/10 flex items-center justify-between px-3 shadow-inner relative overflow-hidden mb-2"
                style={getBackgroundPreviewStyle(theme)}
              >
                {/* Simulated Title text */}
                <span
                  class="text-xs font-bold tracking-tight z-10 drop-shadow-sm truncate"
                  style={{
                    color: theme.titleFont.color || "#ffffff",
                    fontFamily: theme.titleFont.fontFamily,
                  }}
                >
                  Aa Title
                </span>

                {/* Simulated Description / Subtext */}
                <span
                  class="text-[10px] font-medium z-10 opacity-80 drop-shadow-sm truncate"
                  style={{
                    color: theme.descriptionFont.color || "#cbd5e1",
                    fontFamily: theme.descriptionFont.fontFamily,
                  }}
                >
                  Subtitle
                </span>

                {/* Subtle border accent */}
                <div
                  class="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    border: `1.5px solid ${theme.border.color || "rgba(255,255,255,0.2)"}`,
                  }}
                />
              </div>

              {/* Footer: Style details & Applied badge */}
              <div class="flex items-center justify-between text-[11px] text-base-content/60 w-full pt-1">
                <span class="capitalize text-[10px]">
                  {theme.background.type} • {theme.border.shadow || "none"}
                </span>

                {isApplied && (
                  <span class="flex items-center gap-1 text-[11px] font-bold text-primary">
                    <IconCheck size={13} />
                    <span>Active</span>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
