export interface SuggestionChip {
  label: string;
  value: string;
  description?: string;
}

export interface GradientPreset {
  id: string;
  name: string;
  start: string;
  end: string;
  middle?: string;
  direction?: "to-r" | "to-br" | "to-b" | "to-bl" | "radial";
}

export const FONT_FAMILY_OPTIONS = [
  {
    label: "Modern Sans (Inter / System)",
    value:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  { label: "Clean Verdana", value: "Verdana, Geneva, Tahoma, sans-serif" },
  {
    label: "Geometric Sans (Montserrat)",
    value: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
  },
  {
    label: "Rounded Sans (Poppins / Quicksand)",
    value: 'Poppins, Quicksand, "Nunito", sans-serif',
  },
  {
    label: "Classic Serif (Georgia)",
    value: 'Georgia, "Times New Roman", Times, serif',
  },
  {
    label: "Editorial Serif (Playfair)",
    value: '"Playfair Display", Didot, "Bodoni MT", Georgia, serif',
  },
  {
    label: "Developer Mono (JetBrains / Fira)",
    value: '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace',
  },
  {
    label: "Clean Code (Courier / Monaco)",
    value: '"Courier New", Courier, Monaco, monospace',
  },
  { label: "Bold Impact Display", value: 'Impact, "Arial Black", sans-serif' },
  {
    label: "Friendly Sans (Trebuchet)",
    value: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", sans-serif',
  },
];

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: "sunset-aurora",
    name: "Sunset Aurora",
    start: "#ea580c",
    middle: "#db2777",
    end: "#7c3aed",
    direction: "to-br",
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    start: "#0284c7",
    end: "#0d9488",
    direction: "to-r",
  },
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Glow",
    start: "#090a0f",
    middle: "#1e1b4b",
    end: "#06b6d4",
    direction: "to-br",
  },
  {
    id: "emerald-forest",
    name: "Emerald Forest",
    start: "#022c22",
    end: "#059669",
    direction: "to-br",
  },
  {
    id: "purple-nebula",
    name: "Purple Nebula",
    start: "#3b0764",
    middle: "#7c3aed",
    end: "#c084fc",
    direction: "to-br",
  },
  {
    id: "rose-gold",
    name: "Rose Gold",
    start: "#e11d48",
    middle: "#fb7185",
    end: "#fed7aa",
    direction: "to-r",
  },
  {
    id: "ember-fire",
    name: "Ember Fire",
    start: "#b91c1c",
    middle: "#ea580c",
    end: "#facc15",
    direction: "to-r",
  },
  {
    id: "midnight-slate",
    name: "Midnight Slate",
    start: "#0f172a",
    end: "#1e293b",
    direction: "to-b",
  },
  {
    id: "aurora-borealis",
    name: "Aurora Borealis",
    start: "#0f766e",
    middle: "#06b6d4",
    end: "#3b82f6",
    direction: "to-br",
  },
  {
    id: "clean-pastel",
    name: "Clean Pastel Light",
    start: "#f8fafc",
    end: "#e2e8f0",
    direction: "to-b",
  },
];

export const COLOR_SWATCHES = [
  "#ffffff",
  "#f8fafc",
  "#e2e8f0",
  "#94a3b8",
  "#475569",
  "#1e293b",
  "#0f172a",
  "#090a0f",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#84cc16",
  "#f59e0b",
  "#ea580c",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
  "#6366f1",
];

export const TITLE_SUGGESTIONS: SuggestionChip[] = [
  { label: "MaskedGUI", value: "MaskedGUI" },
  { label: "Project Name", value: "Awesome Project" },
  { label: "TypeScript SDK", value: "TypeScript SDK" },
  { label: "Title Card", value: "Title Card Generator" },
];

export const DESCRIPTION_SUGGESTIONS: SuggestionChip[] = [
  {
    label: "Feature Highlights",
    value: "Fast • Lightweight • Type-Safe\nZero Dependencies",
  },
  {
    label: "Library Summary",
    value: "A modern toolkit for\ndevelopers and creators",
  },
  {
    label: "Classic MaskedGUI",
    value: "A simple & powerful\nInventory GUI Library",
  },
];

export const LOGO_SUGGESTIONS: SuggestionChip[] = [
  {
    label: "MaskedGUI",
    value:
      "https://raw.githubusercontent.com/BetterGUI-MC/MaskedGUI/master/.github/image/logo.svg",
  },
  {
    label: "React",
    value:
      "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png",
  },
  {
    label: "TypeScript",
    value:
      "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png",
  },
  {
    label: "Node.js",
    value:
      "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png",
  },
];

export const FIELD_GUIDES = {
  generateType: {
    title: "Layout Format",
    content:
      "• Card (Portrait): 400 × 600 px (2:3 portrait). Ideal for showcase cards and mobile previews.\n• Wide (Banner): 800 × 300 px (8:3 banner). Best for README headers and GitHub profile highlights.\n• Widescreen (16:9): 720 × 405 px (16:9 widescreen). Perfect for video thumbnails, presentations, and social cards.\n• Badge: Compact pill or custom dimensions. Tailored for status icons, project tags, and repo badges.",
  },
  badgeWidth: {
    title: "Badge Width",
    content:
      "Custom badge width in pixels (100 to 2000 px). SVG viewBox dynamically adapts.",
  },
  badgeHeight: {
    title: "Badge Height",
    content:
      "Custom badge height in pixels (40 to 1000 px). Logo and text dynamically scale.",
  },
  title: {
    title: "Card Title",
    content: "Primary heading text for your project title card.",
  },
  description: {
    title: "Card Description",
    content:
      "Multi-line description. Press Enter for each new line. Automatically rendered into aligned rows.",
  },
  image: {
    title: "Logo & Image",
    content:
      "Upload a local image or paste any image URL. Choose between Original, Rounded, or Circular shape.",
  },
  background: {
    title: "Background Style",
    content:
      "Choose between a Solid Color, Vibrant Multi-Stop Gradients (Linear or Radial), or Modern Frosted Glass.",
  },
  border: {
    title: "Border & Frame",
    content:
      "Configure border thickness, border style (solid, dashed, dotted, none), color, corner radius, and outer margin.",
  },
  shadow: {
    title: "Shadow & Glow Effects",
    content:
      "Add subtle or deep drop shadows, or vibrant neon glow filters with custom glow colors.",
  },
  titleTypography: {
    title: "Title Typography",
    content:
      "Pick from curated font stacks, font weights (400-900), custom font size, letter spacing, uppercase transformation, and color.",
  },
  descriptionTypography: {
    title: "Description Typography",
    content:
      "Customize description font family, weight, color, line height spacing, opacity, and font size.",
  },
};
