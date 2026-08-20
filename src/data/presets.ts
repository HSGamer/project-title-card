import {
  BackgroundConfig,
  BorderConfig,
  CardOptions,
  DescriptionFontConfig,
  ImageConfig,
  TitleFontConfig,
} from "../types.ts";
import { normalizeCardOptions } from "../utils/normalizer.ts";

export interface PresetTheme {
  id: string;
  name: string;
  category: string;
  background: BackgroundConfig;
  border: BorderConfig;
  titleFont: Partial<TitleFontConfig>;
  descriptionFont: Partial<DescriptionFontConfig>;
  image?: Partial<ImageConfig>;
}

export type PresetCategory =
  | "Clean & Minimal"
  | "Dark & Developer"
  | "Vibrant & Gradients"
  | "Widescreen & Badges";

export interface CardPreset {
  id: string;
  name: string;
  category: PresetCategory;
  description: string;
  options: CardOptions;
}

// Raw templates from community examples
// BetterDialogs
export const betterdialogsPreset = {"backgroundStyle":"fill:white; stroke:black; stroke-width:10; fill-opacity:1","borderRadius":"10","borderMargin":"10","imageLink":"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDk5Ljk5OTk5OTk5OTk5OTk0IiBoZWlnaHQ9IjQ5OS45OTk5OTk5OTk5OTk5NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHBhdGggaWQ9InN2Z18xIiBzdHJva2Utd2lkdGg9IiAyMHB4IiBmaWxsPSIgcmdiKDI1NSwgMjU1LCAyNTUpIiBzdHJva2U9IiByZ2IoMCwgMCwgMCkiIGQ9Im0yNDkuOTM5LDM3LjAyOGwyMTIuOTExLDc0LjA1NmwwLDI3Ny43MWwtMjEyLjkxMSw3NC4wNTZsLTIxMi45MTEsLTc0LjA1NmwwLC0yNzcuNzFsMjEyLjkxMSwtNzQuMDU2eiIvPgogIDxwYXRoIGlkPSJzdmdfMiIgZmlsbD0iIHJnYigyNTUsIDI1NSwgMjU1KSIgc3Ryb2tlLXdpZHRoPSIgMjBweCIgc3Ryb2tlPSIgcmdiKDAsIDAsIDApIiBkPSJtMzcuMDI4LDExMS4wODRsMjEyLjI4LDc0LjA1NmwyMTMuNTQyLC03NC4wNTYiLz4KICA8cGF0aCBpZD0ic3ZnXzMiIHN0cm9rZS13aWR0aD0iIDIwcHgiIHN0cm9rZT0iIHJnYigwLCAwLCAwKSIgZmlsbD0iIHJnYigyMTYsIDIxNiwgMjE2KSIgZD0ibTI0OS45NTI5OCwxODUuMTM5OThsLTAuMTQyLDI3Ny43MSIvPgogIDxwYXRoIGlkPSJzdmdfNCIgc3Ryb2tlLXdpZHRoPSIgMTBweCIgc3Ryb2tlPSIgcmdiKDAsIDAsIDApIiBmaWxsPSIgcmdiKDIxNiwgMjE2LCAyMTYpIiBkPSJtNDYyLjg1MDAyLDIwMy42NTQwMWwtMjEzLjU0Miw3NC4wNTYiLz4KICA8cGF0aCBpZD0ic3ZnXzUiIGZpbGw9IiByZ2IoMjU1LCAyNTUsIDI1NSkiIHN0cm9rZS13aWR0aD0iIDEzcHgiIHN0cm9rZT0iIHJnYigwLCAwLCAwKSIgZD0ibTMzMy4yNTIsMjE1LjQxNGw0Ni4zNTIsLTE2LjQ1OWwwLDY3LjQ3MWwtNDYuMTI1LDE2Ljg2OGwtMC4yMjcsLTY3Ljg4eiIvPgogIDxwYXRoIHN0cm9rZT0iIHJnYigwLCAwLCAwKSIgaWQ9InN2Z18xNyIgZD0ibTEwOC4wOTA5NCwxNzIuNzcyNzRsNzAuMTgxODIsMjQuNDU0NTUiIG9wYWNpdHk9InVuZGVmaW5lZCIgc3Ryb2tlLXdpZHRoPSI4IiBmaWxsPSJub25lIi8+CiAgPHBhdGggc3Ryb2tlPSIgcmdiKDAsIDAsIDApIiBpZD0ic3ZnXzE5IiBkPSJtNjEuMDEwNzYsMTgzLjQ5NDUybDE2MS45MTQ2Myw1Ni40MzgwMiIgb3BhY2l0eT0idW5kZWZpbmVkIiBzdHJva2Utd2lkdGg9IjgiIGZpbGw9Im5vbmUiLz4KICA8cGF0aCBzdHJva2U9IiByZ2IoMCwgMCwgMCkiIGlkPSJzdmdfMjAiIGQ9Im02MS4wMTA3NiwyNTIuMDAwMDFsMTYxLjkxNDYzLDU2LjQzODAyIiBvcGFjaXR5PSJ1bmRlZmluZWQiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIHN0cm9rZT0iIHJnYigwLCAwLCAwKSIgaWQ9InN2Z18yMSIgZD0ibTYxLjAxMDc2LDI4Mi4wMDAwMWwxNjEuOTE0NjMsNTYuNDM4MDIiIG9wYWNpdHk9InVuZGVmaW5lZCIgc3Ryb2tlLXdpZHRoPSI4IiBmaWxsPSJub25lIi8+CiAgPHBhdGggc3Ryb2tlPSIgcmdiKDAsIDAsIDApIiBpZD0ic3ZnXzIyIiBkPSJtNjEuMDEwNzYsMzEybDE2MS45MTQ2Myw1Ni40MzgwMiIgb3BhY2l0eT0idW5kZWZpbmVkIiBzdHJva2Utd2lkdGg9IjgiIGZpbGw9Im5vbmUiLz4KICA8cGF0aCBzdHJva2U9IiByZ2IoMCwgMCwgMCkiIGlkPSJzdmdfMjMiIGQ9Im02MS4wMTA3NiwzNDJsMTYxLjkxNDYzLDU2LjQzODAyIiBvcGFjaXR5PSJ1bmRlZmluZWQiIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIHN0cm9rZS1kYXNoYXJyYXk9IjIsMiIgc3Ryb2tlPSIgcmdiKDAsIDAsIDApIiBpZD0ic3ZnXzI0IiBkPSJtNjEuMDEwNzYsMzY3LjI3MmwxNjEuOTE0NjMsNTYuNDM4MDIiIG9wYWNpdHk9InVuZGVmaW5lZCIgc3Ryb2tlLXdpZHRoPSIxNSIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIHN0cm9rZT0iIHJnYigwLCAwLCAwKSIgaWQ9InN2Z18yNSIgZD0ibTE1MC4yNzg0NCwyNTJsNzAuMTgxODIsMjQuNDU0NTUiIG9wYWNpdHk9InVuZGVmaW5lZCIgc3Ryb2tlLXdpZHRoPSI4IiBmaWxsPSJub25lIi8+CiA8L2c+Cjwvc3ZnPg==","title":"BetterDialogs","titleStyle":"fill: black; font-weight: bold; font-family: Arial;","description":"An addon for\nDialogs","descriptionStyle":"fill: black; font-family: monospace;","defs":"","generateType":""};

