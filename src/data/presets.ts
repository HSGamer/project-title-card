import {
  BackgroundConfig,
  BorderConfig,
  TitleFontConfig,
  DescriptionFontConfig,
  ImageConfig
} from '../types.ts';

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

export const PRESET_THEMES: PresetTheme[] = [
  {
    id: 'modern-dark',
    name: 'Modern Dark Slate',
    category: 'Dark',
    background: {
      type: 'solid',
      color: '#0f172a',
      gradientStart: '#0f172a',
      gradientEnd: '#1e293b',
      gradientDirection: 'to-b',
      opacity: 1
    },
    border: {
      color: '#334155',
      width: 2,
      style: 'solid',
      radius: 16,
      margin: 10,
      shadow: 'soft'
    },
    titleFont: {
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '800'
    },
    descriptionFont: {
      color: '#94a3b8',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '500'
    }
  },
  {
    id: 'sunset-aurora',
    name: 'Sunset Aurora Gradient',
    category: 'Gradient',
    background: {
      type: 'gradient',
      color: '#ea580c',
      gradientStart: '#ea580c',
      gradientMiddle: '#db2777',
      gradientEnd: '#7c3aed',
      gradientDirection: 'to-br',
      opacity: 1
    },
    border: {
      color: 'rgba(255, 255, 255, 0.35)',
      width: 2,
      style: 'solid',
      radius: 20,
      margin: 10,
      shadow: 'soft'
    },
    titleFont: {
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '800'
    },
    descriptionFont: {
      color: '#fef08a',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '500'
    }
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon Glow',
    category: 'Vibrant',
    background: {
      type: 'solid',
      color: '#090a0f',
      gradientStart: '#090a0f',
      gradientEnd: '#1e1b4b',
      gradientDirection: 'to-br',
      opacity: 1
    },
    border: {
      color: '#06b6d4',
      width: 3,
      style: 'solid',
      radius: 14,
      margin: 10,
      shadow: 'glow',
      glowColor: '#06b6d4'
    },
    titleFont: {
      color: '#22d3ee',
      fontFamily: '"JetBrains Mono", "Fira Code", Menlo, Monaco, Consolas, monospace',
      fontWeight: '900',
      letterSpacing: 1
    },
    descriptionFont: {
      color: '#f472b6',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '600'
    }
  },
  {
    id: 'emerald-forest',
    name: 'Emerald Nature',
    category: 'Dark',
    background: {
      type: 'gradient',
      color: '#022c22',
      gradientStart: '#022c22',
      gradientEnd: '#059669',
      gradientDirection: 'to-br',
      opacity: 1
    },
    border: {
      color: '#10b981',
      width: 2,
      style: 'solid',
      radius: 16,
      margin: 10,
      shadow: 'soft'
    },
    titleFont: {
      color: '#ecfdf5',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '800'
    },
    descriptionFont: {
      color: '#a7f3d0',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '500'
    }
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Breeze',
    category: 'Gradient',
    background: {
      type: 'gradient',
      color: '#0284c7',
      gradientStart: '#0284c7',
      gradientEnd: '#0d9488',
      gradientDirection: 'to-r',
      opacity: 1
    },
    border: {
      color: 'rgba(255, 255, 255, 0.4)',
      width: 2,
      style: 'solid',
      radius: 18,
      margin: 10,
      shadow: 'soft'
    },
    titleFont: {
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '800'
    },
    descriptionFont: {
      color: '#bae6fd',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '500'
    }
  },
  {
    id: 'purple-nebula',
    name: 'Purple Cosmic Nebula',
    category: 'Gradient',
    background: {
      type: 'gradient',
      color: '#3b0764',
      gradientStart: '#3b0764',
      gradientMiddle: '#7c3aed',
      gradientEnd: '#c084fc',
      gradientDirection: 'to-br',
      opacity: 1
    },
    border: {
      color: 'rgba(255, 255, 255, 0.3)',
      width: 2,
      style: 'solid',
      radius: 18,
      margin: 10,
      shadow: 'soft'
    },
    titleFont: {
      color: '#ffffff',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '800'
    },
    descriptionFont: {
      color: '#f3e8ff',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '500'
    }
  },
  {
    id: 'classic-light',
    name: 'Clean Light & Blue',
    category: 'Minimal',
    background: {
      type: 'solid',
      color: '#f8fafc',
      gradientStart: '#f8fafc',
      gradientEnd: '#e2e8f0',
      gradientDirection: 'to-b',
      opacity: 1
    },
    border: {
      color: '#cbd5e1',
      width: 2,
      style: 'solid',
      radius: 14,
      margin: 10,
      shadow: 'subtle'
    },
    titleFont: {
      color: '#1e3a8a',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '800'
    },
    descriptionFont: {
      color: '#475569',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '500'
    }
  },
  {
    id: 'frosted-glass',
    name: 'Frosted Glass Minimal',
    category: 'Minimal',
    background: {
      type: 'glass',
      color: 'rgba(255, 255, 255, 0.85)',
      gradientStart: '#ffffff',
      gradientEnd: '#f1f5f9',
      gradientDirection: 'to-b',
      opacity: 0.9
    },
    border: {
      color: '#e2e8f0',
      width: 2,
      style: 'solid',
      radius: 20,
      margin: 10,
      shadow: 'soft'
    },
    titleFont: {
      color: '#0f172a',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '800'
    },
    descriptionFont: {
      color: '#64748b',
      fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontWeight: '500'
    }
  }
];

// Presets alias for menu
export const PRESETS = PRESET_THEMES;
