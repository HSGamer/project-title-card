import { FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import {
  IconAlertCircle,
  IconCheck,
  IconDeviceDesktop,
  IconTypography,
} from "@tabler/icons-preact";
import {
  CardOptions,
  DescriptionFontWeight,
  TitleFontWeight,
} from "../../types.ts";
import { FieldGuide } from "../FieldGuide.tsx";
import { SliderControl } from "../SliderControl.tsx";
import {
  DEFAULT_FONT_OPTIONS,
  FontOption,
  loadWebFont,
  POPULAR_GOOGLE_FONTS,
  querySystemFonts,
} from "../../utils/fonts.ts";

interface TypographyTabProps {
  options: CardOptions;
  setOptions: (fn: (prev: CardOptions) => CardOptions) => void;
}

export const TypographyTab: FunctionalComponent<TypographyTabProps> = (
  { options, setOptions },
) => {
  const [fontList, setFontList] = useState<FontOption[]>(DEFAULT_FONT_OPTIONS);
  const [isScanningFonts, setIsScanningFonts] = useState(false);
  const [scannedCount, setScannedCount] = useState<number | null>(null);
  const [scanMessage, setScanMessage] = useState<
    { text: string; type: "success" | "error" } | null
  >(null);
  const [customFontInput, setCustomFontInput] = useState("");

  // Preload popular fonts so option items render with their actual font styles
  useEffect(() => {
    for (const f of POPULAR_GOOGLE_FONTS) {
      loadWebFont(f.value);
    }
  }, []);

  // Scan installed system fonts via Local Font Access API
  const handleScanSystemFonts = async () => {
    try {
      setIsScanningFonts(true);
      setScanMessage(null);
      const localFonts = await querySystemFonts();
      if (localFonts.length > 0) {
        setFontList((prev) => {
          const existingLabels = new Set(
            prev.map((f) => f.label.toLowerCase()),
          );
          const newLocal = localFonts.filter((f) =>
            !existingLabels.has(f.label.toLowerCase())
          );
          return [...newLocal, ...prev];
        });
        setScannedCount(localFonts.length);
        setScanMessage({
          text: `Found and loaded ${localFonts.length} local system fonts!`,
          type: "success",
        });
      }
    } catch (err) {
      setScanMessage({
        text: err instanceof Error ? err.message : String(err),
        type: "error",
      });
    } finally {
      setIsScanningFonts(false);
    }
  };

  // Add custom font family name to list and apply
  const handleAddCustomFont = (target: "title" | "description") => {
    const trimmed = customFontInput.trim();
    if (!trimmed) return;

    const formattedValue = trimmed.includes(",")
      ? trimmed
      : `"${trimmed}", sans-serif`;
    const newFont: FontOption = {
      label: trimmed,
      value: formattedValue,
      category: "Display",
      isGoogleFont: true,
    };

    setFontList((prev) => [newFont, ...prev]);
    loadWebFont(trimmed);

    if (target === "title") {
      setOptions((prev) => ({
        ...prev,
        titleFont: { ...prev.titleFont, fontFamily: formattedValue },
      }));
    } else {
      setOptions((prev) => ({
        ...prev,
        ...("descriptionFont" in prev
          ? {
            descriptionFont: {
              ...prev.descriptionFont,
              fontFamily: formattedValue,
            },
          }
          : {}),
      }));
    }
    setCustomFontInput("");
  };

  const fontWeights: { label: string; value: TitleFontWeight }[] = [
    { label: "400 - Regular", value: "400" },
    { label: "500 - Medium", value: "500" },
    { label: "600 - SemiBold", value: "600" },
    { label: "700 - Bold", value: "700" },
    { label: "800 - ExtraBold", value: "800" },
    { label: "900 - Black", value: "900" },
  ];

  const descFontWeights: { label: string; value: DescriptionFontWeight }[] = [
    { label: "300 - Light", value: "300" },
    { label: "400 - Regular", value: "400" },
    { label: "500 - Medium", value: "500" },
    { label: "600 - SemiBold", value: "600" },
    { label: "700 - Bold", value: "700" },
  ];

  return (
    <div class="flex flex-col gap-4">
      {/* Font Catalog Toolbar */}
      <div class="bg-base-200 p-3 sm:p-4 rounded-xl border border-base-300 flex flex-col gap-2.5">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div class="flex items-center gap-1.5">
            <IconTypography size={16} class="text-primary flex-shrink-0" />
            <span class="text-xs font-bold">
              Font Catalog & System Fonts
            </span>
          </div>
          <button
            type="button"
            class={`btn btn-xs btn-outline gap-1 w-full sm:w-auto ${
              isScanningFonts ? "loading" : ""
            }`}
            onClick={handleScanSystemFonts}
            disabled={isScanningFonts}
          >
            <IconDeviceDesktop size={13} />
            {scannedCount ? `Re-Scan (${scannedCount})` : "Scan Local OS Fonts"}
          </button>
        </div>

        {scanMessage && (
          <div
            class={`alert alert-sm p-2 text-xs flex items-center gap-2 ${
              scanMessage.type === "success" ? "alert-success" : "alert-warning"
            }`}
          >
            {scanMessage.type === "success"
              ? <IconCheck size={14} class="flex-shrink-0" />
              : <IconAlertCircle size={14} class="flex-shrink-0" />}
            <span>{scanMessage.text}</span>
          </div>
        )}

        {/* Add custom font input */}
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            class="input input-bordered input-sm flex-1 min-w-0 text-xs w-full"
            placeholder="Type any Google Font name (e.g. Space Grotesk)..."
            value={customFontInput}
            onInput={(e) => setCustomFontInput(e.currentTarget.value)}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustomFont("title");
              }
            }}
          />
          <div class="flex gap-1.5 flex-shrink-0">
            <button
              type="button"
              class="btn btn-sm btn-outline text-xs flex-1 sm:flex-none"
              disabled={!customFontInput.trim()}
              onClick={() => handleAddCustomFont("title")}
            >
              Apply Title
            </button>
            {options.generateType !== "badge" && (
              <button
                type="button"
                class="btn btn-sm btn-ghost text-xs flex-1 sm:flex-none"
                disabled={!customFontInput.trim()}
                onClick={() => handleAddCustomFont("description")}
              >
                Apply Desc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. Title Typography */}
      <div class="flex flex-col gap-3">
        <div class="flex justify-between items-center min-h-[22px]">
          <label class="text-xs font-bold flex items-center gap-1 text-primary">
            <span>Title Typography</span>
            <FieldGuide fieldKey="titleTypography" />
          </label>
          <label class="cursor-pointer flex items-center gap-1.5 py-0">
            <span class="text-xs text-base-content/70">ALL CAPS</span>
            <input
              type="checkbox"
              class="toggle toggle-primary toggle-xs"
              checked={Boolean(options.titleFont?.uppercase)}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  titleFont: {
                    ...prev.titleFont,
                    uppercase: e.currentTarget.checked,
                  },
                }))}
            />
          </label>
        </div>

        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex justify-between items-center min-h-[22px]">
            <span class="text-xs font-semibold text-base-content">
              Font Family
            </span>
          </div>
          <select
            class="select select-bordered select-sm w-full font-medium text-xs"
            style={{ fontFamily: options.titleFont?.fontFamily || "inherit" }}
            value={options.titleFont?.fontFamily || fontList[0]?.value}
            onChange={(e) => {
              const val = e.currentTarget.value;
              if (!val) return;
              loadWebFont(val);
              setOptions((prev) => ({
                ...prev,
                titleFont: { ...prev.titleFont, fontFamily: val },
              }));
            }}
          >
            {fontList.map((f) => (
              <option
                key={f.value}
                value={f.value}
                style={{ fontFamily: f.value }}
              >
                {f.label} {f.category ? `(${f.category})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content">
                Font Weight
              </span>
            </div>
            <select
              class="select select-bordered select-sm w-full font-medium text-xs"
              value={options.titleFont?.fontWeight || "800"}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  titleFont: {
                    ...prev.titleFont,
                    fontWeight: (e.currentTarget.value as TitleFontWeight) ||
                      "800",
                  },
                }))}
            >
              {fontWeights.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content">
                Title Color
              </span>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="color"
                class="w-9 h-9 sm:w-8 sm:h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
                value={options.titleFont?.color || "#f8fafc"}
                onInput={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    titleFont: {
                      ...prev.titleFont,
                      color: e.currentTarget.value,
                    },
                  }))}
              />
              <input
                type="text"
                class="input input-bordered input-sm flex-1 min-w-0 font-mono text-xs"
                value={options.titleFont?.color || "#f8fafc"}
                onInput={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    titleFont: {
                      ...prev.titleFont,
                      color: e.currentTarget.value,
                    },
                  }))}
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
          <SliderControl
            label="Font Size"
            value={options.titleFont?.fontSize || 34}
            min={16}
            max={72}
            step={2}
            quickValues={[24, 34, 44, 52]}
            onChange={(val) =>
              setOptions((prev) => ({
                ...prev,
                titleFont: { ...prev.titleFont, fontSize: val },
              }))}
          />

          <SliderControl
            label="Letter Spacing"
            value={options.titleFont?.letterSpacing || 0}
            min={-2}
            max={10}
            step={1}
            quickValues={[0, 1, 2, 4]}
            onChange={(val) =>
              setOptions((prev) => ({
                ...prev,
                titleFont: { ...prev.titleFont, letterSpacing: val },
              }))}
          />
        </div>
      </div>

      <div class="divider my-0"></div>

      {/* 2. Description Typography (Disabled in Badge mode) */}
      {options.generateType !== "badge" && (
        <div class="flex flex-col gap-3">
          <div class="flex justify-between items-center min-h-[22px]">
            <label class="text-xs font-bold flex items-center gap-1 text-primary">
              <span>Description Typography</span>
              <FieldGuide fieldKey="descriptionTypography" />
            </label>
          </div>

          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content">
                Font Family
              </span>
            </div>
            <select
              class="select select-bordered select-sm w-full font-medium text-xs"
              style={{
                fontFamily: ("descriptionFont" in options
                  ? options.descriptionFont?.fontFamily
                  : undefined) || "inherit",
              }}
              value={"descriptionFont" in options
                ? options.descriptionFont?.fontFamily || fontList[0]?.value
                : fontList[0]?.value}
              onChange={(e) => {
                const val = e.currentTarget.value;
                if (!val) return;
                loadWebFont(val);
                setOptions((prev) => ({
                  ...prev,
                  ...("descriptionFont" in prev
                    ? {
                      descriptionFont: {
                        ...prev.descriptionFont,
                        fontFamily: val,
                      },
                    }
                    : {}),
                }));
              }}
            >
              {fontList.map((f) => (
                <option
                  key={f.value}
                  value={f.value}
                  style={{ fontFamily: f.value }}
                >
                  {f.label} {f.category ? `(${f.category})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
            <div class="flex flex-col gap-1.5 w-full">
              <div class="flex justify-between items-center min-h-[22px]">
                <span class="text-xs font-semibold text-base-content">
                  Font Weight
                </span>
              </div>
              <select
                class="select select-bordered select-sm w-full font-medium text-xs"
                value={"descriptionFont" in options
                  ? options.descriptionFont?.fontWeight || "500"
                  : "500"}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    ...("descriptionFont" in prev
                      ? {
                        descriptionFont: {
                          ...prev.descriptionFont,
                          fontWeight:
                            (e.currentTarget.value as DescriptionFontWeight) ||
                            "500",
                        },
                      }
                      : {}),
                  }))}
              >
                {descFontWeights.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            <div class="flex flex-col gap-1.5 w-full">
              <div class="flex justify-between items-center min-h-[22px]">
                <span class="text-xs font-semibold text-base-content">
                  Description Color
                </span>
              </div>
              <div class="flex items-center gap-2">
                <input
                  type="color"
                  class="w-9 h-9 sm:w-8 sm:h-8 rounded-lg p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
                  value={"descriptionFont" in options
                    ? options.descriptionFont?.color || "#94a3b8"
                    : "#94a3b8"}
                  onInput={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      ...("descriptionFont" in prev
                        ? {
                          descriptionFont: {
                            ...prev.descriptionFont,
                            color: e.currentTarget.value,
                          },
                        }
                        : {}),
                    }))}
                />
                <input
                  type="text"
                  class="input input-bordered input-sm flex-1 font-mono text-xs"
                  value={"descriptionFont" in options
                    ? options.descriptionFont?.color || "#94a3b8"
                    : "#94a3b8"}
                  onInput={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      ...("descriptionFont" in prev
                        ? {
                          descriptionFont: {
                            ...prev.descriptionFont,
                            color: e.currentTarget.value,
                          },
                        }
                        : {}),
                    }))}
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
            <SliderControl
              label="Font Size"
              value={"descriptionFont" in options
                ? options.descriptionFont?.fontSize || 22
                : 22}
              min={12}
              max={44}
              step={2}
              quickValues={[16, 20, 24, 28]}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  ...("descriptionFont" in prev
                    ? {
                      descriptionFont: {
                        ...prev.descriptionFont,
                        fontSize: val,
                      },
                    }
                    : {}),
                }))}
            />

            <SliderControl
              label="Line Spacing"
              value={Math.round(
                ("descriptionFont" in options
                  ? options.descriptionFont?.lineHeight || 1.3
                  : 1.3) * 10,
              )}
              min={10}
              max={20}
              step={1}
              unit="x"
              quickValues={[11, 13, 15, 18]}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  ...("descriptionFont" in prev
                    ? {
                      descriptionFont: {
                        ...prev.descriptionFont,
                        lineHeight: val / 10,
                      },
                    }
                    : {}),
                }))}
            />
          </div>
        </div>
      )}
    </div>
  );
};
