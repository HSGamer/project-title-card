import { parseArgs } from "@std/cli/parse-args";
import {
  BackgroundConfigSchema,
  BorderConfigSchema,
  DescriptionFontConfigSchema,
  ImageConfigSchema,
  TitleFontConfigSchema,
  CardVariantSchema,
  WideVariantSchema,
  BadgeVariantSchema,
  BadgeStatusStyleSchema,
  BackgroundTypeSchema,
  BorderStyleSchema,
  ShadowEffectSchema,
  ImageShapeSchema,
  GradientDirectionSchema,
  TextAlignSchema,
  WidescreenLayoutSchema,
} from "../types.ts";

/**
 * Converts kebab-case or snake_case string to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/[-_]([a-z0-9])/g, (_, g) => g.toUpperCase());
}

/**
 * Helper to safely set nested object properties
 */
function setDeep(obj: Record<string, any>, path: string[], value: any) {
  let curr = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!curr[key] || typeof curr[key] !== "object") {
      curr[key] = {};
    }
    curr = curr[key];
  }
  curr[path[path.length - 1]] = value;
}

/**
 * Introspected key sets from Zod schemas
 */
const bgKeys = new Set(Object.keys(BackgroundConfigSchema.shape));
const borderKeys = new Set(Object.keys(BorderConfigSchema.shape));
const titleFontKeys = new Set(Object.keys(TitleFontConfigSchema.shape));
const descFontKeys = new Set(Object.keys(DescriptionFontConfigSchema.shape));
const imageKeys = new Set(Object.keys(ImageConfigSchema.shape));

/**
 * Known flag aliases and shortcuts
 */
const FLAG_ALIASES: Record<string, string[]> = {
  // Direct top level
  "title": ["title"],
  "desc": ["description"],
  "description": ["description"],
  "format": ["generateType"],
  "f": ["generateType"],
  "align": ["textAlign"],
  "vertical-align": ["verticalAlign"],
  "valign": ["verticalAlign"],
  "v-align": ["verticalAlign"],
  "uppercase": ["titleFont", "uppercase"],

  // Background
  "bg-type": ["background", "type"],
  "bg-color": ["background", "color"],
  "gradient-start": ["background", "gradientStart"],
  "gradient-middle": ["background", "gradientMiddle"],
  "gradient-end": ["background", "gradientEnd"],
  "gradient-dir": ["background", "gradientDirection"],
  "gradient-direction": ["background", "gradientDirection"],
  "bg-opacity": ["background", "opacity"],
  "bg-image": ["background", "imageUrl"],
  "bg-image-opacity": ["background", "imageOpacity"],
  "overlay-color": ["background", "overlayColor"],
  "overlay-opacity": ["background", "overlayOpacity"],

  // Border
  "border-color": ["border", "color"],
  "border-width": ["border", "width"],
  "border-style": ["border", "style"],
  "border-radius": ["border", "radius"],
  "border-margin": ["border", "margin"],
  "border-shadow": ["border", "shadow"],
  "glow-color": ["border", "glowColor"],

  // Title Font
  "font-title": ["titleFont", "fontFamily"],
  "font-title-size": ["titleFont", "fontSize"],
  "title-font": ["titleFont", "fontFamily"],
  "title-font-size": ["titleFont", "fontSize"],
  "title-color": ["titleFont", "color"],
  "title-weight": ["titleFont", "fontWeight"],
  "title-letter-spacing": ["titleFont", "letterSpacing"],

  // Description Font
  "font-desc": ["descriptionFont", "fontFamily"],
  "font-desc-size": ["descriptionFont", "fontSize"],
  "desc-font": ["descriptionFont", "fontFamily"],
  "desc-font-size": ["descriptionFont", "fontSize"],
  "desc-color": ["descriptionFont", "color"],
  "desc-weight": ["descriptionFont", "fontWeight"],
  "desc-line-height": ["descriptionFont", "lineHeight"],
  "desc-opacity": ["descriptionFont", "opacity"],

  // Logo / Image
  "logo": ["image", "url"],
  "image": ["image", "url"],
  "logo-size": ["image", "size"],
  "image-size": ["image", "size"],
  "logo-shape": ["image", "shape"],
  "image-shape": ["image", "shape"],
  "logo-pos": ["imagePosition"],
  "logo-valign": ["image", "verticalAlign"],
  "logo-vertical-align": ["image", "verticalAlign"],
  "image-valign": ["image", "verticalAlign"],
  "image-vertical-align": ["image", "verticalAlign"],
  "logo-offset-y": ["image", "verticalOffset"],
  "logo-vertical-offset": ["image", "verticalOffset"],
  "image-offset-y": ["image", "verticalOffset"],
  "logo-offset-x": ["image", "horizontalOffset"],
  "logo-horizontal-offset": ["image", "horizontalOffset"],
  "image-offset-x": ["image", "horizontalOffset"],

  // Text & Alignment Offsets
  "vertical-offset": ["verticalOffset"],
  "text-offset-y": ["verticalOffset"],
  "offset-y": ["verticalOffset"],
  "horizontal-offset": ["horizontalOffset"],
  "text-offset-x": ["horizontalOffset"],
  "offset-x": ["horizontalOffset"],

  // Variants & Specific layout flags
  "card-variant": ["cardVariant"],
  "variant": ["cardVariant"],
  "wide-variant": ["wideVariant"],
  "banner-variant": ["bannerVariant"],
  "widescreen-layout": ["layoutStyle"],
  "layout-style": ["layoutStyle"],
  "badge-width": ["badgeWidth"],
  "badge-height": ["badgeHeight"],
  "auto-size": ["badgeAutoSize"],
  "badge-auto-size": ["badgeAutoSize"],
  "badge-variant": ["badgeVariant"],
  "badge-label": ["badgeLabel"],
  "label-bg": ["labelBackground"],
  "label-color": ["labelColor"],
  "split-pos": ["splitPosition"],
  "split-position": ["splitPosition"],
  "status-text": ["statusText"],
  "status-color": ["statusColor"],
  "status-style": ["statusStyle"],
  "status-pos": ["statusPosition"],
  "status-position": ["statusPosition"],
  "icon-pos": ["iconPosition"],
  "icon-position": ["iconPosition"],
};

