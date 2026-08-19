import { FunctionalComponent } from "preact";
import { useRef } from "preact/hooks";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-preact";
import { CardOptions, ImageShape } from "../../types.ts";
import { FieldGuide } from "../FieldGuide.tsx";
import { SliderControl } from "../SliderControl.tsx";
import { LOGO_SUGGESTIONS } from "../../data/suggestions.ts";

interface ImageControlsProps {
  options: CardOptions;
  setOptions: (fn: (prev: CardOptions) => CardOptions) => void;
}

export const ImageControls: FunctionalComponent<ImageControlsProps> = (
  { options, setOptions },
) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDataUrl = options.image?.url?.startsWith("data:");

  const handleImageUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const dataUrl = reader.result;
        setOptions((prev) => ({
          ...prev,
          image: {
            ...prev.image,
            url: dataUrl,
            show: true,
          },
        }));
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.onerror = () => {
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  const imageShapes: { label: string; value: ImageShape }[] = [
    { label: "Original", value: "original" },
    { label: "Rounded", value: "rounded" },
    { label: "Circle", value: "circle" },
  ];

  return (
    <div class="flex flex-col gap-3">
      <div class="flex justify-between items-center min-h-[24px]">
        <label class="text-xs font-semibold text-base-content flex items-center gap-1">
          <span>Card Logo / Image</span>
          {isDataUrl && (
            <span class="badge badge-sm badge-neutral gap-1 text-[10px] py-0 px-1.5">
              <IconPhoto size={10} />
              Uploaded
            </span>
          )}
          <FieldGuide fieldKey="image" />
        </label>

        <div class="flex items-center gap-2">
          <label class="cursor-pointer flex items-center gap-1.5 py-0">
            <span class="text-xs text-base-content/70">Show</span>
            <input
              type="checkbox"
              class="toggle toggle-primary toggle-xs"
              checked={options.image?.show !== false}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  image: { ...prev.image, show: e.currentTarget.checked },
                }))}
            />
          </label>

          {options.image?.url && (
            <button
              type="button"
              class="btn btn-xs btn-ghost text-error gap-0.5"
              onClick={() =>
                setOptions((prev) => ({
                  ...prev,
                  image: { ...prev.image, url: "" },
                }))}
            >
              <IconX size={12} />
              Clear
            </button>
          )}
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          class="input input-bordered input-sm flex-1 font-mono text-xs w-full"
          value={options.image?.url || ""}
          onInput={(e) =>
            setOptions((prev) => ({
              ...prev,
              image: { ...prev.image, url: e.currentTarget.value },
            }))}
          placeholder="Paste image URL or upload file..."
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          class="hidden"
        />
        <button
          type="button"
          class="btn btn-sm btn-outline gap-1 text-xs w-full sm:w-auto"
          onClick={() => fileInputRef.current?.click()}
        >
          <IconUpload size={14} />
          Upload Image
        </button>
      </div>

      {/* Demo Logo suggestions */}
      <div class="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span class="text-[11px] text-base-content/60 font-medium">Demo:</span>
        {LOGO_SUGGESTIONS.map((chip) => (
          <button
            type="button"
            key={chip.label}
            class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-base-200 hover:bg-base-300 text-base-content/80 transition-colors"
            onClick={() =>
              setOptions((prev) => ({
                ...prev,
                image: { ...prev.image, url: chip.value, show: true },
              }))}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Image shape and sizing */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start mt-1">
        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex justify-between items-center min-h-[22px]">
            <span class="text-xs font-semibold text-base-content">
              Image Shape
            </span>
          </div>
          <div class="grid grid-cols-3 gap-1.5 w-full">
            {imageShapes.map((shape) => (
              <button
                type="button"
                key={shape.value}
                class={`btn btn-sm text-xs min-w-0 px-1 ${
                  (options.image?.shape || "rounded") === shape.value
                    ? "btn-active btn-primary shadow-xs font-semibold"
                    : "btn-ghost bg-base-200 hover:bg-base-300"
                }`}
                onClick={() =>
                  setOptions((prev) => ({
                    ...prev,
                    image: { ...prev.image, shape: shape.value },
                  }))}
              >
                <span class="truncate">{shape.label}</span>
              </button>
            ))}
          </div>
        </div>

        <SliderControl
          label="Logo Size"
          value={options.image?.size ||
            (options.generateType === "badge" ? 70 : 240)}
          min={options.generateType === "badge" ? 20 : 60}
          max={options.generateType === "badge" ? 180 : 360}
          step={5}
          onChange={(val) =>
            setOptions((prev) => ({
              ...prev,
              image: { ...prev.image, size: val },
            }))}
        />
      </div>
    </div>
  );
};
