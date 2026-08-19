import { FunctionalComponent } from "preact";
import {
  BadgeCardOptions,
  CardOptions,
  GenerateType,
  StandardCardOptions,
  TextAlign,
  WideCardOptions,
  WidescreenCardOptions,
  WidescreenLayout,
} from "../../types.ts";
import { FieldGuide } from "../FieldGuide.tsx";
import { SliderControl } from "../SliderControl.tsx";
import { ImageControls } from "./ImageControls.tsx";
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
              class={`btn btn-sm text-xs min-w-0 px-1 ${
                options.generateType === fmt.value
                  ? "btn-active btn-primary shadow-xs font-semibold"
                  : "btn-ghost bg-base-200 hover:bg-base-300"
              }`}
              onClick={() => onFormatChange(fmt.value)}
            >
              <span class="truncate">{fmt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Format-Specific Layout Controls */}
      {options.generateType === "card" && (
        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex justify-between items-center min-h-[22px]">
            <span class="text-xs font-semibold text-base-content">
              Text Alignment
            </span>
          </div>
          <div class="grid grid-cols-2 gap-1.5 w-full">
            <button
              type="button"
              class={`btn btn-sm text-xs min-w-0 px-1 ${
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
              <span class="truncate">Centered</span>
            </button>
            <button
              type="button"
              class={`btn btn-sm text-xs min-w-0 px-1 ${
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
              <span class="truncate">Left Aligned</span>
            </button>
          </div>
        </div>
      )}

      {options.generateType === "widecard" && (
        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex justify-between items-center min-h-[22px]">
            <span class="text-xs font-semibold text-base-content">
              Logo Placement
            </span>
          </div>
          <div class="grid grid-cols-2 gap-1.5 w-full">
            <button
              type="button"
              class={`btn btn-sm text-xs min-w-0 px-1 ${
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
              <span class="truncate">Logo on Left</span>
            </button>
            <button
              type="button"
              class={`btn btn-sm text-xs min-w-0 px-1 ${
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
              <span class="truncate">Logo on Right</span>
            </button>
          </div>
        </div>
      )}

      {options.generateType === "widescreen" && (
        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex justify-between items-center min-h-[22px]">
            <span class="text-xs font-semibold text-base-content">
              Widescreen Composition Style
            </span>
          </div>
          <div class="grid grid-cols-3 gap-1.5 w-full">
            {[
              { label: "Split", value: "split" },
              { label: "Centered", value: "centered" },
              { label: "Banner", value: "banner" },
            ].map((st) => (
              <button
                type="button"
                key={st.value}
                class={`btn btn-sm text-xs min-w-0 px-1 ${
                  ((options as WidescreenCardOptions).layoutStyle ||
                      "split") === st.value
                    ? "btn-active btn-primary shadow-xs font-semibold"
                    : "btn-ghost bg-base-200 hover:bg-base-300"
                }`}
                onClick={() =>
                  setOptions((prev) => ({
                    ...(prev as WidescreenCardOptions),
                    layoutStyle: st.value as WidescreenLayout,
                  }))}
              >
                <span class="truncate">{st.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {options.generateType === "badge" && (
        <div class="bg-base-200 p-3 sm:p-4 rounded-xl border border-base-300 flex flex-col gap-3">
          <span class="text-xs font-bold text-primary uppercase tracking-wider">
            Badge Style & Dimensions
          </span>
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
                  class={`btn btn-sm text-xs min-w-0 px-1 ${
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
                  <span class="truncate">{pos.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start">
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
