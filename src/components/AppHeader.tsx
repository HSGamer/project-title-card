import { FunctionalComponent } from "preact";
import {
  IconBrandGithub,
  IconMoon,
  IconSun,
} from "@tabler/icons-preact";

interface AppHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const AppHeader: FunctionalComponent<AppHeaderProps> = ({
  isDark,
  onToggleTheme,
}) => {
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
