import { FunctionalComponent } from "preact";
import { IconMoon, IconSparkles, IconSun } from "@tabler/icons-preact";
import { CardOptions } from "../types.ts";
import { PRESET_THEMES, PresetTheme } from "../data/presets.ts";

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
  const handleApplyPreset = (preset: PresetTheme) => {
    setOptions((prev) => {
      const updated = {
        ...prev,
        background: { ...prev.background, ...preset.background },
        border: { ...prev.border, ...preset.border },
        titleFont: { ...prev.titleFont, ...preset.titleFont },
        ...("descriptionFont" in prev
          ? {
            descriptionFont: {
              ...prev.descriptionFont,
              ...preset.descriptionFont,
            },
          }
          : {}),
      } as CardOptions;
      return updated;
    });
  };

  return (
    <header class="navbar bg-base-100 border-b border-base-300 sticky top-0 z-40 px-3 sm:px-4 lg:px-8 shadow-xs min-h-[52px]">
      <div class="flex-1 flex items-center gap-1.5 sm:gap-2 min-w-0 mr-2">
        <h1 class="text-sm sm:text-base md:text-lg font-bold tracking-tight truncate">
          Project Title Card
        </h1>
        <span class="badge badge-primary badge-xs sm:badge-sm font-semibold hidden sm:inline-flex">
          Visual Studio
        </span>
      </div>

      <div class="flex-none flex items-center gap-1.5 sm:gap-2">
        {/* Style Themes Dropdown */}
        <div class="dropdown dropdown-end">
          <div
            tabindex={0}
            role="button"
            class="btn btn-sm btn-ghost gap-1 sm:gap-1.5 border border-base-300 font-medium px-2 sm:px-3 text-xs"
            title="Style Themes"
            aria-label="Style Themes"
          >
            <IconSparkles size={15} class="text-warning flex-shrink-0" />
            <span class="hidden sm:inline">Themes</span>
          </div>
          <ul
            tabindex={0}
            class="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box w-52 sm:w-56 z-50 border border-base-300 max-h-80 overflow-y-auto"
          >
            <li class="menu-title text-xs uppercase tracking-wider">
              Theme Presets
            </li>
            {PRESET_THEMES.map((preset) => (
              <li key={preset.id}>
                <button
                  type="button"
                  class="text-xs font-medium py-2"
                  onClick={() => {
                    handleApplyPreset(preset);
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}
                >
                  {preset.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

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
      </div>
    </header>
  );
};
