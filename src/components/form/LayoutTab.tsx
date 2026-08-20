import { FunctionalComponent } from "preact";
import {
  BadgeCardOptions,
  BadgeVariant,
  BannerVariant,
  CardOptions,
  CardVariant,
  GenerateType,
  StandardCardOptions,
  TextAlign,
  VerticalAlign,
  WideCardOptions,
  WideVariant,
  WidescreenCardOptions,
  WidescreenLayout,
} from "../../types.ts";
import { FieldGuide } from "../FieldGuide.tsx";
import { SliderControl } from "../SliderControl.tsx";
import { ImageControls } from "./ImageControls.tsx";
import { getCardDimensionsLabel } from "../../utils/dimensions.ts";
import {
  DESCRIPTION_SUGGESTIONS,
  TITLE_SUGGESTIONS,
} from "../../data/suggestions.ts";

interface LayoutTabProps {
  options: CardOptions;
  setOptions: (fn: (prev: CardOptions) => CardOptions) => void;
  onFormatChange: (format: GenerateType) => void;
}

export const LayoutTab: FunctionalComponent<LayoutTabProps> = ({
  options,
  setOptions,
  onFormatChange,
}) => {
  const formats: { label: string; value: GenerateType }[] = [
    { label: "Card (Portrait)", value: "card" },
    { label: "Wide (Banner)", value: "widecard" },
    { label: "Widescreen", value: "widescreen" },
    { label: "Badge", value: "badge" },
  ];

  const verticalAlignOptions: { label: string; value: VerticalAlign }[] = [
    { label: "Top", value: "top" },
    { label: "Middle", value: "middle" },
    { label: "Bottom", value: "bottom" },
  ];

  return (
    <div class="flex flex-col gap-4">
      {/* 1. Layout Format */}
      <div class="flex flex-col gap-1.5 w-full">
        <div class="flex justify-between items-center min-h-[22px]">
          <label class="text-xs font-semibold text-base-content flex items-center gap-1">
            <span>Layout Format</span>
            <FieldGuide fieldKey="generateType" />
          </label>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full">
          {formats.map((fmt) => (
            <button
              type="button"
              key={fmt.value}
              class={`btn btn-sm text-[11px] sm:text-xs px-1.5 py-1 h-auto min-h-[32px] sm:min-h-[36px] text-center leading-tight flex items-center justify-center ${
                options.generateType === fmt.value
                  ? "btn-active btn-primary shadow-xs font-semibold"
                  : "btn-ghost bg-base-200 hover:bg-base-300"
              }`}
              onClick={() => onFormatChange(fmt.value)}
            >
              <span>{fmt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Format-Specific Layout Controls: Standard Card */}
      {options.generateType === "card" && (
        <div class="flex flex-col gap-3.5 w-full">
          {/* Card Variant Selector */}
          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content">
                Card Variant
              </span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full">
              {[
                { label: "Standard", value: "standard" },
                { label: "Hero Glass", value: "hero" },
                { label: "Split Seam", value: "split" },
                { label: "Minimalist", value: "minimal" },
                { label: "Centered", value: "centered" },
              ].map((v) => (
                <button
                  type="button"
                  key={v.value}
                  class={`btn btn-sm text-[11px] sm:text-xs px-1.5 py-1 h-auto min-h-[32px] sm:min-h-[36px] text-center leading-tight flex items-center justify-center ${
                    ((options as StandardCardOptions).cardVariant || "standard") === v.value
                      ? "btn-active btn-primary shadow-xs font-semibold"
                      : "btn-ghost bg-base-200 hover:bg-base-300"
                  }`}
                  onClick={() =>
                    setOptions((prev) => ({
                      ...(prev as StandardCardOptions),
                      cardVariant: v.value as CardVariant,
                    }))}
                >
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal Text Alignment */}
          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content">
                Horizontal Text Alignment
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2 w-full">
              <button
                type="button"
                class={`btn btn-sm text-xs px-2 py-1.5 h-auto min-h-[36px] text-center leading-tight flex items-center justify-center ${
                  (options as StandardCardOptions).textAlign !== "left"
                    ? "btn-active btn-primary shadow-xs font-semibold"
                    : "btn-ghost bg-base-200 hover:bg-base-300"
                }`}
                onClick={() =>
                  setOptions((prev) => ({
                    ...(prev as StandardCardOptions),
                    textAlign: "center" as TextAlign,
                  }))}
              >
                <span>Centered</span>
              </button>
              <button
                type="button"
                class={`btn btn-sm text-xs px-2 py-1.5 h-auto min-h-[36px] text-center leading-tight flex items-center justify-center ${
                  (options as StandardCardOptions).textAlign === "left"
                    ? "btn-active btn-primary shadow-xs font-semibold"
                    : "btn-ghost bg-base-200 hover:bg-base-300"
                }`}
                onClick={() =>
                  setOptions((prev) => ({
                    ...(prev as StandardCardOptions),
                    textAlign: "left" as TextAlign,
                  }))}
              >
                <span>Left Aligned</span>
              </button>
            </div>
          </div>

          {/* Text Vertical Alignment */}
          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content">
                Text Vertical Alignment
              </span>
            </div>
            <div class="grid grid-cols-3 gap-2 w-full">
              {verticalAlignOptions.map((va) => (
                <button
                  type="button"
                  key={va.value}
                  class={`btn btn-sm text-xs px-2 py-1.5 h-auto min-h-[36px] text-center leading-tight flex items-center justify-center ${
                    ((options as StandardCardOptions).verticalAlign || "middle") === va.value
                      ? "btn-active btn-primary shadow-xs font-semibold"
                      : "btn-ghost bg-base-200 hover:bg-base-300"
                  }`}
                  onClick={() =>
                    setOptions((prev) => ({
                      ...(prev as StandardCardOptions),
                      verticalAlign: va.value,
                    }))}
                >
                  <span>{va.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Alignment Offsets */}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <SliderControl
              label="Text Vertical Offset"
              value={options.verticalOffset || 0}
              min={-150}
              max={150}
              step={1}
              unit="px"
              presets={[-30, -10, 0, 10, 30]}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  verticalOffset: val,
                }))}
            />
            <SliderControl
              label="Text Horizontal Offset"
              value={options.horizontalOffset || 0}
              min={-150}
              max={150}
              step={1}
              unit="px"
              presets={[-30, -10, 0, 10, 30]}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  horizontalOffset: val,
                }))}
            />
          </div>
        </div>
      )}

      {/* Format-Specific Layout Controls: Wide Card */}
      {options.generateType === "widecard" && (
        <div class="flex flex-col gap-3.5 w-full">
          {/* Wide Variant Selector */}
          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content">
                Wide Card Variant
              </span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full">
              {[
                { label: "Standard", value: "standard" },
                { label: "Split Panel", value: "split" },
                { label: "Centered", value: "centered" },
                { label: "Minimal", value: "minimal" },
                { label: "Badge Pill", value: "badge" },
              ].map((v) => (
                <button
                  type="button"
                  key={v.value}
                  class={`btn btn-sm text-[11px] sm:text-xs px-1.5 py-1 h-auto min-h-[32px] sm:min-h-[36px] text-center leading-tight flex items-center justify-center ${
                    ((options as WideCardOptions).wideVariant || "standard") === v.value
                      ? "btn-active btn-primary shadow-xs font-semibold"
                      : "btn-ghost bg-base-200 hover:bg-base-300"
                  }`}
                  onClick={() =>
                    setOptions((prev) => ({
                      ...(prev as WideCardOptions),
                      wideVariant: v.value as WideVariant,
                    }))}
                >
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Logo Placement */}
          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content">
                Logo Placement
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2 w-full">
              <button
                type="button"
                class={`btn btn-sm text-xs px-2 py-1.5 h-auto min-h-[36px] text-center leading-tight flex items-center justify-center ${
                  (options as WideCardOptions).imagePosition !== "right"
                    ? "btn-active btn-primary shadow-xs font-semibold"
                    : "btn-ghost bg-base-200 hover:bg-base-300"
                }`}
                onClick={() =>
                  setOptions((prev) => ({
                    ...(prev as WideCardOptions),
                    imagePosition: "left",
                  }))}
              >
                <span>Logo on Left</span>
              </button>
              <button
                type="button"
                class={`btn btn-sm text-xs px-2 py-1.5 h-auto min-h-[36px] text-center leading-tight flex items-center justify-center ${
                  (options as WideCardOptions).imagePosition === "right"
                    ? "btn-active btn-primary shadow-xs font-semibold"
                    : "btn-ghost bg-base-200 hover:bg-base-300"
                }`}
                onClick={() =>
                  setOptions((prev) => ({
                    ...(prev as WideCardOptions),
                    imagePosition: "right",
                  }))}
              >
                <span>Logo on Right</span>
              </button>
            </div>
          </div>

          {/* Text Vertical Alignment */}
          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content">
                Text Vertical Alignment
              </span>
            </div>
            <div class="grid grid-cols-3 gap-2 w-full">
              {verticalAlignOptions.map((va) => (
                <button
                  type="button"
                  key={va.value}
                  class={`btn btn-sm text-xs px-2 py-1.5 h-auto min-h-[36px] text-center leading-tight flex items-center justify-center ${
                    ((options as WideCardOptions).verticalAlign || "middle") === va.value
                      ? "btn-active btn-primary shadow-xs font-semibold"
                      : "btn-ghost bg-base-200 hover:bg-base-300"
                  }`}
                  onClick={() =>
                    setOptions((prev) => ({
                      ...(prev as WideCardOptions),
                      verticalAlign: va.value,
                    }))}
                >
                  <span>{va.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Alignment Offsets */}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <SliderControl
              label="Text Vertical Offset"
              value={options.verticalOffset || 0}
              min={-150}
              max={150}
              step={1}
              unit="px"
              presets={[-30, -10, 0, 10, 30]}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  verticalOffset: val,
                }))}
            />
            <SliderControl
              label="Text Horizontal Offset"
              value={options.horizontalOffset || 0}
              min={-150}
              max={150}
              step={1}
              unit="px"
              presets={[-30, -10, 0, 10, 30]}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  horizontalOffset: val,
                }))}
            />
          </div>
        </div>
      )}

      {/* Format-Specific Layout Controls: Widescreen Banner */}
      {options.generateType === "widescreen" && (
        <div class="flex flex-col gap-3.5 w-full">
          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content">
                Banner Layout Variant
              </span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full">
              {[
                { label: "Split", value: "split" },
                { label: "Centered", value: "centered" },
                { label: "Banner", value: "banner" },
                { label: "Hero Glass", value: "hero" },
                { label: "Minimal", value: "minimal" },
              ].map((st) => (
                <button
                  type="button"
                  key={st.value}
                  class={`btn btn-sm text-[11px] sm:text-xs px-1.5 py-1 h-auto min-h-[32px] sm:min-h-[36px] text-center leading-tight flex items-center justify-center ${
                    ((options as WidescreenCardOptions).bannerVariant ||
                      (options as WidescreenCardOptions).layoutStyle ||
                      "split") === st.value
                      ? "btn-active btn-primary shadow-xs font-semibold"
                      : "btn-ghost bg-base-200 hover:bg-base-300"
                  }`}
                  onClick={() =>
                    setOptions((prev) => ({
                      ...(prev as WidescreenCardOptions),
                      layoutStyle: st.value as WidescreenLayout,
                      bannerVariant: st.value as BannerVariant,
                    }))}
                >
                  <span>{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Vertical Alignment */}
          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content">
                Text Vertical Alignment
              </span>
            </div>
            <div class="grid grid-cols-3 gap-2 w-full">
              {verticalAlignOptions.map((va) => (
                <button
                  type="button"
                  key={va.value}
                  class={`btn btn-sm text-xs px-2 py-1.5 h-auto min-h-[36px] text-center leading-tight flex items-center justify-center ${
                    ((options as WidescreenCardOptions).verticalAlign || "middle") === va.value
                      ? "btn-active btn-primary shadow-xs font-semibold"
                      : "btn-ghost bg-base-200 hover:bg-base-300"
                  }`}
                  onClick={() =>
                    setOptions((prev) => ({
                      ...(prev as WidescreenCardOptions),
                      verticalAlign: va.value,
                    }))}
                >
                  <span>{va.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Alignment Offsets */}
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <SliderControl
              label="Text Vertical Offset"
              value={options.verticalOffset || 0}
              min={-150}
              max={150}
              step={1}
              unit="px"
              presets={[-30, -10, 0, 10, 30]}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  verticalOffset: val,
                }))}
            />
            <SliderControl
              label="Text Horizontal Offset"
              value={options.horizontalOffset || 0}
              min={-150}
              max={150}
              step={1}
              unit="px"
              presets={[-30, -10, 0, 10, 30]}
              onChange={(val) =>
                setOptions((prev) => ({
                  ...prev,
                  horizontalOffset: val,
                }))}
            />
          </div>
        </div>
      )}

      {options.generateType === "badge" && (
        <div class="bg-base-200 p-3 sm:p-4 rounded-xl border border-base-300 flex flex-col gap-3.5">
          <span class="text-xs font-bold text-primary uppercase tracking-wider">
            Badge Variant & Dimensions
          </span>

          {/* Badge Variant Selector */}
          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content">
                Badge Variant
              </span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full">
              {[
                { label: "Standard", value: "standard" },
                { label: "Pill", value: "pill" },
                { label: "Split", value: "split" },
                { label: "Status", value: "status" },
                { label: "Outline", value: "outline" },
              ].map((v) => (
                <button
                  type="button"
                  key={v.value}
                  class={`btn btn-sm text-[11px] sm:text-xs px-1.5 py-1 h-auto min-h-[32px] sm:min-h-[36px] text-center leading-tight flex items-center justify-center ${
                    ((options as BadgeCardOptions).badgeVariant || "standard") ===
                        v.value
                      ? "btn-active btn-primary shadow-xs font-semibold"
                      : "btn-ghost bg-base-100 hover:bg-base-300"
                  }`}
                  onClick={() =>
                    setOptions((prev) => ({
                      ...(prev as BadgeCardOptions),
                      badgeVariant: v.value as BadgeVariant,
                    }))}
                >
                  <span>{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Placement */}
          <div class="flex flex-col gap-1.5 w-full">
            <div class="flex justify-between items-center min-h-[22px]">
              <span class="text-xs font-semibold text-base-content">
                Icon Placement
              </span>
            </div>
            <div class="grid grid-cols-3 gap-1.5 w-full">
              {[
                { label: "Icon Left", value: "left" },
                { label: "Icon Right", value: "right" },
                { label: "No Icon", value: "none" },
              ].map((pos) => (
                <button
                  type="button"
                  key={pos.value}
                  class={`btn btn-sm text-[11px] sm:text-xs px-1.5 py-1 h-auto min-h-[32px] sm:min-h-[36px] text-center leading-tight flex items-center justify-center ${
                    ((options as BadgeCardOptions).iconPosition || "left") ===
                        pos.value
                      ? "btn-active btn-primary shadow-xs font-semibold"
                      : "btn-ghost bg-base-100 hover:bg-base-300"
                  }`}
                  onClick={() =>
                    setOptions((prev) => ({
                      ...(prev as BadgeCardOptions),
                      iconPosition: pos.value as "left" | "right" | "none",
                    }))}
                >
                  <span>{pos.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Split Variant Specific Controls */}
          {(options as BadgeCardOptions).badgeVariant === "split" && (
            <div class="bg-base-100 p-3 rounded-lg border border-base-300 flex flex-col gap-3">
              <div class="flex justify-between items-center">
                <span class="text-[11px] font-bold text-base-content/80 uppercase tracking-wider">
                  Split / Shields Settings
                </span>
                <span class="text-[10px] text-base-content/60 font-mono">
                  {(options as BadgeCardOptions).splitPosition ? `${(options as BadgeCardOptions).splitPosition}% split` : "Auto-balanced"}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-base-content/70">
                    Left Label Text
                  </label>
                  <input
                    type="text"
                    class="input input-bordered input-sm text-xs font-semibold"
                    placeholder="e.g. BUILD, NPM, VERSION, LICENSE"
                    value={(options as BadgeCardOptions).badgeLabel || "BUILD"}
                    onInput={(e) =>
                      setOptions((prev) => ({
                        ...(prev as BadgeCardOptions),
                        badgeLabel: e.currentTarget.value,
                      }))}
                  />
                  <div class="flex flex-wrap gap-1 mt-1">
                    {["BUILD", "NPM", "VERSION", "LICENSE", "STARS", "STATUS"].map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-base-200 hover:bg-base-300 text-base-content/70"
                        onClick={() =>
                          setOptions((prev) => ({
                            ...(prev as BadgeCardOptions),
                            badgeLabel: tag,
                          }))}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <div class="flex flex-col gap-1">
                    <label class="text-xs font-medium text-base-content/70">
                      Left Compartment Background
                    </label>
                    <div class="flex items-center gap-1.5">
                      <input
                        type="color"
                        class="w-7 h-7 rounded-md p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
                        value={(options as BadgeCardOptions).labelBackground || "#1e293b"}
                        onInput={(e) =>
                          setOptions((prev) => ({
                            ...(prev as BadgeCardOptions),
                            labelBackground: e.currentTarget.value,
                          }))}
                      />
                      <input
                        type="text"
                        class="input input-bordered input-sm flex-1 font-mono text-xs"
                        value={(options as BadgeCardOptions).labelBackground || "#1e293b"}
                        onInput={(e) =>
                          setOptions((prev) => ({
                            ...(prev as BadgeCardOptions),
                            labelBackground: e.currentTarget.value,
                          }))}
                      />
                    </div>
                  </div>

                  <div class="flex flex-col gap-1">
                    <label class="text-xs font-medium text-base-content/70">
                      Label Text Color
                    </label>
                    <div class="flex items-center gap-1.5">
                      <input
                        type="color"
                        class="w-7 h-7 rounded-md p-0.5 cursor-pointer border border-base-300 bg-base-100 flex-shrink-0"
                        value={(options as BadgeCardOptions).labelColor || "#94a3b8"}
                        onInput={(e) =>
                          setOptions((prev) => ({
                            ...(prev as BadgeCardOptions),
                            labelColor: e.currentTarget.value,
                          }))}
                      />
                      <input
                        type="text"
                        class="input input-bordered input-sm flex-1 font-mono text-xs"
                        value={(options as BadgeCardOptions).labelColor || "#94a3b8"}
                        onInput={(e) =>
                          setOptions((prev) => ({
                            ...(prev as BadgeCardOptions),
                            labelColor: e.currentTarget.value,
                          }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <SliderControl
                label="Split Position (0 for Auto)"
                value={(options as BadgeCardOptions).splitPosition || 0}
                min={0}
                max={80}
                step={5}
                unit="%"
                presets={[0, 25, 35, 50, 65]}
                onChange={(val) =>
                  setOptions((prev) => ({
                    ...(prev as BadgeCardOptions),
                    splitPosition: val,
                  }))}
              />
            </div>
          )}

          {/* Status Variant Specific Controls */}
          {(options as BadgeCardOptions).badgeVariant === "status" && (
            <div class="bg-base-100 p-3 rounded-lg border border-base-300 flex flex-col gap-3">
              <span class="text-[11px] font-bold text-base-content/80 uppercase tracking-wider">
                Status Indicator & Style
              </span>

              {/* Status Style & Placement */}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-base-content/70">
                    Status Display Style
                  </label>
                  <div class="grid grid-cols-2 gap-1.5 w-full">
                    {[
                      { label: "Pill Tag", value: "pill" },
                      { label: "Dot", value: "dot" },
                    ].map((st) => (
                      <button
                        type="button"
                        key={st.value}
                        class={`btn btn-xs text-xs min-w-0 px-1 ${
                          ((options as BadgeCardOptions).statusStyle || "pill") === st.value
                            ? "btn-active btn-primary shadow-xs font-semibold"
                            : "btn-ghost bg-base-200 hover:bg-base-300"
                        }`}
                        onClick={() =>
                          setOptions((prev) => ({
                            ...(prev as BadgeCardOptions),
                            statusStyle: st.value as "pill" | "dot",
                          }))}
                      >
                        <span class="truncate">{st.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium text-base-content/70">
                    Status Placement
                  </label>
                  <div class="grid grid-cols-2 gap-1.5 w-full">
                    {[
                      { label: "Right Side", value: "right" },
                      { label: "Left Side", value: "left" },
                    ].map((sp) => (
                      <button
                        type="button"
                        key={sp.value}
                        class={`btn btn-xs text-xs min-w-0 px-1 ${
                          ((options as BadgeCardOptions).statusPosition || "right") === sp.value
                            ? "btn-active btn-primary shadow-xs font-semibold"
                            : "btn-ghost bg-base-200 hover:bg-base-300"
                        }`}
                        onClick={() =>
                          setOptions((prev) => ({
                            ...(prev as BadgeCardOptions),
                            statusPosition: sp.value as "right" | "left",
                          }))}
                      >
                        <span class="truncate">{sp.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Message Text */}
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-base-content/70">
                  Status State / Label
                </label>
                <input
                  type="text"
                  class="input input-bordered input-sm text-xs font-semibold"
                  placeholder="e.g. OPERATIONAL, LIVE, ONLINE, BETA, 99.9% UPTIME"
                  value={(options as BadgeCardOptions).statusText ?? "OPERATIONAL"}
                  onInput={(e) =>
                    setOptions((prev) => ({
                      ...(prev as BadgeCardOptions),
                      statusText: e.currentTarget.value,
                    }))}
                />
                <div class="flex flex-wrap gap-1 mt-1">
                  {["OPERATIONAL", "LIVE", "ONLINE", "PASSING", "BETA", "99.9% UPTIME"].map((st) => (
                    <button
                      type="button"
                      key={st}
                      class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-base-200 hover:bg-base-300 text-base-content/70"
                      onClick={() =>
                        setOptions((prev) => ({
                          ...(prev as BadgeCardOptions),
                          statusText: st,
                        }))}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Indicator Color */}
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-base-content/70">
                  Status Indicator Color
                </label>
                <div class="flex flex-wrap items-center gap-1.5">
                  {[
                    { label: "Active", color: "#10b981" },
                    { label: "Warning", color: "#f59e0b" },
                    { label: "Offline", color: "#ef4444" },
                    { label: "Live", color: "#0ea5e9" },
                    { label: "Beta", color: "#8b5cf6" },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.color}
                      class={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 border transition-all ${
                        ((options as BadgeCardOptions).statusColor || "#10b981") === s.color
                          ? "border-primary bg-primary/10 font-bold"
                          : "border-base-300 bg-base-200 hover:bg-base-300"
                      }`}
                      onClick={() =>
                        setOptions((prev) => ({
                          ...(prev as BadgeCardOptions),
                          statusColor: s.color,
                        }))}
                    >
                      <span
                        class="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: s.color }}
                      />
                      <span>{s.label}</span>
                    </button>
                  ))}
                  <input
                    type="color"
                    class="w-7 h-7 rounded-md p-0.5 cursor-pointer border border-base-300 bg-base-100 ml-auto flex-shrink-0"
                    value={(options as BadgeCardOptions).statusColor || "#10b981"}
                    onInput={(e) =>
                      setOptions((prev) => ({
                        ...(prev as BadgeCardOptions),
                        statusColor: e.currentTarget.value,
                      }))}
                    aria-label="Custom status indicator color"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Badge Dimensions */}
          <div class="flex flex-col gap-2.5 bg-base-100 p-3 rounded-lg border border-base-300">
            <div class="flex justify-between items-center">
              <span class="text-xs font-semibold text-base-content flex items-center gap-1.5">
                <span>Badge Dimensions</span>
              </span>
              <label class="label cursor-pointer gap-2 p-0">
                <span class="text-xs font-medium text-base-content/80">Auto Fit Content</span>
                <input
                  type="checkbox"
                  class="toggle toggle-primary toggle-sm"
                  checked={Boolean((options as BadgeCardOptions).badgeAutoSize)}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...(prev as BadgeCardOptions),
                      badgeAutoSize: e.currentTarget.checked,
                    }))}
                />
              </label>
            </div>

            {(options as BadgeCardOptions).badgeAutoSize ? (
              <div class="text-xs text-base-content/70 bg-base-200 p-2.5 rounded-md flex items-center justify-between">
                <span>Calculated size from text & icon:</span>
                <span class="font-mono font-bold text-primary">
                  {getCardDimensionsLabel(options)}
                </span>
              </div>
            ) : (
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start pt-1">
                <SliderControl
                  label="Badge Width"
                  fieldKey="badgeWidth"
                  value={(options as BadgeCardOptions).badgeWidth || 400}
                  min={120}
                  max={1000}
                  step={10}
                  presets={[250, 320, 400, 500, 600]}
                  onChange={(val) =>
                    setOptions((prev) => ({
                      ...(prev as BadgeCardOptions),
                      badgeWidth: val,
                    }))}
                />
                <SliderControl
                  label="Badge Height"
                  fieldKey="badgeHeight"
                  value={(options as BadgeCardOptions).badgeHeight || 120}
                  min={40}
                  max={300}
                  step={5}
                  presets={[60, 80, 100, 120, 160]}
                  onChange={(val) =>
                    setOptions((prev) => ({
                      ...(prev as BadgeCardOptions),
                      badgeHeight: val,
                    }))}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div class="divider my-0"></div>

      {/* 2. Card Title */}
      <div class="flex flex-col gap-1.5 w-full">
        <div class="flex justify-between items-center min-h-[22px]">
          <label class="text-xs font-semibold text-base-content flex items-center gap-1">
            <span>Title</span>
            <FieldGuide fieldKey="title" />
          </label>
        </div>
        <input
          type="text"
          id="title"
          class="input input-bordered input-sm w-full font-medium text-xs"
          value={options.title || ""}
          onInput={(e) =>
            setOptions((prev) => ({
              ...prev,
              title: e.currentTarget.value,
            }))}
          placeholder="e.g. MaskedGUI"
        />
        <div class="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span class="text-[11px] text-base-content/60 font-medium">Suggestions:</span>
          {TITLE_SUGGESTIONS.map((chip) => (
            <button
              type="button"
              key={chip.label}
              class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-base-200 hover:bg-base-300 text-base-content/80 transition-colors"
              onClick={() =>
                setOptions((prev) => ({
                  ...prev,
                  title: chip.value,
                }))}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Card Description (Not for Badge) */}
      {options.generateType !== "badge" && (
        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex justify-between items-center min-h-[22px]">
            <label class="text-xs font-semibold text-base-content flex items-center gap-1">
              <span>Description</span>
              <FieldGuide fieldKey="description" />
            </label>
          </div>
          <textarea
            id="description"
            rows={3}
            class="textarea textarea-bordered textarea-sm w-full font-medium text-xs leading-relaxed min-h-[72px]"
            value={"description" in options ? options.description || "" : ""}
            onInput={(e) => {
              const val = e.currentTarget.value;
              setOptions((prev) => ({
                ...prev,
                ...("description" in prev ? { description: val } : {}),
              }));
            }}
            placeholder="Enter description lines (Enter creates new line)..."
          />
          <div class="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span class="text-[11px] text-base-content/60 font-medium">Templates:</span>
            {DESCRIPTION_SUGGESTIONS.map((chip) => (
              <button
                type="button"
                key={chip.label}
                class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-base-200 hover:bg-base-300 text-base-content/80 transition-colors"
                onClick={() => {
                  setOptions((prev) => ({
                    ...prev,
                    ...("description" in prev
                      ? { description: chip.value }
                      : {}),
                  }));
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div class="divider my-0"></div>

      {/* 4. Logo / Image Controls */}
      <ImageControls options={options} setOptions={setOptions} />
    </div>
  );
};