// ExtraVoucher
export const extra_voucherPreset = {"backgroundStyle":"fill:white; stroke:black; stroke-width:2; fill-opacity:1","borderRadius":"10","borderMargin":"10","imageLink":"data:image/png;base64,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","title":"ExtraVoucher","titleStyle":"fill: black; font-weight: bold; font-family: Arial;","description":"Voucher & Gift Code\nRedeem for Rewards","descriptionStyle":"fill: black; font-family: Monospace;","defs":"","generateType":"widecard"};

// ExtraStorage
export const extra_storagePreset = {"backgroundStyle":"fill:white; stroke:black; stroke-width:2; fill-opacity:1","borderRadius":"10","borderMargin":"10","imageLink":"data:image/png;base64,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","title":"ExtraStorage","titleStyle":"fill: black; font-weight: bold; font-family: Arial;","description":"Create virtual storage \nStore mined/picked items\n","descriptionStyle":"fill: black; font-family: Monospace;","defs":"","generateType":"widecard"};



const monochromeCardBase = normalizeCardOptions({
  ...betterdialogsPreset,
  title: "Project Title",
  description: "Clean • Modern • Minimal\nEssential features overview",
});

const monochromeWideBannerBase = normalizeCardOptions({
  ...extra_voucherPreset,
  title: "Feature Title",
  description: "Key Highlights & Benefits\nQuick Overview Description",
});

