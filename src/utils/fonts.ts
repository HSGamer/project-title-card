// Dynamic Font Management System

export interface FontOption {
  label: string;
  value: string;
  category?:
    | "Sans-Serif"
    | "Serif"
    | "Monospace"
    | "Display"
    | "Handwriting"
    | "System"
    | "Local";
  isGoogleFont?: boolean;
}

// Rich dynamic catalog of popular web fonts
export const POPULAR_GOOGLE_FONTS: FontOption[] = [
  // Modern Sans-Serif
  {
    label: "Inter",
    value: "Inter, sans-serif",
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Roboto",
    value: "Roboto, sans-serif",
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Open Sans",
    value: '"Open Sans", sans-serif',
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Montserrat",
    value: "Montserrat, sans-serif",
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Poppins",
    value: "Poppins, sans-serif",
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Lato",
    value: "Lato, sans-serif",
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Plus Jakarta Sans",
    value: '"Plus Jakarta Sans", sans-serif',
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Space Grotesk",
    value: '"Space Grotesk", sans-serif',
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Outfit",
    value: "Outfit, sans-serif",
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "DM Sans",
    value: '"DM Sans", sans-serif',
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Raleway",
    value: "Raleway, sans-serif",
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Nunito",
    value: "Nunito, sans-serif",
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Work Sans",
    value: '"Work Sans", sans-serif',
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Rubik",
    value: "Rubik, sans-serif",
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Lexend",
    value: "Lexend, sans-serif",
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Ubuntu",
    value: "Ubuntu, sans-serif",
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Cabin",
    value: "Cabin, sans-serif",
    category: "Sans-Serif",
    isGoogleFont: true,
  },
  {
    label: "Oswald",
    value: "Oswald, sans-serif",
    category: "Sans-Serif",
    isGoogleFont: true,
  },

  // Elegant Serif
  {
    label: "Playfair Display",
    value: '"Playfair Display", serif',
    category: "Serif",
    isGoogleFont: true,
  },
  {
    label: "Merriweather",
    value: "Merriweather, serif",
    category: "Serif",
    isGoogleFont: true,
  },
  {
    label: "Lora",
    value: "Lora, serif",
    category: "Serif",
    isGoogleFont: true,
  },
  {
    label: "Cinzel",
    value: "Cinzel, serif",
    category: "Serif",
    isGoogleFont: true,
  },
  {
    label: "Bodoni Moda",
    value: '"Bodoni Moda", serif',
    category: "Serif",
    isGoogleFont: true,
  },
  {
    label: "Cormorant Garamond",
    value: '"Cormorant Garamond", serif',
    category: "Serif",
    isGoogleFont: true,
  },
  {
    label: "PT Serif",
    value: '"PT Serif", serif',
    category: "Serif",
    isGoogleFont: true,
  },
  {
    label: "Bitter",
    value: "Bitter, serif",
    category: "Serif",
    isGoogleFont: true,
  },
  {
    label: "Crimson Text",
    value: '"Crimson Text", serif',
    category: "Serif",
    isGoogleFont: true,
  },
  {
    label: "Prata",
    value: "Prata, serif",
    category: "Serif",
    isGoogleFont: true,
  },

  // Developer Monospace
  {
    label: "JetBrains Mono",
    value: '"JetBrains Mono", monospace',
    category: "Monospace",
    isGoogleFont: true,
  },
  {
    label: "Fira Code",
    value: '"Fira Code", monospace',
    category: "Monospace",
    isGoogleFont: true,
  },
  {
    label: "Source Code Pro",
    value: '"Source Code Pro", monospace',
    category: "Monospace",
    isGoogleFont: true,
  },
  {
    label: "Space Mono",
    value: '"Space Mono", monospace',
    category: "Monospace",
    isGoogleFont: true,
  },
  {
    label: "Roboto Mono",
    value: '"Roboto Mono", monospace',
    category: "Monospace",
    isGoogleFont: true,
  },
  {
    label: "IBM Plex Mono",
    value: '"IBM Plex Mono", monospace',
    category: "Monospace",
    isGoogleFont: true,
  },
  {
    label: "Inconsolata",
    value: "Inconsolata, monospace",
    category: "Monospace",
    isGoogleFont: true,
  },
  {
    label: "Courier Prime",
    value: '"Courier Prime", monospace',
    category: "Monospace",
    isGoogleFont: true,
  },

  // Bold & Display
  {
    label: "Bebas Neue",
    value: '"Bebas Neue", sans-serif',
    category: "Display",
    isGoogleFont: true,
  },
  {
    label: "Righteous",
    value: "Righteous, sans-serif",
    category: "Display",
    isGoogleFont: true,
  },
  {
    label: "Audiowide",
    value: "Audiowide, sans-serif",
    category: "Display",
    isGoogleFont: true,
  },
  {
    label: "Orbitron",
    value: "Orbitron, sans-serif",
    category: "Display",
    isGoogleFont: true,
  },
  {
    label: "Russo One",
    value: '"Russo One", sans-serif',
    category: "Display",
    isGoogleFont: true,
  },
  {
    label: "Permanent Marker",
    value: '"Permanent Marker", cursive',
    category: "Display",
    isGoogleFont: true,
  },
  {
    label: "Lobster",
    value: "Lobster, cursive",
    category: "Display",
    isGoogleFont: true,
  },
  {
    label: "Anton",
    value: "Anton, sans-serif",
    category: "Display",
    isGoogleFont: true,
  },
  {
    label: "Press Start 2P",
    value: '"Press Start 2P", monospace',
    category: "Display",
    isGoogleFont: true,
  },
  {
    label: "Abril Fatface",
    value: '"Abril Fatface", serif',
    category: "Display",
    isGoogleFont: true,
  },
];

