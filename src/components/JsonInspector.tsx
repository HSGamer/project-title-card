import { FunctionalComponent } from "preact";
import { useRef, useState } from "preact/hooks";
import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconFileImport,
  IconRotate,
} from "@tabler/icons-preact";
import { CardOptions } from "../types.ts";
import { exportOptions, importOptions } from "../utils/export.ts";
import { getDefaultLayout } from "../layouts/registry.ts";

interface JsonInspectorProps {
  options: CardOptions;
  setOptions: (fn: (prev: CardOptions) => CardOptions) => void;
}

export const JsonInspector: FunctionalComponent<JsonInspectorProps> = ({
  options,
  setOptions,
}) => {
  const jsonFileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const jsonString = JSON.stringify(options, null, 2);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      console.warn("Failed to copy JSON");
    }
  };

  const handleJsonImport = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    try {
      const imported = await importOptions(file);
      setOptions(() => imported);
    } catch (err) {
      setErrorMsg(
        "Failed to parse JSON file: " +
          (err instanceof Error ? err.message : String(err)),
      );
    } finally {
      if (jsonFileInputRef.current) jsonFileInputRef.current.value = "";
    }
  };

  const handleResetToDefault = () => {
    if (confirm("Reset all settings to default options for this layout?")) {
      const defaultLayout = getDefaultLayout();
      setOptions(() => ({ ...defaultLayout.defaultOptions }));
    }
  };

  return (
    <div class="flex flex-col gap-3.5 w-full">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold text-base-content">
          Card Configuration JSON
        </span>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="btn btn-xs btn-outline gap-1 text-xs"
            onClick={handleCopyJson}
          >
            {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
            <span>{copied ? "Copied" : "Copy JSON"}</span>
          </button>
          <button
            type="button"
            class="btn btn-xs btn-outline gap-1 text-xs"
            onClick={() => exportOptions(options)}
          >
            <IconDownload size={13} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div class="alert alert-error alert-sm p-2 text-xs">
          <span>{errorMsg}</span>
        </div>
      )}

      <div class="relative">
        <pre class="bg-base-200 text-base-content/90 p-3 rounded-xl border border-base-300 font-mono text-[11px] leading-relaxed max-h-[360px] overflow-auto select-all">
          {jsonString}
        </pre>
      </div>

      <div class="flex flex-col sm:flex-row gap-2 pt-2 border-t border-base-300">
        <input
          type="file"
          ref={jsonFileInputRef}
          onChange={handleJsonImport}
          accept="application/json"
          class="hidden"
        />
        <button
          type="button"
          class="btn btn-sm btn-outline gap-1.5 text-xs flex-1"
          onClick={() => jsonFileInputRef.current?.click()}
        >
          <IconFileImport size={14} />
          <span>Import JSON File</span>
        </button>
        <button
          type="button"
          class="btn btn-sm btn-ghost text-error gap-1.5 text-xs flex-1"
          onClick={handleResetToDefault}
        >
          <IconRotate size={14} />
          <span>Reset Defaults</span>
        </button>
      </div>
    </div>
  );
};
