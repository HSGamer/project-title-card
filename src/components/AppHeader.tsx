import { FunctionalComponent } from "preact";
import { useEffect } from "preact/hooks";
import {
  IconBrandGithub,
  IconMoon,
  IconSparkles,
  IconSun,
  IconTemplate,
} from "@tabler/icons-preact";
import { CardOptions } from "../types.ts";
import {
  CARD_PRESETS,
  CardPreset,
  PRESET_THEMES,
  PresetTheme,
} from "../data/presets.ts";

interface AppHeaderProps {
  setOptions: (fn: (prev: CardOptions) => CardOptions) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const AppHeader: FunctionalComponent<AppHeaderProps> = ({
  setOptions,
  isDark,
  onToggleTheme,
}) => {
  // Global listener to close dropdowns when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("details.dropdown")) {
        document.querySelectorAll("details.dropdown[open]").forEach((el) => {
          el.removeAttribute("open");
        });
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const closeDropdown = (e: Event) => {
    const details = (e.currentTarget as HTMLElement).closest("details");
    if (details) {
      details.removeAttribute("open");
    }
  };

  const handleApplyTheme = (theme: PresetTheme, e: Event) => {
    closeDropdown(e);
    setOptions((prev) => {
      const updated = {
        ...prev,
        background: { ...prev.background, ...theme.background },
        border: { ...prev.border, ...theme.border },
        titleFont: { ...prev.titleFont, ...theme.titleFont },
        ...("descriptionFont" in prev
          ? {
            descriptionFont: {
              ...prev.descriptionFont,
              ...theme.descriptionFont,
            },
          }
          : {}),
      } as CardOptions;
      return updated;
    });
  };

  const handleApplyCardPreset = (preset: CardPreset, e: Event) => {
    closeDropdown(e);
    setOptions(() => ({
      ...preset.options,
      background: { ...preset.options.background },
      border: { ...preset.options.border },
      titleFont: { ...preset.options.titleFont },
      ...("descriptionFont" in preset.options
        ? { descriptionFont: { ...preset.options.descriptionFont } }
        : {}),
      image: { ...preset.options.image },
    } as CardOptions));
  };

  const getFormatBadge = (format: string) => {
    switch (format) {
      case "card":
        return <span class="badge badge-xs badge-neutral">Card</span>;
      case "widecard":
        return <span class="badge badge-xs badge-info">Wide</span>;
      case "widescreen":
        return <span class="badge badge-xs badge-secondary">16:9</span>;
      case "badge":
        return <span class="badge badge-xs badge-accent">Badge</span>;
      default:
        return <span class="badge badge-xs">{format}</span>;
    }
  };

  return (
    <header class="navbar bg-base-100 border-b border-base-300 sticky top-0 z-40 px-3 sm:px-4 lg:px-8 shadow-xs min-h-[52px] w-full max-w-full">
      <div class="flex-1 flex items-center gap-1.5 sm:gap-2 min-w-0 mr-2">
        <h1 class="text-sm sm:text-base md:text-lg font-bold tracking-tight truncate">
          Project Title Card
        </h1>
        <span class="badge badge-primary badge-xs sm:badge-sm font-semibold hidden sm:inline-flex">
          Visual Studio
        </span>
      </div>

      <div class="flex-none flex items-center gap-1.5 sm:gap-2">
        {/* Full Card Presets Dropdown */}
        <details class="dropdown dropdown-end">
          <summary
            class="btn btn-sm btn-ghost gap-1 sm:gap-1.5 border border-base-300 font-medium px-2 sm:px-3 text-xs list-none cursor-pointer"
            title="Card Presets"
            aria-label="Card Presets"
          >
            <IconTemplate size={15} class="text-primary flex-shrink-0" />
            <span class="hidden sm:inline">Presets</span>
          </summary>
          <ul class="dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-2xl w-64 sm:w-80 z-50 border border-base-300 max-h-[26rem] overflow-y-auto overflow-x-hidden mt-2">
            <li class="menu-title text-[11px] font-bold uppercase tracking-wider text-base-content/60 pb-1">
              Card Templates
            </li>
            {CARD_PRESETS.map((preset) => (
              <li key={preset.id} class="w-full">
                <button
                  type="button"
                  class="w-full flex items-center justify-between text-xs py-2 px-2.5 rounded-lg hover:bg-base-200"
                  onClick={(e) => handleApplyCardPreset(preset, e)}
                >
                  <div class="flex-1 min-w-0 flex flex-col items-start pr-2">
                    <span class="w-full font-bold text-xs truncate">
                      {preset.name}
                    </span>
                    <span class="w-full text-[11px] text-base-content/60 truncate mt-0.5">
                      {preset.description}
                    </span>
                  </div>
                  <div class="flex-shrink-0">
                    {getFormatBadge(preset.options.generateType)}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </details>

        {/* Style Themes Dropdown */}
        <details class="dropdown dropdown-end">
          <summary
            class="btn btn-sm btn-ghost gap-1 sm:gap-1.5 border border-base-300 font-medium px-2 sm:px-3 text-xs list-none cursor-pointer"
            title="Style Themes"
            aria-label="Style Themes"
          >
            <IconSparkles size={15} class="text-warning flex-shrink-0" />
            <span class="hidden sm:inline">Themes</span>
          </summary>
          <ul class="dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-2xl w-48 sm:w-56 z-50 border border-base-300 max-h-[22rem] overflow-y-auto overflow-x-hidden mt-2">
            <li class="menu-title text-[11px] font-bold uppercase tracking-wider text-base-content/60 pb-1">
              Style Themes
            </li>
            {PRESET_THEMES.map((theme) => (
              <li key={theme.id} class="w-full">
                <button
                  type="button"
                  class="w-full flex items-center justify-between text-xs font-medium py-2 px-2.5 rounded-lg hover:bg-base-200"
                  onClick={(e) => handleApplyTheme(theme, e)}
                >
                  <span class="truncate">{theme.name}</span>
                  <span class="text-[10px] opacity-60 capitalize flex-shrink-0">
                    {theme.category}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </details>

        {/* Dark / Light Toggle */}
        <div
          class="tooltip tooltip-bottom"
          data-tip={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <button
            type="button"
            class="btn btn-sm btn-circle btn-ghost"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark
              ? <IconSun size={17} class="text-warning" />
              : <IconMoon size={17} class="text-base-content/80" />}
          </button>
        </div>

        {/* GitHub Repository Link */}
        <div class="tooltip tooltip-bottom" data-tip="GitHub Repository">
          <a
            href="https://github.com/HSGamer/project-title-card"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-sm btn-circle btn-ghost"
            aria-label="GitHub Repository"
          >
            <IconBrandGithub size={18} class="text-base-content/80" />
          </a>
        </div>
      </div>
    </header>
  );
};
