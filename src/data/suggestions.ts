export interface SuggestionChip {
  label: string;
  value: string;
  description?: string;
  defsSnippet?: string; // Automatically injects needed defs if needed
}

export const TITLE_SUGGESTIONS: SuggestionChip[] = [
  { label: 'MaskedGUI', value: 'MaskedGUI' },
  { label: 'Project Name', value: 'Awesome Project' },
  { label: 'TypeScript SDK', value: 'TypeScript SDK' },
  { label: 'Title Card', value: 'Title Card Generator' }
];

export const DESCRIPTION_SUGGESTIONS: SuggestionChip[] = [
  {
    label: 'Feature Highlights',
    value: 'Fast • Lightweight • Type-Safe\nZero Dependencies'
  },
  {
    label: 'Library Summary',
    value: 'A modern toolkit for\ndevelopers and creators'
  },
  {
    label: 'Classic MaskedGUI',
    value: 'A simple & powerful\nInventory GUI Library'
  }
];

export const BACKGROUND_STYLE_SUGGESTIONS: SuggestionChip[] = [
  {
    label: 'Clean White',
    value: 'fill: #ffffff; stroke: #e2e8f0; stroke-width: 2;',
    description: 'Minimalist white card with subtle light gray border'
  },
  {
    label: 'Dark Slate',
    value: 'fill: #0f172a; stroke: #334155; stroke-width: 2;',
    description: 'Modern dark slate theme with medium gray stroke'
  },
  {
    label: 'Sunset Gradient',
    value: 'fill: url(#sunsetGrad); stroke: rgba(255,255,255,0.4); stroke-width: 2;',
    description: 'Vibrant orange to purple gradient (requires sunsetGrad in Defs)',
    defsSnippet:
      '<linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">\n  <stop offset="0%" stop-color="#ea580c"/>\n  <stop offset="50%" stop-color="#db2777"/>\n  <stop offset="100%" stop-color="#7c3aed"/>\n</linearGradient>'
  },
  {
    label: 'Ocean Blue Gradient',
    value: 'fill: url(#oceanGrad); stroke: rgba(255,255,255,0.3); stroke-width: 2;',
    description: 'Deep blue to cyan gradient',
    defsSnippet:
      '<linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">\n  <stop offset="0%" stop-color="#0284c7"/>\n  <stop offset="100%" stop-color="#0d9488"/>\n</linearGradient>'
  },
  {
    label: 'Cyberpunk Black',
    value: 'fill: #090a0f; stroke: #06b6d4; stroke-width: 3;',
    description: 'Dark background with neon cyan border'
  },
  {
    label: 'Emerald Forest',
    value: 'fill: #022c22; stroke: #10b981; stroke-width: 2;',
    description: 'Deep green card with emerald border'
  }
];

export const TITLE_STYLE_SUGGESTIONS: SuggestionChip[] = [
  {
    label: 'Dark Sans Bold',
    value: 'fill: #0f172a; font-weight: 800; font-family: system-ui, sans-serif;'
  },
  {
    label: 'White Sans Bold',
    value: 'fill: #ffffff; font-weight: 800; font-family: system-ui, sans-serif;'
  },
  {
    label: 'Neon Cyan',
    value: 'fill: #22d3ee; font-weight: 900; font-family: system-ui, sans-serif; letter-spacing: 1px;'
  },
  {
    label: 'Classic Serif',
    value: 'fill: #1e293b; font-weight: bold; font-family: Georgia, serif;'
  }
];

export const DESCRIPTION_STYLE_SUGGESTIONS: SuggestionChip[] = [
  {
    label: 'Slate Medium',
    value: 'fill: #64748b; font-weight: 500; font-family: system-ui, sans-serif;'
  },
  {
    label: 'Muted Light Gray',
    value: 'fill: #94a3b8; font-weight: 500; font-family: system-ui, sans-serif;'
  },
  {
    label: 'Golden Yellow',
    value: 'fill: #fef08a; font-weight: 600; font-family: system-ui, sans-serif;'
  },
  {
    label: 'Neon Pink',
    value: 'fill: #f472b6; font-weight: 600; font-family: system-ui, sans-serif;'
  }
];

