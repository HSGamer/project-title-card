import { parseArgs } from "@std/cli/parse-args";
import { z } from "zod";
import {
  BackgroundConfigSchema,
  BorderConfigSchema,
  DescriptionFontConfigSchema,
  ImageConfigSchema,
  TextAlignSchema,
  TitleFontConfigSchema,
  VerticalAlignSchema,
} from "../types.ts";
import { getAllLayouts } from "../layouts/registry.ts";

/**
 * Converts kebab-case or snake_case string to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/[-_]([a-z0-9])/g, (_, g) => g.toUpperCase());
}

/**
 * Converts camelCase to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
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

// Sub-schemas for field introspection
const subSchemas: Record<string, Set<string>> = {
  background: new Set(Object.keys(BackgroundConfigSchema.shape)),
  border: new Set(Object.keys(BorderConfigSchema.shape)),
  titleFont: new Set(Object.keys(TitleFontConfigSchema.shape)),
  descriptionFont: new Set(Object.keys(DescriptionFontConfigSchema.shape)),
  image: new Set(Object.keys(ImageConfigSchema.shape)),
};

// Prefix routes to match and map dynamically
const PREFIX_ROUTES: [RegExp, string][] = [
  [/^split[-_](?:bg|background)[-_]?/, "splitBackground"],
  [/^(?:bg|background)[-_]/, "background"],
  [/^border[-_]/, "border"],
  [/^(?:title[-_]font|title)[-_]/, "titleFont"],
  [
    /^(?:description[-_]font|desc[-_]font|description|desc)[-_]/,
    "descriptionFont",
  ],
  [/^(?:image|logo)[-_]/, "image"],
];

/**
 * Dynamically routes any CLI flag into nested option paths without hardcoded tables.
 */
export function mapFlagToPath(rawKey: string): string[] {
  if (rawKey.includes(".")) {
    return rawKey.split(".").map(kebabToCamel);
  }

  const normalized = rawKey.toLowerCase();
  const camel = kebabToCamel(rawKey);

  // Common root shortcuts
  if (normalized === "format" || normalized === "f") return ["generateType"];
  if (normalized === "desc") return ["description"];
  if (normalized === "logo" || normalized === "image") return ["image", "url"];
  if (normalized === "align") return ["textAlign"];
  if (normalized === "valign" || normalized === "vertical-align") {
    return ["verticalAlign"];
  }

  // 1. Prefix-based routing (e.g. --bg-color, --split-bg-color, --border-width, --title-font-size)
  for (const [pattern, section] of PREFIX_ROUTES) {
    if (pattern.test(rawKey)) {
      const rest = kebabToCamel(rawKey.replace(pattern, ""));
      return [section, rest || "color"];
    }
  }

  // 2. Schema field introspection fallback (e.g. --gradient-start -> background.gradientStart)
  for (const [section, keys] of Object.entries(subSchemas)) {
    if (keys.has(camel)) {
      return [section, camel];
    }
  }

  // 3. Default to top-level property
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
    if (
      !isNaN(Number(trimmed)) &&
      trimmed !== "" &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("0x")
    ) {
      return Number(trimmed);
    }
  }
  return val;
}

