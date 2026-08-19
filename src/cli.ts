#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net
import { parseArgs } from "@std/cli/parse-args";
import {
  BadgeCardOptions,
  BorderStyle,
  CardOptions,
  GenerateType,
  GradientDirection,
  ShadowEffect,
  StandardCardOptions,
  WideCardOptions,
  WidescreenCardOptions,
} from "./types.ts";
import { defaultOptions } from "./generators/defaults.ts";
import { PRESET_THEMES } from "./data/presets.ts";
import { normalizeCardOptions } from "./utils/normalizer.ts";
import {
  generatePNGBuffer,
  generateSVGString,
  writeCardToFile,
} from "./utils/headless-export.ts";

function showHelp() {
  console.log(`
project-title-card CLI - Generate SVG & PNG title cards from the terminal

USAGE:
  deno task cli [OPTIONS]
  deno run -A src/cli.ts [OPTIONS]

BASIC OPTIONS:
  --title <text>            Card title (e.g. "My Project")
  --desc, --description <t> Card description lines
  --format, -f <type>       Format: card (default) | widecard | widescreen | badge
  --preset, -p <id>         Apply preset theme (e.g. "neon-cyber", "sunset-glow")
  --output, -o <path>       Output file path (default: title-card.svg or title-card.png)
  --png                     Output as PNG image instead of SVG
  --scale <number>          PNG resolution scale multiplier (default: 1)
  --stdout                  Print raw SVG string to stdout instead of writing file

INPUT CONFIGURATION:
  --input, -i <file.json>   Load full options from a JSON file
  --stdin                   Read full JSON options from standard input

STYLE CUSTOMIZATION:
  --bg-type <type>          solid | gradient | glass | image
  --bg-color <hex>          Background solid color (e.g. "#0f172a")
  --gradient-start <hex>    Gradient start color (e.g. "#ea580c")
  --gradient-middle <hex>   Gradient middle color (optional)
  --gradient-end <hex>      Gradient end color (e.g. "#7c3aed")
  --gradient-dir <dir>      to-r | to-br | to-b | to-bl | radial
  --border-color <hex>      Border stroke color
  --border-style <style>    solid | dashed | dotted | none
  --border-shadow <shadow>  none | subtle | soft | strong | glow
  --glow-color <hex>        Neon glow tint color (when --border-shadow is glow)
  --border-width <number>   Border thickness (px)
  --border-radius <number>  Border corner radius (px)

TYPOGRAPHY & LOGO:
  --font-title <name>       Title font family (e.g. "Space Grotesk")
  --font-desc <name>        Description font family (e.g. "Inter")
  --font-title-size <num>   Title font size in px
  --font-desc-size <num>    Description font size in px
  --title-color <hex>       Title text color
  --desc-color <hex>        Description text color
  --uppercase               Force title uppercase
  --logo, --image <url>     Logo image URL, local path, or base64 data URI
  --logo-size <number>      Logo size in px
  --logo-shape <shape>      original | rounded | circle

INFORMATIONAL:
  --list-presets            List all available preset themes
  --help, -h                Show this help message

EXAMPLES:
  # 1. Quick banner generation with preset
  deno task cli --title "Deno Guard" --desc "Security First" --format widecard --preset neon-cyber --out banner.svg

  # 2. Export high-res PNG
  deno task cli --title "My API" --preset sunset-glow --png --scale 2 --out api-card.png

  # 3. Pipe JSON directly into CLI
  cat config.json | deno task cli --stdin --out card.svg

  # 4. Stream SVG directly to stdout
  deno task cli --title "Streamed" --stdout > card.svg
`);
}

function listPresets() {
  console.log("\nAvailable Preset Themes:\n");
  console.log(
    "ID".padEnd(20) + "Name".padEnd(24) + "Background".padEnd(16) + "Border",
  );
  console.log("-".repeat(75));
  for (const p of PRESET_THEMES) {
    console.log(
      p.id.padEnd(20) +
        p.name.padEnd(24) +
        p.background.type.padEnd(16) +
        (p.border.shadow || "none"),
    );
  }
  console.log("");
}

async function readStdin(): Promise<string> {
  const decoder = new TextDecoder();
  let result = "";
  const buf = new Uint8Array(1024);
  while (true) {
    const n = await Deno.stdin.read(buf);
    if (n === null || n === 0) break;
    result += decoder.decode(buf.subarray(0, n));
  }
  return result;
}