export const LOGO_SUGGESTIONS: SuggestionChip[] = [
  {
    label: 'MaskedGUI',
    value: 'https://raw.githubusercontent.com/BetterGUI-MC/MaskedGUI/master/.github/image/logo.svg'
  },
  {
    label: 'React',
    value: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png'
  },
  {
    label: 'TypeScript',
    value: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png'
  },
  {
    label: 'Node.js',
    value: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png'
  }
];

export const FIELD_GUIDES = {
  title: {
    title: 'Card Title Guide',
    content:
      'The primary title displayed on the card. Rendered as a <text> element. In standard card (400×600), it is centered at x:200, y:400. In wide banner (800×300), it starts at x:300, y:90.'
  },
  description: {
    title: 'Card Description Guide',
    content:
      'Multi-line description text. Each line separated by Enter is automatically wrapped into its own <tspan> element with vertical line offset (dy="1.2em").'
  },
  generateType: {
    title: 'Card Layout Guide',
    content:
      '• Standard Card: 400 × 600 px (4:6 portrait). Best for repository cards, showcase logos, and vertical tiles.\n• Wide Card: 800 × 300 px (8:3 banner). Best for README headers, GitHub profile banners, and horizontal highlights.\n• Widescreen Card: 720 × 405 px (16:9 widescreen). Perfect for video thumbnails, slide presentations, and social previews.\n• Compact Badge: 400 × 120 px. Minimalist pill/card displaying only the Logo/Icon and Title (description is excluded).'
  },
  backgroundStyle: {
    title: 'Background Style Guide',
    content:
      'CSS styling for the SVG <rect> background. Supports:\n• fill: color (hex, rgb, or url(#gradientId))\n• stroke: border color\n• stroke-width: border thickness in pixels\n• fill-opacity / stroke-opacity: 0 to 1'
  },
  borderRadius: {
    title: 'Border Radius Guide',
    content:
      'Controls the rounded corners of the card background rectangle using rx and ry attributes (in pixels). Set to 0 for sharp corners, 12-16 for modern rounded, or 24+ for pill/card curves.'
  },
  borderMargin: {
    title: 'Border Margin Guide',
    content:
      'Outer margin spacing (in pixels) between the card boundary and the inner background rectangle. Increases breathing room around the card perimeter.'
  },
  imageLink: {
    title: 'Card Image / Logo Guide',
    content:
      'URL of the logo/image or uploaded local file (converted to base64 Data URL). Images are automatically embedded into the standalone SVG download.'
  },
  titleStyle: {
    title: 'Title Styling Guide',
    content:
      'CSS font and fill properties for the title. Supported: fill (text color), font-family, font-weight (400, 600, 800), font-size, letter-spacing.'
  },
  descriptionStyle: {
    title: 'Description Styling Guide',
    content:
      'CSS styling for description lines. Adjust fill color, font-family, font-weight, and opacity to complement your card title and background.'
  },
  defs: {
    title: 'SVG <defs> Guide',
    content:
      'Define reusable SVG gradients (<linearGradient>, <radialGradient>), filter effects (<filter id="glow">), or clip paths. Once defined, reference them in backgroundStyle using url(#id).'
  },
  badgeWidth: {
    title: 'Badge Width Guide',
    content:
      'Custom width in pixels for Badge mode (100 to 1000 px). The SVG viewBox and layout automatically adapt to the specified width.'
  },
  badgeHeight: {
    title: 'Badge Height Guide',
    content:
      'Custom height in pixels for Badge mode (40 to 400 px). Logo icon and typography automatically scale and center vertically to fit.'
  }
};
