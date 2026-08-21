import { FunctionalComponent } from "preact";
import { useEffect } from "preact/hooks";
import {
  IconBrandGithub,
  IconMoon,
  IconSparkles,
  IconSun,
} from "@tabler/icons-preact";
import { CardOptions } from "../types.ts";
import { THEMES, Theme } from "../data/themes.ts";

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

  const handleApplyTheme = (theme: Theme, e: Event) => {
    closeDropdown(e);
    setOptions((prev) => {
      const updated = {
        ...prev,
        background: { ...prev.background, ...theme.background },
        ...(theme.splitBackground
          ? { splitBackground: { ...theme.splitBackground } }
          : {}),
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
        ...(theme.image && prev.image
          ? { image: { ...prev.image, ...theme.image } }
          : {}),
      } as CardOptions;
      return updated;
    });
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
        {/* Style & Font Themes Dropdown */}
        <details class="dropdown dropdown-end">
          <summary
            class="btn btn-sm btn-ghost gap-1 sm:gap-1.5 border border-base-300 font-medium px-2 sm:px-3 text-xs list-none cursor-pointer"
            title="Themes (Style & Typography)"
            aria-label="Themes"
          >
            <IconSparkles size={15} class="text-warning flex-shrink-0" />
            <span class="hidden sm:inline">Themes</span>
          </summary>
          <ul class="dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-2xl w-52 sm:w-60 z-50 border border-base-300 max-h-[24rem] overflow-y-auto overflow-x-hidden mt-2">
            <li class="menu-title text-[11px] font-bold uppercase tracking-wider text-base-content/60 pb-1">
              Style & Typography Themes
            </li>
            {THEMES.map((theme) => (
              <li key={theme.id} class="w-full">
                <button
                  type="button"
                  class="w-full flex items-center justify-between text-xs font-medium py-2 px-2.5 rounded-lg hover:bg-base-200"
                  onClick={(e) => handleApplyTheme(theme, e)}
                >
                  <span class="truncate font-semibold">{theme.name}</span>
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