const dataStorageBannerBase = normalizeCardOptions({
  ...extra_storagePreset,
  title: "Module Title",
  description: "High performance module\nReliable, secure, and fast",
});

export const CARD_PRESETS: CardPreset[] = [
  {
    id: "monochrome-card",
    name: "Monochrome Standard Card",
    category: "Clean & Minimal",
    description: "High-contrast clean white card with bold black outline & logo",
    options: monochromeCardBase,
  },
  {
    id: "monochrome-wide",
    name: "Monochrome Wide Banner",
    category: "Clean & Minimal",
    description: "Clean white landscape banner with emblem & monospace text",
    options: monochromeWideBannerBase,
  },
  {
    id: "monochrome-storage",
    name: "Monochrome Module Banner",
    category: "Clean & Minimal",
    description: "Clean horizontal card layout designed for modules & features",
    options: dataStorageBannerBase,
  },
];

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: "modern-dark",
    name: "Modern Dark Slate",
    category: "Dark",
    background: {
      type: "solid",
      color: "#0f172a",
      gradientStart: "#0f172a",
      gradientEnd: "#1e1b4b",
      gradientDirection: "to-b",
      opacity: 1,
    },
    border: {
      color: "#334155",
      width: 2,
      style: "solid",
      radius: 16,
      margin: 10,
      shadow: "soft",
    },
    titleFont: {
      color: "#f8fafc",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "800",
    },
    descriptionFont: {
      color: "#94a3b8",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "500",
    },
  },
  {
    id: "sunset-aurora",
    name: "Sunset Aurora Gradient",
    category: "Gradient",
    background: {
      type: "gradient",
      color: "#ea580c",
      gradientStart: "#ea580c",
      gradientMiddle: "#db2777",
      gradientEnd: "#7c3aed",
      gradientDirection: "to-br",
      opacity: 1,
    },
    border: {
      color: "rgba(255, 255, 255, 0.35)",
      width: 2,
      style: "solid",
      radius: 20,
      margin: 10,
      shadow: "soft",
    },
    titleFont: {
      color: "#ffffff",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "800",
    },
    descriptionFont: {
      color: "#fef08a",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "500",
    },
  },
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Neon Glow",
    category: "Vibrant",
    background: {
      type: "solid",
      color: "#090a0f",
      gradientStart: "#090a0f",
      gradientEnd: "#1e1b4b",
      gradientDirection: "to-br",
      opacity: 1,
    },
    border: {
      color: "#06b6d4",
      width: 3,
      style: "solid",
      radius: 14,
      margin: 10,
      shadow: "glow",
      glowColor: "#06b6d4",
    },
    titleFont: {
      color: "#22d3ee",
      fontFamily:
        '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace',
      fontWeight: "900",
      letterSpacing: 1,
    },
    descriptionFont: {
      color: "#f472b6",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "600",
    },
  },
  {
    id: "emerald-forest",
    name: "Emerald Nature",
    category: "Dark",
    background: {
      type: "gradient",
      color: "#022c22",
      gradientStart: "#022c22",
      gradientEnd: "#059669",
      gradientDirection: "to-br",
      opacity: 1,
    },
    border: {
      color: "#10b981",
      width: 2,
      style: "solid",
      radius: 16,
      margin: 10,
      shadow: "soft",
    },
    titleFont: {
      color: "#ecfdf5",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "800",
    },
    descriptionFont: {
      color: "#a7f3d0",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "500",
    },
  },
  {
    id: "ocean-blue",
    name: "Ocean Breeze",
    category: "Gradient",
    background: {
      type: "gradient",
      color: "#0284c7",
      gradientStart: "#0284c7",
      gradientEnd: "#0d9488",
      gradientDirection: "to-r",
      opacity: 1,
    },
    border: {
      color: "rgba(255, 255, 255, 0.4)",
      width: 2,
      style: "solid",
      radius: 18,
      margin: 10,
      shadow: "soft",
    },
    titleFont: {
      color: "#ffffff",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "800",
    },
    descriptionFont: {
      color: "#bae6fd",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "500",
    },
  },
  {
    id: "purple-nebula",
    name: "Purple Cosmic Nebula",
    category: "Gradient",
    background: {
      type: "gradient",
      color: "#3b0764",
      gradientStart: "#3b0764",
      gradientMiddle: "#7c3aed",
      gradientEnd: "#c084fc",
      gradientDirection: "to-br",
      opacity: 1,
    },
    border: {
      color: "rgba(255, 255, 255, 0.3)",
      width: 2,
      style: "solid",
      radius: 18,
      margin: 10,
      shadow: "soft",
    },
    titleFont: {
      color: "#ffffff",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "800",
    },
    descriptionFont: {
      color: "#f3e8ff",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "500",
    },
  },
  {
    id: "monochrome-minimal",
    name: "Monochrome Minimal",
    category: "Minimal",
    background: {
      type: "solid",
      color: "#ffffff",
      gradientStart: "#ffffff",
      gradientEnd: "#f8fafc",
      gradientDirection: "to-b",
      opacity: 1,
    },
    border: {
      color: "#000000",
      width: 2,
      style: "solid",
      radius: 10,
      margin: 10,
      shadow: "none",
    },
    titleFont: {
      color: "#000000",
      fontFamily: "Arial, Helvetica, sans-serif",
      fontWeight: "700",
    },
    descriptionFont: {
      color: "#000000",
      fontFamily: "monospace",
      fontWeight: "500",
    },
  },
  {
    id: "classic-light",
    name: "Clean Light & Blue",
    category: "Minimal",
    background: {
      type: "solid",
      color: "#f8fafc",
      gradientStart: "#f8fafc",
      gradientEnd: "#e2e8f0",
      gradientDirection: "to-b",
      opacity: 1,
    },
    border: {
      color: "#cbd5e1",
      width: 2,
      style: "solid",
      radius: 14,
      margin: 10,
      shadow: "subtle",
    },
    titleFont: {
      color: "#1e3a8a",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "800",
    },
    descriptionFont: {
      color: "#475569",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "500",
    },
  },
  {
    id: "frosted-glass",
    name: "Frosted Glass Minimal",
    category: "Minimal",
    background: {
      type: "glass",
      color: "rgba(255, 255, 255, 0.85)",
      gradientStart: "#ffffff",
      gradientEnd: "#f1f5f9",
      gradientDirection: "to-b",
      opacity: 0.9,
    },
    border: {
      color: "#e2e8f0",
      width: 2,
      style: "solid",
      radius: 20,
      margin: 10,
      shadow: "soft",
    },
    titleFont: {
      color: "#0f172a",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "800",
    },
    descriptionFont: {
      color: "#64748b",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: "500",
    },
  },
];

// Presets alias for backward compatibility
export const PRESETS = PRESET_THEMES;
