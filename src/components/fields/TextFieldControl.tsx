import { FunctionalComponent } from "preact";
import { useRef } from "preact/hooks";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-preact";
import { SuggestionChip } from "../../layouts/types.ts";

interface TextFieldControlProps {
  label: string;
  description?: string;
  value: string;
  placeholder?: string;
  suggestions?: SuggestionChip[];
  suggestionsLabel?: string;
  allowUpload?: boolean;
  uploadType?: "image" | "file";
  allowClear?: boolean;
  onChange: (val: string) => void;
}

export const TextFieldControl: FunctionalComponent<TextFieldControlProps> = ({
  label,
  description,
  value,
  placeholder,
  suggestions,
  suggestionsLabel = "Quick:",
  allowUpload,
  allowClear = true,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDataUrl = typeof value === "string" && value.startsWith("data:");

  const handleFileUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.onerror = () => {
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div class="flex flex-col gap-1.5 w-full">
      <div class="flex justify-between items-center min-h-[22px]">
        <div class="flex items-center gap-1.5">
          <span class="text-xs font-semibold text-base-content">{label}</span>
          {isDataUrl && (
            <span class="badge badge-sm badge-neutral gap-1 text-[10px] py-0 px-1.5">
              <IconPhoto size={10} />
              Uploaded
            </span>
          )}
        </div>
        {description && (
          <span class="text-[11px] text-base-content/60 font-mono">
            {description}
          </span>
        )}
        {allowClear && value && (
          <button
            type="button"
            class="btn btn-xs btn-ghost text-error gap-0.5"
            onClick={() => onChange("")}
          >
            <IconX size={12} />
            Clear
          </button>
        )}
      </div>

      <div class="flex flex-col sm:flex-row gap-1.5 w-full">
        <input
          type="text"
          class="input input-bordered input-sm flex-1 min-w-0 font-medium text-xs w-full"
          value={value}
          placeholder={placeholder}
          onInput={(e) => onChange(e.currentTarget.value)}
        />
        {allowUpload && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              class="hidden"
            />
            <button
              type="button"
              class="btn btn-sm btn-outline gap-1 text-xs w-full sm:w-auto flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <IconUpload size={14} />
              Upload
            </button>
          </>
        )}
      </div>

      {suggestions && suggestions.length > 0 && (
        <div class="flex flex-wrap items-center gap-1 pt-0.5">
          {suggestionsLabel && (
            <span class="text-[10px] text-base-content/60 font-medium">
              {suggestionsLabel}
            </span>
          )}
          {suggestions.map((chip) => (
            <button
              type="button"
              key={chip.label}
              class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-base-200 hover:bg-base-300 text-base-content/80 transition-colors"
              onClick={() => onChange(chip.value)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
