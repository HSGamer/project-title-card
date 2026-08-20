import {
  BadgeCardOptions,
  CardOptions,
  StandardCardOptions,
  WideCardOptions,
  WidescreenCardOptions,
} from "../types.ts";

export const defaultStandardOptions: StandardCardOptions = {
  generateType: "card",
  cardVariant: "standard",
  title: "MaskedGUI",
  description: "Fast • Lightweight • Type-Safe\nZero Dependencies",
  textAlign: "center",
  verticalAlign: "middle",
  verticalOffset: 0,
  horizontalOffset: 0,
  image: {
    url:
      "https://raw.githubusercontent.com/BetterGUI-MC/MaskedGUI/master/.github/image/logo.svg",
    shape: "rounded",
    size: 220,
    show: true,
    verticalAlign: "middle",
    verticalOffset: 0,
    horizontalOffset: 0,
  },
  background: {
    type: "solid",
    color: "#0f172a",
    gradientStart: "#ea580c",
    gradientEnd: "#7c3aed",
    gradientDirection: "to-br",
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
    fontSize: 34,
    letterSpacing: 0,
    uppercase: false,
  },
  descriptionFont: {
    color: "#94a3b8",
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: "500",
    fontSize: 20,
    lineHeight: 1.3,
    opacity: 1,
  },
};

export const defaultWideOptions: WideCardOptions = {
  generateType: "widecard",
  wideVariant: "standard",
  title: "MaskedGUI",
  description:
    "A modern, high-performance inventory GUI library for developers",
  imagePosition: "left",
  verticalAlign: "middle",
  verticalOffset: 0,
  horizontalOffset: 0,
  image: {
    url:
      "https://raw.githubusercontent.com/BetterGUI-MC/MaskedGUI/master/.github/image/logo.svg",
    shape: "rounded",
    size: 170,
    show: true,
    verticalAlign: "middle",
    verticalOffset: 0,
    horizontalOffset: 0,
  },
  background: {
    type: "solid",
    color: "#0f172a",
    gradientStart: "#ea580c",
    gradientEnd: "#7c3aed",
    gradientDirection: "to-br",
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
    fontSize: 42,
    letterSpacing: 0,
    uppercase: false,
  },
  descriptionFont: {
    color: "#94a3b8",
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: "500",
    fontSize: 22,
    lineHeight: 1.3,
    opacity: 1,
  },
};

export const defaultWidescreenOptions: WidescreenCardOptions = {
  generateType: "widescreen",
  bannerVariant: "split",
  title: "MaskedGUI",
  description:
    "Fast • Lightweight • Type-Safe\nZero Dependency Inventory UI Framework",
  layoutStyle: "split",
  verticalAlign: "middle",
  verticalOffset: 0,
  horizontalOffset: 0,
  image: {
    url:
      "https://raw.githubusercontent.com/BetterGUI-MC/MaskedGUI/master/.github/image/logo.svg",
    shape: "rounded",
    size: 200,
    show: true,
    verticalAlign: "middle",
    verticalOffset: 0,
    horizontalOffset: 0,
  },
  background: {
    type: "solid",
    color: "#0f172a",
    gradientStart: "#ea580c",
    gradientEnd: "#7c3aed",
    gradientDirection: "to-br",
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
    fontSize: 40,
    letterSpacing: 0,
    uppercase: false,
  },
  descriptionFont: {
    color: "#94a3b8",
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: "500",
    fontSize: 22,
    lineHeight: 1.3,
    opacity: 1,
  },
};

export const defaultBadgeOptions: BadgeCardOptions = {
  generateType: "badge",
  badgeVariant: "standard",
  title: "MaskedGUI",
  badgeWidth: 400,
  badgeHeight: 120,
  badgeAutoSize: false,
  iconPosition: "left",
  badgeLabel: "BUILD",
  labelBackground: "#1e293b",
  labelColor: "#94a3b8",
  splitPosition: 0,
  statusText: "OPERATIONAL",
  statusColor: "#10b981",
  statusStyle: "pill",
  statusPosition: "right",
  verticalAlign: "middle",
  verticalOffset: 0,
  horizontalOffset: 0,
  image: {
    url:
      "https://raw.githubusercontent.com/BetterGUI-MC/MaskedGUI/master/.github/image/logo.svg",
    shape: "rounded",
    size: 70,
    show: true,
    verticalAlign: "middle",
    verticalOffset: 0,
    horizontalOffset: 0,
  },
  background: {
    type: "solid",
    color: "#0f172a",
    gradientStart: "#ea580c",
    gradientEnd: "#7c3aed",
    gradientDirection: "to-br",
    opacity: 1,
  },
  border: {
    color: "#334155",
    width: 2,
    style: "solid",
    radius: 14,
    margin: 8,
    shadow: "soft",
  },
  titleFont: {
    color: "#f8fafc",
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: "800",
    fontSize: 32,
    letterSpacing: 0,
    uppercase: false,
  },
};

export const defaultOptions: CardOptions = defaultStandardOptions;
