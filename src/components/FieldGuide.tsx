import { FunctionalComponent } from "preact";
import { IconInfoCircle } from "@tabler/icons-preact";
import { FIELD_GUIDES } from "../data/suggestions.ts";

interface FieldGuideProps {
  fieldKey: keyof typeof FIELD_GUIDES;
}

export const FieldGuide: FunctionalComponent<FieldGuideProps> = (
  { fieldKey },
) => {
  const guide = FIELD_GUIDES[fieldKey];
  if (!guide) return null;

  return (
    <div
      class="tooltip tooltip-right inline-flex items-center z-10"
      data-tip={`${guide.title}: ${guide.content}`}
    >
      <span
        class="text-base-content/50 hover:text-primary transition-colors cursor-help inline-flex items-center ml-1"
        aria-label={`Guide for ${guide.title}`}
      >
        <IconInfoCircle size={15} />
      </span>
    </div>
  );
};