export const SYSTEM_FONTS: FontOption[] = [
  {
    label: "System Sans-Serif (Native UI)",
    value:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    category: "System",
  },
  {
    label: "Clean Verdana / Tahoma",
    value: "Verdana, Geneva, Tahoma, sans-serif",
    category: "System",
  },
  {
    label: "Classic Georgia Serif",
    value: 'Georgia, "Times New Roman", Times, serif',
    category: "System",
  },
  {
    label: "Standard Monospace (Courier / Menlo)",
    value: 'Menlo, Monaco, Consolas, "Courier New", monospace',
    category: "System",
  },
  {
    label: "Impact Heavy Display",
    value: 'Impact, "Arial Black", sans-serif',
    category: "System",
  },
  {
    label: "Trebuchet MS",
    value: '"Trebuchet MS", "Lucida Sans", sans-serif',
    category: "System",
  },
];

export const DEFAULT_FONT_OPTIONS: FontOption[] = [
  ...SYSTEM_FONTS,
  ...POPULAR_GOOGLE_FONTS,
];

// In-memory registry of loaded web fonts to prevent duplicate link tags
const loadedFontsSet = new Set<string>();

/**
 * Extracts primary family name from a font family stack (e.g. '"Plus Jakarta Sans", sans-serif' -> 'Plus Jakarta Sans')
 */
export function extractPrimaryFontName(fontFamily: string): string {
  if (!fontFamily) return "";
  const firstPart = fontFamily.split(",")[0].trim();
  return firstPart.replace(/["']/g, "");
}

/**
 * Dynamically loads a Google Web Font into the browser document head
 */
export function loadWebFont(fontFamily: string): void {
  if (typeof document === "undefined") return;
  const primaryName = extractPrimaryFontName(fontFamily);
  if (!primaryName) return;

  // Check if standard system font
  const lower = primaryName.toLowerCase();
  if (
    lower === "system-ui" ||
    lower === "sans-serif" ||
    lower === "serif" ||
    lower === "monospace" ||
    lower === "verdana" ||
    lower === "georgia" ||
    lower === "arial" ||
    lower === "helvetica" ||
    lower === "times new roman" ||
    lower === "courier new" ||
    lower === "impact" ||
    lower === "trebuchet ms"
  ) {
    return;
  }

  if (loadedFontsSet.has(primaryName)) return;
  loadedFontsSet.add(primaryName);

  try {
    const formattedName = primaryName.replace(/\s+/g, "+");
    const linkId = `google-font-${
      primaryName.toLowerCase().replace(/[^a-z0-9]/g, "-")
    }`;

    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href =
        `https://fonts.googleapis.com/css2?family=${formattedName}:ital,wght@0,300..900;1,300..900&display=swap`;
      document.head.appendChild(link);
    }
  } catch (err) {
    console.warn("Failed to load dynamic web font:", primaryName, err);
  }
}

/**
 * Generates SVG @import CSS rules for embedding web fonts directly into SVG <defs><style>
 */
export function getSvgFontImports(
  ...fontFamilies: (string | undefined)[]
): string {
  const primaryNames = new Set<string>();
  for (const font of fontFamilies) {
    if (!font) continue;
    const primary = extractPrimaryFontName(font);
    const lower = primary.toLowerCase();
    if (
      primary &&
      lower !== "system-ui" &&
      lower !== "sans-serif" &&
      lower !== "serif" &&
      lower !== "monospace" &&
      lower !== "verdana" &&
      lower !== "georgia" &&
      lower !== "arial" &&
      lower !== "helvetica" &&
      lower !== "times new roman" &&
      lower !== "courier new" &&
      lower !== "impact" &&
      lower !== "trebuchet ms"
    ) {
      primaryNames.add(primary);
    }
  }

  if (primaryNames.size === 0) return "";

  const importUrls = Array.from(primaryNames).map((name) => {
    const formattedName = name.replace(/\s+/g, "+");
    return `@import url('https://fonts.googleapis.com/css2?family=${formattedName}:wght@300;400;500;600;700;800;900&display=swap');`;
  });

  return importUrls.join("\n");
}

/**
 * Queries local system fonts using the Local Font Access API if supported by the browser
 */
export async function querySystemFonts(): Promise<FontOption[]> {
  if (typeof window === "undefined") return [];

  // Check Local Font Access API support
  const nav = window as unknown as {
    queryLocalFonts?: () => Promise<
      Array<
        {
          family: string;
          fullName: string;
          postscriptName: string;
          style: string;
        }
      >
    >;
  };

  if (typeof nav.queryLocalFonts !== "function") {
    throw new Error(
      "Local Font Access API is not supported in this browser. You can still use all web fonts or type any font name.",
    );
  }

  try {
    const fonts = await nav.queryLocalFonts();
    const uniqueFamilies = new Map<string, FontOption>();

    for (const font of fonts) {
      if (font.family && !uniqueFamilies.has(font.family)) {
        uniqueFamilies.set(font.family, {
          label: font.family,
          value: `"${font.family}", sans-serif`,
          category: "Local",
        });
      }
    }

    return Array.from(uniqueFamilies.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  } catch (err) {
    if (err instanceof Error && err.name === "NotAllowedError") {
      throw new Error("Permission to access local system fonts was denied.");
    }
    throw err;
  }
}