/**
 * Automatically maps any arbitrary CLI flag into nested option paths.
 */
export function mapFlagToPath(rawKey: string): string[] {
  const normalizedKey = rawKey.toLowerCase();

  // 1. Check direct aliases
  if (FLAG_ALIASES[normalizedKey]) {
    return FLAG_ALIASES[normalizedKey];
  }

  // 2. Handle dot-notation: e.g. "background.color" -> ["background", "color"]
  if (rawKey.includes(".")) {
    return rawKey.split(".").map(kebabToCamel);
  }

  const camel = kebabToCamel(rawKey);

  // 3. Handle prefix based mappings
  if (rawKey.startsWith("background-") || rawKey.startsWith("bg-")) {
    const subKey = kebabToCamel(rawKey.replace(/^(background|bg)-/, ""));
    return ["background", subKey];
  }
  if (rawKey.startsWith("border-")) {
    const subKey = kebabToCamel(rawKey.replace(/^border-/, ""));
    return ["border", subKey];
  }
  if (rawKey.startsWith("title-font-") || rawKey.startsWith("font-title-")) {
    const subKey = kebabToCamel(rawKey.replace(/^(title-font|font-title)-/, ""));
    return ["titleFont", subKey];
  }
  if (rawKey.startsWith("desc-font-") || rawKey.startsWith("font-desc-") || rawKey.startsWith("description-font-")) {
    const subKey = kebabToCamel(rawKey.replace(/^(desc-font|font-desc|description-font)-/, ""));
    return ["descriptionFont", subKey];
  }
  if (rawKey.startsWith("image-") || rawKey.startsWith("logo-")) {
    const subKey = kebabToCamel(rawKey.replace(/^(image|logo)-/, ""));
    return ["image", subKey];
  }

  // 4. Match against known shape keys
  if (bgKeys.has(camel)) return ["background", camel];
  if (borderKeys.has(camel)) return ["border", camel];
  if (titleFontKeys.has(camel)) return ["titleFont", camel];
  if (descFontKeys.has(camel)) return ["descriptionFont", camel];
  if (imageKeys.has(camel)) return ["image", camel];

  // 5. Default to top-level camelCase
  return [camel];
}

