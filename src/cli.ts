#!/usr/bin/env -S deno run --allow-read --allow-write --allow-net
import { CardOptions, CardOptionsSchema, LayoutFormatType } from "./types.ts";
import {
  defaultBadgeOptions,
  defaultOptions,
  defaultStandardOptions,
  defaultWideOptions,
  defaultWidescreenOptions,
} from "./generators/defaults.ts";
import { THEMES } from "./data/themes.ts";
import { normalizeCardOptions } from "./utils/normalizer.ts";
import {
  generatePNGBuffer,
  generateSVGString,
  writeCardToFile,
} from "./utils/headless-export.ts";
import { generateHelpMessage, parseCliArgs } from "./utils/cli-parser.ts";

function listThemes() {
  console.log("\nAvailable Themes (Style & Typography):\n");
  console.log(
    "ID".padEnd(22) +
      "Name".padEnd(26) +
      "Category".padEnd(14) +
      "Background".padEnd(16) +
      "Border",
  );
  console.log("-".repeat(88));
  for (const t of THEMES) {
    console.log(
      t.id.padEnd(22) +
        t.name.padEnd(26) +
        t.category.padEnd(14) +
        t.background.type.padEnd(16) +
        (t.border.shadow || "none"),
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

function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Record<string, any>,
): T {
  const result: any = { ...target };
  for (const key of Object.keys(source)) {
    const val = source[key];
    if (val !== undefined && val !== null) {
      if (
        typeof val === "object" &&
        !Array.isArray(val) &&
        typeof result[key] === "object" &&
        !Array.isArray(result[key]) &&
        result[key] !== null
      ) {
        result[key] = deepMerge(result[key], val);
      } else {
        result[key] = val;
      }
    }
  }
  return result;
}

export async function main(args: string[] = Deno.args): Promise<void> {
  const { controlFlags, cardOverrides } = parseCliArgs(args);

  if (controlFlags.help) {
    console.log(generateHelpMessage());
    return;
  }

  if (controlFlags.listThemes) {
    listThemes();
    return;
  }

  // 1. Initial base options
  let options: CardOptions = { ...defaultOptions };

  // Load from file or stdin if specified
  if (controlFlags.stdin) {
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
  } else if (controlFlags.input) {
    try {
      const content = await Deno.readTextFile(controlFlags.input);
      const parsed = JSON.parse(content);
      options = normalizeCardOptions(parsed);
    } catch (err) {
      console.error(
        `Error reading input JSON file "${controlFlags.input}":`,
        err instanceof Error ? err.message : String(err),
      );
      Deno.exit(1);
    }
  } else if (controlFlags.theme) {
    const themeId = controlFlags.theme;
    const theme = THEMES.find((t) => t.id === themeId);
    if (theme) {
      options = deepMerge(options, {
        background: theme.background,
        ...(theme.splitBackground ? { splitBackground: theme.splitBackground } : {}),
        border: theme.border,
        titleFont: theme.titleFont,
        ...("descriptionFont" in options
          ? { descriptionFont: theme.descriptionFont }
          : {}),
        ...(theme.image ? { image: theme.image } : {}),
      });
    } else {
      console.warn(
        `Warning: Theme "${themeId}" not found. Run --list-themes to view available options.`,
      );
    }
  } else if (cardOverrides.generateType) {
    const type = cardOverrides.generateType as LayoutFormatType;
    if (type === "widecard") options = { ...defaultWideOptions };
    else if (type === "widescreen") options = { ...defaultWidescreenOptions };
    else if (type === "badge") options = { ...defaultBadgeOptions };
    else options = { ...defaultStandardOptions };
  }

  // 3. Format override if base wasn't already initialized for it
  if (
    cardOverrides.generateType &&
    cardOverrides.generateType !== options.generateType
  ) {
    const type = cardOverrides.generateType as LayoutFormatType;
    let baseByType: CardOptions;
    if (type === "widecard") baseByType = defaultWideOptions;
    else if (type === "widescreen") baseByType = defaultWidescreenOptions;
    else if (type === "badge") baseByType = defaultBadgeOptions;
    else baseByType = defaultStandardOptions;

    options = deepMerge(baseByType, {
      title: options.title,
      background: options.background,
      border: options.border,
      titleFont: options.titleFont,
      image: options.image,
    });
  }

  // 4. Deep merge all schema-mapped CLI flags
  const merged = deepMerge(options, cardOverrides);
  options = normalizeCardOptions(merged);

  // Validate normalized output against CardOptionsSchema
  const validation = CardOptionsSchema.safeParse(options);
  if (!validation.success) {
    console.warn(
      "Warning: Card options validation issues:",
      validation.error.format(),
    );
  }

  // 5. Output handling
  if (controlFlags.stdout) {
    const svg = generateSVGString(options);
    console.log(svg);
    return;
  }

  const isPng = Boolean(
    controlFlags.png || controlFlags.output?.toLowerCase().endsWith(".png"),
  );
  const defaultOutput = isPng ? "title-card.png" : "title-card.svg";
  const outputPath = controlFlags.output || defaultOutput;
  const scale = controlFlags.scale || 1;

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
