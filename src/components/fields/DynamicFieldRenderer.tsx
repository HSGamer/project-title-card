import { FunctionalComponent } from "preact";
import { LayoutField } from "../../layouts/types.ts";
import { CardOptions } from "../../types.ts";
import { getNestedValue, setNestedValue } from "../../utils/nested-path.ts";
import { SegmentedControl } from "./SegmentedControl.tsx";
import { SelectControl } from "./SelectControl.tsx";
import { SliderFieldControl } from "./SliderFieldControl.tsx";
import { TextFieldControl } from "./TextFieldControl.tsx";
import { TextareaFieldControl } from "./TextareaFieldControl.tsx";
import { BooleanFieldControl } from "./BooleanFieldControl.tsx";
import { ColorFieldControl } from "./ColorFieldControl.tsx";

export interface DynamicFieldRendererProps {
  fields: LayoutField[];
  options: CardOptions;
  setOptions: (fn: (prev: CardOptions) => CardOptions) => void;
}

export const DynamicFieldRenderer: FunctionalComponent<
  DynamicFieldRendererProps
> = ({
  fields,
  options,
  setOptions,
}) => {
  if (!fields || fields.length === 0) return null;

  // Filter fields that satisfy visibleIf predicate
  const visibleFields = fields.filter((f) =>
    f.visibleIf ? f.visibleIf(options) : true
  );

  if (visibleFields.length === 0) return null;

  const handleFieldChange = (key: string, val: any) => {
    setOptions((prev) => setNestedValue(prev, key, val));
  };

  const renderSingleField = (field: LayoutField) => {
    const rawVal = getNestedValue(options, field.key);

    switch (field.type) {
      case "segmented":
        return (
          <SegmentedControl
            key={field.key}
            label={field.label}
            description={field.description}
            value={rawVal}
            options={field.options}
            onChange={(val) => handleFieldChange(field.key, val)}
          />
        );

      case "select":
        return (
          <SelectControl
            key={field.key}
            label={field.label}
            description={field.description}
            value={rawVal}
            options={field.options}
            onChange={(val) => handleFieldChange(field.key, val)}
          />
        );

      case "slider":
        return (
          <SliderFieldControl
            key={field.key}
            label={field.label}
            description={field.description}
            value={typeof rawVal === "number" ? rawVal : field.min}
            min={field.min}
            max={field.max}
            step={field.step}
            unit={field.unit}
            quickValues={field.quickValues}
            onChange={(val) => handleFieldChange(field.key, val)}
          />
        );

      case "text":
        return (
          <TextFieldControl
            key={field.key}
            label={field.label}
            description={field.description}
            value={rawVal || ""}
            placeholder={field.placeholder}
            suggestions={field.suggestions}
            suggestionsLabel={field.suggestionsLabel}
            allowUpload={field.allowUpload}
            uploadType={field.uploadType}
            allowClear={field.allowClear}
            onChange={(val) => handleFieldChange(field.key, val)}
          />
        );

      case "textarea":
        return (
          <TextareaFieldControl
            key={field.key}
            label={field.label}
            description={field.description}
            value={rawVal || ""}
            placeholder={field.placeholder}
            rows={field.rows}
            suggestions={field.suggestions}
            suggestionsLabel={field.suggestionsLabel}
            onChange={(val) => handleFieldChange(field.key, val)}
          />
        );

      case "boolean":
        return (
          <BooleanFieldControl
            key={field.key}
            label={field.label}
            description={field.description}
            value={Boolean(rawVal)}
            onChange={(val) => handleFieldChange(field.key, val)}
          />
        );

      case "color":
        return (
          <ColorFieldControl
            key={field.key}
            label={field.label}
            description={field.description}
            value={rawVal || field.fallback || "#ffffff"}
            fallback={field.fallback}
            swatches={field.swatches}
            onChange={(val) => handleFieldChange(field.key, val)}
          />
        );

      default:
        return null;
    }
  };

  // Group fields by `field.group`
  const groupedSections: { groupName: string | null; items: LayoutField[] }[] =
    [];

  for (const field of visibleFields) {
    const groupName = field.group || null;
    const lastSection = groupedSections[groupedSections.length - 1];

    if (lastSection && lastSection.groupName === groupName) {
      lastSection.items.push(field);
    } else {
      groupedSections.push({
        groupName,
        items: [field],
      });
    }
  }

  return (
    <div class="flex flex-col gap-3.5 w-full">
      {groupedSections.map((section, idx) => {
        if (!section.groupName) {
          return (
            <div key={`ungrouped-${idx}`} class="flex flex-col gap-3.5 w-full">
              {section.items.map((field) => renderSingleField(field))}
            </div>
          );
        }

        return (
          <details
            key={`group-${section.groupName}-${idx}`}
            class="collapse collapse-arrow bg-base-200/50 border border-base-300 rounded-xl"
            open
          >
            <summary class="collapse-title text-xs font-bold flex items-center gap-2 min-h-0 py-2.5 px-3.5 cursor-pointer select-none">
              <span>{section.groupName}</span>
            </summary>
            <div class="collapse-content px-3.5 pb-3.5 pt-1 flex flex-col gap-3.5">
              {section.items.map((field) => renderSingleField(field))}
            </div>
          </details>
        );
      })}
    </div>
  );
};