export interface ParsedCliResult {
  controlFlags: {
    help?: boolean;
    listThemes?: boolean;
    listFormats?: boolean;
    theme?: string;
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

export function parseCliArgs(args: string[] = Deno.args): ParsedCliResult {
  const rawFlags = parseArgs(args, {
    alias: {
      f: "format",
      t: "theme",
      theme: "theme",
      o: "output",
      out: "output",
      i: "input",
      h: "help",
      desc: "description",
    },
    boolean: [
      "help",
      "h",
      "list-themes",
      "list-formats",
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
    listThemes: Boolean(rawFlags["list-themes"]),
    listFormats: Boolean(rawFlags["list-formats"]),
    theme: (rawFlags.theme || rawFlags.t) as string | undefined,
    input: (rawFlags.input || rawFlags.i) as string | undefined,
    stdin: Boolean(rawFlags.stdin),
    output: (rawFlags.output || rawFlags.out || rawFlags.o) as
      | string
      | undefined,
    png: Boolean(rawFlags.png),
    scale: rawFlags.scale ? Number(rawFlags.scale) : undefined,
    stdout: Boolean(rawFlags.stdout),
  };

  const controlKeys = new Set([
    "_",
    "help",
    "h",
    "list-themes",
    "list-formats",
    "theme",
    "t",
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

  const cardOverrides: Record<string, any> = {};

  for (const [key, rawValue] of Object.entries(rawFlags)) {
    if (controlKeys.has(key)) continue;
    if (rawValue === undefined || rawValue === null) continue;

    const coerced = coerceValue(rawValue);
    const path = mapFlagToPath(key);

    // Auto-enable image if image url is provided
    if (path.length === 2 && path[0] === "image" && path[1] === "url") {
      setDeep(cardOverrides, ["image", "show"], true);
    }

    setDeep(cardOverrides, path, coerced);
  }

  return { controlFlags, cardOverrides, rawFlags };
}

/**
 * Extracts type hints and descriptions from Zod schemas dynamically.
 */
function getSchemaTypeInfo(schema: z.ZodTypeAny): {
  typeHint: string;
  description: string;
} {
  let curr: any = schema;
  let description = schema.description || "";

  while (curr._def?.innerType || curr._def?.schema) {
    if (!description && curr.description) description = curr.description;
    curr = curr._def.innerType || curr._def.schema;
  }
  if (!description && curr.description) description = curr.description;

  const typeName = curr._def?.typeName;

  if (typeName === "ZodEnum") {
    const options = (curr.options as string[]).join("|");
    return {
      typeHint: `<${options}>`,
      description,
    };
  }

  if (typeName === "ZodBoolean") {
    return {
      typeHint: "(flag)",
      description,
    };
  }

  if (typeName === "ZodNumber") {
    return {
      typeHint: "<number>",
      description,
    };
  }

  if (typeName === "ZodString") {
    return {
      typeHint: "<string>",
      description,
    };
  }

  return {
    typeHint: "<value>",
    description,
  };
}

function formatOptionLine(
  flag: string,
  typeHint: string,
  description: string,
): string {
  const left = `  ${flag} ${typeHint}`.padEnd(38);
  return `${left} ${description}`;
}

function formatSchemaFields(
  schema: z.ZodObject<any>,
  prefix = "",
  aliasMap: Record<string, string> = {},
): string[] {
  const lines: string[] = [];
  for (const [key, fieldSchema] of Object.entries(schema.shape)) {
    const { typeHint, description } = getSchemaTypeInfo(
      fieldSchema as z.ZodTypeAny,
    );
    const flagName = aliasMap[key] || `--${prefix}${camelToKebab(key)}`;
    lines.push(formatOptionLine(flagName, typeHint, description));
  }
  return lines;
}

const COMMON_FIELD_KEYS = new Set([
  "generateType",
  "title",
  "background",
  "splitBackground",
  "border",
  "titleFont",
  "descriptionFont",
  "image",
  "textAlign",
  "verticalAlign",
  "verticalOffset",
  "horizontalOffset",
]);

/**
 * Dynamically generates CLI help message by introspecting Zod schemas and all registered layouts.
 */
export function generateHelpMessage(): string {
  const layouts = getAllLayouts();
  const formats = layouts.map((l) => l.id).join("|");

  const basicOptions = [
    formatOptionLine("--title", "<string>", "Card main title text"),
    formatOptionLine(
      "--desc, --description",
      "<string>",
      "Card description lines",
    ),
    formatOptionLine(
      "--format, -f",
      `<${formats}>`,
      "Card layout format (default: card)",
    ),
    formatOptionLine(
      "--theme, -t",
      "<id>",
      "Apply style & typography theme (run --list-themes to view)",
    ),
    formatOptionLine(
      "--output, -o",
      "<path>",
      "Output file path (default: title-card.svg or title-card.png)",
    ),
    formatOptionLine("--png", "(flag)", "Render as PNG image instead of SVG"),
    formatOptionLine(
      "--scale",
      "<number>",
      "PNG resolution scale multiplier (default: 1)",
    ),
    formatOptionLine("--stdout", "(flag)", "Print SVG string to stdout"),
    formatOptionLine(
      "--input, -i",
      "<file.json>",
      "Load options from JSON file",
    ),
    formatOptionLine("--stdin", "(flag)", "Read JSON options from stdin"),
    formatOptionLine(
      "--list-formats",
      "(flag)",
      "List all available card layout formats",
    ),
    formatOptionLine(
      "--list-themes",
      "(flag)",
      "List all available style & typography themes",
    ),
    formatOptionLine("--help, -h", "(flag)", "Show this help message"),
  ];

  const bgOptions = formatSchemaFields(BackgroundConfigSchema, "bg-");
  const splitBgOptions = formatSchemaFields(
    BackgroundConfigSchema,
    "split-bg-",
  );
  const borderOptions = formatSchemaFields(BorderConfigSchema, "border-");
  const titleOptions = formatSchemaFields(TitleFontConfigSchema, "title-");
  const descOptions = formatSchemaFields(DescriptionFontConfigSchema, "desc-");
  const imageOptions = formatSchemaFields(ImageConfigSchema, "logo-", {
    url: "--logo, --image",
  });

  const layoutOptions = [
    formatOptionLine(
      "--align",
      `<${TextAlignSchema.options.join("|")}>`,
      "Text horizontal alignment",
    ),
    formatOptionLine(
      "--valign",
      `<${VerticalAlignSchema.options.join("|")}>`,
      "Content vertical alignment",
    ),
    formatOptionLine(
      "--vertical-offset",
      "<number>",
      "Content/text vertical offset in px",
    ),
    formatOptionLine(
      "--horizontal-offset",
      "<number>",
      "Content/text horizontal offset in px",
    ),
  ];

  // Dynamically inspect each layout for specific options
  const layoutSections: string[] = [];
  for (const layout of layouts) {
    if ("shape" in layout.schema) {
      const shape = (layout.schema as z.ZodObject<any>).shape;
      const specificShape: Record<string, z.ZodTypeAny> = {};
      for (const [k, v] of Object.entries(shape)) {
        if (!COMMON_FIELD_KEYS.has(k)) {
          specificShape[k] = v as z.ZodTypeAny;
        }
      }

      if (Object.keys(specificShape).length > 0) {
        const lines = formatSchemaFields(z.object(specificShape), "");
        layoutSections.push(`  ${layout.name} (--format ${layout.id}):`);
        layoutSections.push(...lines.map((l) => `  ${l}`));
      }
    }
  }

  return [
    "project-title-card CLI - Generate SVG & PNG title cards from the terminal\n",
    "USAGE:",
    "  deno task cli [OPTIONS]\n",
    "AVAILABLE LAYOUT FORMATS:",
    ...layouts.map((l) =>
      `  ${l.id.padEnd(16)} ${l.name.padEnd(20)} ${l.description}`
    ),
    "\nBASIC OPTIONS:",
    ...basicOptions,
    "\nBACKGROUND OPTIONS:",
    ...bgOptions,
    "\nSPLIT BACKGROUND OPTIONS (for split variants):",
    ...splitBgOptions,
    "\nBORDER OPTIONS:",
    ...borderOptions,
    "\nTITLE TYPOGRAPHY OPTIONS:",
    ...titleOptions,
    "\nDESCRIPTION TYPOGRAPHY OPTIONS:",
    ...descOptions,
    "\nLOGO / IMAGE OPTIONS:",
    ...imageOptions,
    "\nLAYOUT & ALIGNMENT OPTIONS:",
    ...layoutOptions,
    "\nFORMAT-SPECIFIC OPTIONS (Extensible):",
    ...layoutSections,
    "\nNOTE: All options also support dot-notation (e.g. --background.color #fff, --border.radius 20).",
  ].join("\n");
}