/**
 * Coerce string values to appropriate primitives (numbers, booleans)
 */
function coerceValue(val: unknown): unknown {
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed === "true") return true;
    if (trimmed === "false") return false;
    if (!isNaN(Number(trimmed)) && trimmed !== "" && !trimmed.startsWith("#") && !trimmed.startsWith("0x")) {
      return Number(trimmed);
    }
  }
  return val;
}

/**
 * Parsed CLI result containing runner control flags and normalized card option overrides
 */
export interface ParsedCliResult {
  controlFlags: {
    help?: boolean;
    listPresets?: boolean;
    preset?: string;
    input?: string;
    stdin?: boolean;
    output?: string;
    png?: boolean;
    scale?: number;
    stdout?: boolean;
  };
  cardOverrides: Record<string, any>;
  rawFlags: Record<string, any>;
}

/**
 * Parse command-line arguments into control flags and deeply nested card options
 */
export function parseCliArgs(args: string[] = Deno.args): ParsedCliResult {
  const rawFlags = parseArgs(args, {
    alias: {
      f: "format",
      p: "preset",
      o: "output",
      out: "output",
      i: "input",
      h: "help",
      desc: "description",
    },
    boolean: [
      "help",
      "h",
      "list-presets",
      "stdin",
      "png",
      "stdout",
      "uppercase",
      "auto-size",
      "badge-auto-size",
    ],
  });

  const controlFlags: ParsedCliResult["controlFlags"] = {
    help: Boolean(rawFlags.help || rawFlags.h),
    listPresets: Boolean(rawFlags["list-presets"]),
    preset: rawFlags.preset as string | undefined,
    input: (rawFlags.input || rawFlags.i) as string | undefined,
    stdin: Boolean(rawFlags.stdin),
    output: (rawFlags.output || rawFlags.out || rawFlags.o) as string | undefined,
    png: Boolean(rawFlags.png),
    scale: rawFlags.scale ? Number(rawFlags.scale) : undefined,
    stdout: Boolean(rawFlags.stdout),
  };

  const cardOverrides: Record<string, any> = {};

  const controlKeys = new Set([
    "_",
    "help",
    "h",
    "list-presets",
    "preset",
    "p",
    "input",
    "i",
    "stdin",
    "output",
    "out",
    "o",
    "png",
    "scale",
    "stdout",
  ]);

  for (const [key, rawValue] of Object.entries(rawFlags)) {
    if (controlKeys.has(key)) continue;
    if (rawValue === undefined || rawValue === null) continue;

    const coerced = coerceValue(rawValue);
    const path = mapFlagToPath(key);

    // Format aliases
    if (path.length === 1 && path[0] === "generateType") {
      const formatVal = String(coerced).toLowerCase();
      if (formatVal === "wide") setDeep(cardOverrides, ["generateType"], "widecard");
      else if (formatVal === "banner") setDeep(cardOverrides, ["generateType"], "widescreen");
      else setDeep(cardOverrides, ["generateType"], formatVal);
      continue;
    }

    // Logo image shorthand: if logo is specified, auto-enable image.show = true
    if (path.length === 2 && path[0] === "image" && path[1] === "url") {
      setDeep(cardOverrides, ["image", "show"], true);
    }

    setDeep(cardOverrides, path, coerced);
  }

  return { controlFlags, cardOverrides, rawFlags };
}

/**
 * Generate comprehensive, automated CLI help text derived from Zod schemas
 */