export async function main(args: string[] = Deno.args): Promise<void> {
  const flags = parseArgs(args, {
    string: [
      "title",
      "desc",
      "description",
      "format",
      "f",
      "preset",
      "p",
      "output",
      "o",
      "input",
      "i",
      "bg-type",
      "bg-color",
      "gradient-start",
      "gradient-middle",
      "gradient-end",
      "gradient-dir",
      "border-color",
      "border-style",
      "border-shadow",
      "glow-color",
      "border-width",
      "border-radius",
      "font-title",
      "font-desc",
      "font-title-size",
      "font-desc-size",
      "title-color",
      "desc-color",
      "logo",
      "image",
      "logo-size",
      "logo-shape",
      "align",
      "logo-pos",
      "widescreen-layout",
      "badge-width",
      "badge-height",
      "scale",
    ],
    boolean: [
      "png",
      "stdout",
      "list-presets",
      "help",
      "h",
      "uppercase",
      "stdin",
    ],
    alias: {
      f: "format",
      p: "preset",
      o: "output",
      out: "output",
      i: "input",
      h: "help",
      desc: "description",
    },
  });

  if (flags.help || flags.h) {
    showHelp();
    return;
  }

  if (flags["list-presets"]) {
    listPresets();
    return;
  }

  let options: CardOptions = { ...defaultOptions };

  // 1. Load from file or stdin if specified
  if (flags.stdin) {
    const stdinContent = await readStdin();
    if (stdinContent.trim()) {
      try {
        const parsed = JSON.parse(stdinContent);
        options = normalizeCardOptions(parsed);
      } catch (err) {
        console.error(
          "Error parsing JSON from stdin:",
          err instanceof Error ? err.message : String(err),
        );
        Deno.exit(1);
      }
    }
  } else if (flags.input) {
    try {
      const content = await Deno.readTextFile(flags.input);
      const parsed = JSON.parse(content);
      options = normalizeCardOptions(parsed);
    } catch (err) {
      console.error(
        `Error reading input JSON file "${flags.input}":`,
        err instanceof Error ? err.message : String(err),
      );
      Deno.exit(1);
    }
  }

  // 2. Apply Preset if specified
  const presetId = flags.preset;
  if (presetId) {
    const preset = PRESET_THEMES.find((p) => p.id === presetId);
    if (!preset) {
      console.warn(
        `Warning: Preset "${presetId}" not found. Run --list-presets to view available options.`,
      );
    } else {
      options = {
        ...options,
        background: { ...options.background, ...preset.background },
        border: { ...options.border, ...preset.border },
        titleFont: { ...options.titleFont, ...preset.titleFont },
        ...("descriptionFont" in options
          ? {
            descriptionFont: {
              ...options.descriptionFont,
              ...preset.descriptionFont,
            },
          }
          : {}),
      };
    }
  }

  // 3. Format override
  const format = (flags.format as GenerateType) || options.generateType;
  if (format && format !== options.generateType) {
    const desc = "description" in options
      ? options.description
      : "Fast • Lightweight • Type-Safe";
    if (format === "widecard") {
      options = {
        ...options,
        generateType: "widecard",
        imagePosition: "left",
        description: desc,
        descriptionFont: {
          color: "#94a3b8",
          fontFamily: "Inter, sans-serif",
          fontWeight: "500",
          fontSize: 24,
          lineHeight: 1.3,
          opacity: 1,
        },
        titleFont: { ...options.titleFont, fontSize: 44 },
      } as WideCardOptions;
    } else if (format === "widescreen") {
      options = {
        ...options,
        generateType: "widescreen",
        layoutStyle: "split",
        description: desc,
        descriptionFont: {
          color: "#94a3b8",
          fontFamily: "Inter, sans-serif",
          fontWeight: "500",
          fontSize: 24,
          lineHeight: 1.3,
          opacity: 1,
        },
        titleFont: { ...options.titleFont, fontSize: 42 },
      } as WidescreenCardOptions;
    } else if (format === "badge") {
      options = {
        ...options,
        generateType: "badge",
        badgeWidth: 400,
        badgeHeight: 120,
        iconPosition: "left",
        titleFont: { ...options.titleFont, fontSize: 32 },
        image: { ...options.image, size: 70 },
      } as BadgeCardOptions;
    } else {
      options = {
        ...options,
        generateType: "card",
        textAlign: "center",
        description: desc,
        descriptionFont: {
          color: "#94a3b8",
          fontFamily: "Inter, sans-serif",
          fontWeight: "500",
          fontSize: 22,
          lineHeight: 1.3,
          opacity: 1,
        },
        titleFont: { ...options.titleFont, fontSize: 34 },
      } as StandardCardOptions;
    }
  }

  // 4. Overwrite specific field CLI flags
  if (flags.title) options.title = flags.title;
  const descArg = flags.desc || flags.description;
  if (descArg && "description" in options) options.description = descArg;

  // Background flags
  if (flags["bg-type"]) {
    options.background.type =
      flags["bg-type"] as CardOptions["background"]["type"];
  }
  if (flags["bg-color"]) options.background.color = flags["bg-color"];
  if (flags["gradient-start"]) {
    options.background.gradientStart = flags["gradient-start"];
  }
  if (flags["gradient-middle"]) {
    options.background.gradientMiddle = flags["gradient-middle"];
  }
  if (flags["gradient-end"]) {
    options.background.gradientEnd = flags["gradient-end"];
  }
  if (flags["gradient-dir"]) {
    options.background.gradientDirection =
      flags["gradient-dir"] as GradientDirection;
  }

  // Border flags
  if (flags["border-color"]) options.border.color = flags["border-color"];
  if (flags["border-style"]) {
    options.border.style = flags["border-style"] as BorderStyle;
  }
  if (flags["border-shadow"]) {
    options.border.shadow = flags["border-shadow"] as ShadowEffect;
  }
  if (flags["border-width"] !== undefined) {
    options.border.width = Number(flags["border-width"]);
  }
  if (flags["border-radius"] !== undefined) {
    options.border.radius = Number(flags["border-radius"]);
  }
  if (flags["glow-color"]) options.border.glowColor = flags["glow-color"];

  // Typography flags
  if (flags["font-title"]) options.titleFont.fontFamily = flags["font-title"];
  if (flags["font-title-size"] !== undefined) {
    options.titleFont.fontSize = Number(flags["font-title-size"]);
  }
  if (flags["title-color"]) options.titleFont.color = flags["title-color"];
  if (flags.uppercase) options.titleFont.uppercase = true;

  if ("descriptionFont" in options) {
    if (flags["font-desc"]) {
      options.descriptionFont.fontFamily = flags["font-desc"];
    }
    if (flags["font-desc-size"] !== undefined) {
      options.descriptionFont.fontSize = Number(flags["font-desc-size"]);
    }
    if (flags["desc-color"]) {
      options.descriptionFont.color = flags["desc-color"];
    }
  }

  // Logo / Image flags
  const logoArg = flags.logo || flags.image;
  if (logoArg) {
    options.image.url = logoArg;
    options.image.show = true;
  }
  if (flags["logo-size"] !== undefined) {
    options.image.size = Number(flags["logo-size"]);
  }
  if (flags["logo-shape"]) {
    options.image.shape = flags["logo-shape"] as CardOptions["image"]["shape"];
  }

  // Format-specific flags
  if (flags.align && "textAlign" in options) {
    options.textAlign = flags.align as StandardCardOptions["textAlign"];
  }
  if (flags["logo-pos"] && "imagePosition" in options) {
    options.imagePosition =
      flags["logo-pos"] as WideCardOptions["imagePosition"];
  }
  if (flags["widescreen-layout"] && "layoutStyle" in options) {
    options.layoutStyle =
      flags["widescreen-layout"] as WidescreenCardOptions["layoutStyle"];
  }
  if (flags["badge-width"] && "badgeWidth" in options) {
    options.badgeWidth = Number(flags["badge-width"]);
  }
  if (flags["badge-height"] && "badgeHeight" in options) {
    options.badgeHeight = Number(flags["badge-height"]);
  }

  // Output handling
  if (flags.stdout) {
    const svg = generateSVGString(options);
    console.log(svg);
    return;
  }

  const isPng = Boolean(
    flags.png || flags.output?.toLowerCase().endsWith(".png"),
  );
  const defaultOutput = isPng ? "title-card.png" : "title-card.svg";
  const outputPath = flags.output || defaultOutput;
  const scale = flags.scale ? Number(flags.scale) : 1;

  try {
    if (isPng) {
      const pngBuffer = generatePNGBuffer(options, scale);
      await Deno.writeFile(outputPath, pngBuffer);
      console.log(
        `Successfully generated PNG title card -> ${outputPath} (scale: ${scale}x)`,
      );
    } else {
      await writeCardToFile(options, outputPath, scale);
      console.log(`Successfully generated SVG title card -> ${outputPath}`);
    }
  } catch (err) {
    console.error(
      "Failed to generate title card:",
      err instanceof Error ? err.message : String(err),
    );
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
