import { CardOptions } from '../types';

export interface Preset {
  id: string;
  name: string;
  category: string;
  options: Partial<CardOptions>;
}

export const PRESETS: Preset[] = [
  {
    id: 'default',
    name: 'Classic Card',
    category: 'Standard',
    options: {
      backgroundStyle: 'fill:white; stroke:black; stroke-width:2; fill-opacity:1',
      titleStyle: 'fill: black; font-weight: bold; font-family: Verdana;',
      descriptionStyle: 'fill: black; font-family: Verdana;',
      borderRadius: '10',
      borderMargin: '10',
      defs: ''
    }
  },
  {
    id: 'dark-slate',
    name: 'Modern Dark Slate',
    category: 'Dark',
    options: {
      backgroundStyle: 'fill: #0f172a; stroke: #334155; stroke-width: 2',
      titleStyle: 'fill: #f8fafc; font-weight: 800; font-family: system-ui, sans-serif;',
      descriptionStyle: 'fill: #94a3b8; font-weight: 500; font-family: system-ui, sans-serif;',
      borderRadius: '16',
      borderMargin: '12',
      defs: ''
    }
  },
  {
    id: 'sunset-gradient',
    name: 'Sunset Aurora Gradient',
    category: 'Gradient',
    options: {
      backgroundStyle: 'fill: url(#sunsetGrad); stroke: rgba(255,255,255,0.4); stroke-width: 2',
      titleStyle: 'fill: #ffffff; font-weight: 800; font-family: system-ui, sans-serif;',
      descriptionStyle: 'fill: #fef08a; font-weight: 500; font-family: system-ui, sans-serif;',
      borderRadius: '20',
      borderMargin: '10',
      defs: '<linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ea580c"/><stop offset="50%" stop-color="#db2777"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient>'
    }
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    category: 'Vibrant',
    options: {
      backgroundStyle: 'fill: #090a0f; stroke: #06b6d4; stroke-width: 3',
      titleStyle: 'fill: #22d3ee; font-weight: 900; font-family: system-ui, sans-serif;',
      descriptionStyle: 'fill: #f472b6; font-weight: 600; font-family: system-ui, sans-serif;',
      borderRadius: '12',
      borderMargin: '10',
      defs: '<filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
    }
  },
  {
    id: 'emerald-forest',
    name: 'Emerald Forest',
    category: 'Dark',
    options: {
      backgroundStyle: 'fill: #022c22; stroke: #10b981; stroke-width: 2',
      titleStyle: 'fill: #ecfdf5; font-weight: 800; font-family: system-ui, sans-serif;',
      descriptionStyle: 'fill: #a7f3d0; font-weight: 500; font-family: system-ui, sans-serif;',
      borderRadius: '16',
      borderMargin: '12',
      defs: ''
    }
  },
  {
    id: 'clean-light',
    name: 'Clean Light & Blue',
    category: 'Minimal',
    options: {
      backgroundStyle: 'fill: #f8fafc; stroke: #cbd5e1; stroke-width: 2',
      titleStyle: 'fill: #1e3a8a; font-weight: 800; font-family: system-ui, sans-serif;',
      descriptionStyle: 'fill: #475569; font-weight: 500; font-family: system-ui, sans-serif;',
      borderRadius: '14',
      borderMargin: '10',
      defs: ''
    }
  }
];

export const QUICK_DEFS_SNIPPETS = [
  {
    name: 'Linear Gradient (Blue to Purple)',
    snippet: '<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">\n  <stop offset="0%" stop-color="#3b82f6"/>\n  <stop offset="100%" stop-color="#9333ea"/>\n</linearGradient>'
  },
  {
    name: 'Linear Gradient (Sunset Orange)',
    snippet: '<linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">\n  <stop offset="0%" stop-color="#ea580c"/>\n  <stop offset="50%" stop-color="#db2777"/>\n  <stop offset="100%" stop-color="#7c3aed"/>\n</linearGradient>'
  },
  {
    name: 'Radial Glow / Dark Vignette',
    snippet: '<radialGradient id="vignette" cx="50%" cy="50%" r="50%">\n  <stop offset="0%" stop-color="#1e293b"/>\n  <stop offset="100%" stop-color="#020617"/>\n</radialGradient>'
  },
  {
    name: 'Glow Filter',
    snippet: '<filter id="glow" x="-20%" y="-20%" width="140%" height="140%">\n  <feGaussianBlur stdDeviation="4" result="blur" />\n  <feMerge>\n    <feMergeNode in="blur" />\n    <feMergeNode in="SourceGraphic" />\n  </feMerge>\n</filter>'
  }
];