export function generateHelpMessage(): string {
  const bgTypes = BackgroundTypeSchema.options.join(" | ");
  const gradDirs = GradientDirectionSchema.options.join(" | ");
  const borderStyles = BorderStyleSchema.options.join(" | ");
  const shadowEffects = ShadowEffectSchema.options.join(" | ");
  const imageShapes = ImageShapeSchema.options.join(" | ");
  const cardVariants = CardVariantSchema.options.join(" | ");
  const wideVariants = WideVariantSchema.options.join(" | ");
  const wsLayouts = WidescreenLayoutSchema.options.join(" | ");
  const badgeVariants = BadgeVariantSchema.options.join(" | ");
  const badgeStatuses = BadgeStatusStyleSchema.options.join(" | ");
  const textAligns = TextAlignSchema.options.join(" | ");

  return `
project-title-card CLI - Generate SVG & PNG title cards from the terminal

USAGE:
  deno task cli [OPTIONS]
  deno run -A src/cli.ts [OPTIONS]

BASIC OPTIONS:
  --title <text>              Card title (e.g. "My Project")
  --desc, --description <t>   Card description lines
  --format, -f <type>         Format: card | widecard | widescreen | badge (default: card)
  --preset, -p <id>           Apply preset theme (e.g. "neon-cyber", "sunset-glow")
  --output, -o <path>         Output file path (default: title-card.svg or title-card.png)
  --png                       Output as PNG image instead of SVG
  --scale <number>            PNG resolution scale multiplier (default: 1)
  --stdout                    Print raw SVG string to stdout instead of writing file

INPUT CONFIGURATION:
  --input, -i <file.json>     Load full options from a JSON file
  --stdin                     Read full JSON options from standard input

STYLE CUSTOMIZATION:
  --bg-type <type>            ${bgTypes}
  --bg-color <hex>            Background solid color (e.g. "#0f172a")
  --gradient-start <hex>      Gradient start color (e.g. "#ea580c")
  --gradient-middle <hex>     Gradient middle color (optional)
  --gradient-end <hex>        Gradient end color (e.g. "#7c3aed")
  --gradient-dir <dir>        ${gradDirs}
  --bg-opacity <number>       Background opacity (0 - 1)
  --border-color <hex>        Border stroke color
  --border-style <style>      ${borderStyles}
  --border-shadow <shadow>    ${shadowEffects}
  --glow-color <hex>          Neon glow tint color (when --border-shadow is glow)
  --border-width <number>     Border thickness (px)
  --border-radius <number>    Border corner radius (px)
  --border-margin <number>    Border margin (px)

TYPOGRAPHY & LOGO:
  --font-title <name>         Title font family (e.g. "Space Grotesk")
  --font-desc <name>          Description font family (e.g. "Inter")
  --font-title-size <num>     Title font size in px
  --font-desc-size <num>      Description font size in px
  --title-color <hex>         Title text color
  --desc-color <hex>          Description text color
  --uppercase                 Force title uppercase (flag)
  --align <align>             ${textAligns}
  --valign <align>            Vertical alignment: top, middle, bottom
  --logo, --image <url>       Logo image URL, local path, or base64 data URI
  --logo-size <number>        Logo size in px
  --logo-shape <shape>        ${imageShapes}
  --logo-valign <align>       Logo vertical alignment: top, middle, bottom

LAYOUT & VARIANT OPTIONS:
  --card-variant <variant>    Standard card: ${cardVariants}
  --wide-variant <variant>    Wide card: ${wideVariants}
  --logo-pos <left|right>     Wide card logo position
  --banner-variant <variant>  Widescreen: ${wsLayouts}
  --badge-variant <variant>   Badge: ${badgeVariants}
  --badge-width <number>      Badge width in px
  --badge-height <number>     Badge height in px
  --auto-size                 Badge auto calculate width (flag)
  --badge-label <text>        Split badge label text
  --label-bg <hex>            Split badge label background color
  --label-color <hex>         Split badge label text color
  --split-pos <number>        Split badge divider position in px
  --status-text <text>        Status badge indicator text
  --status-color <hex>        Status badge indicator color
  --status-style <style>      ${badgeStatuses}
  --status-pos <left|right>   Status indicator position

INFORMATIONAL:
  --list-presets              List all available preset themes
  --help, -h                  Show this help message

EXAMPLES:
  # 1. Quick banner generation with preset
  deno task cli --title "Deno Guard" --desc "Security First" --format widecard --preset neon-cyber --out banner.svg

  # 2. Export high-res PNG
  deno task cli --title "My API" --preset sunset-glow --png --scale 2 --out api-card.png

  # 3. Dynamic nested flag overrides
  deno task cli --title "Custom Card" --border.radius 24 --titleFont.fontSize 40 --out custom.svg

  # 4. Pipe JSON directly into CLI
  cat config.json | deno task cli --stdin --out card.svg
`;
}
