import { SVG, Svg } from '@svgdotjs/svg.js';
import { CardOptions, GenerateType } from '../types';
import { getCardDimensions } from './dimensions';

export const defaultOptions: CardOptions = {
  backgroundStyle: 'fill:white; stroke:black; stroke-width:2; fill-opacity:1',
  imageLink: 'https://raw.githubusercontent.com/BetterGUI-MC/MaskedGUI/master/.github/image/logo.svg',
  title: 'MaskedGUI',
  titleStyle: 'fill: black; font-weight: bold; font-family: Verdana;',
  description: 'Description',
  descriptionStyle: 'fill: black; font-family: Verdana;',
  borderRadius: '10',
  borderMargin: '10',
  defs: '',
  generateType: 'card',
  badgeWidth: '400',
  badgeHeight: '120'
};

export const generateTypes: Record<GenerateType, (options: CardOptions) => Promise<SVGSVGElement>> = {
  card: generateCard,
  widecard: generateWidecard,
  widescreen: generateWidescreen,
  badge: generateBadge
};

/**
 * Creates the base SVG canvas with accessible title/desc, defs, and background rectangle.
 */
function createBaseSvg(
  width: number,
  height: number,
  options: CardOptions,
  typeLabel: string,
  includeDesc = true
): { draw: Svg; margin: number; radius: number } {
  const margin = parseFloat(options.borderMargin) || 0;
  const radius = parseFloat(options.borderRadius) || 0;

  const draw: Svg = SVG().size(width, height).viewbox(0, 0, width, height);
  draw.attr({
    xmlns: 'http://www.w3.org/2000/svg',
    role: 'img',
    'aria-label': `${typeLabel}: ${options.title || 'Untitled'}`
  });

  const titleElem = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  titleElem.textContent = options.title ? `${typeLabel}: ${options.title}` : typeLabel;
  draw.node.appendChild(titleElem);

  if (includeDesc && options.description) {
    const descElem = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    descElem.textContent = options.description;
    draw.node.appendChild(descElem);
  }

  if (options.defs && options.defs.trim()) {
    const defs = draw.defs();
    defs.node.innerHTML = options.defs;
  }

  const bgWidth = Math.max(0, width - 2 * margin);
  const bgHeight = Math.max(0, height - 2 * margin);
  const rect = draw.rect(bgWidth, bgHeight).move(margin, margin).radius(radius);

  if (options.backgroundStyle) {
    rect.attr('style', options.backgroundStyle);
  }

  return { draw, margin, radius };
}

/**
 * Renders an embedded image element on the SVG canvas.
 */
function renderImage(
  draw: Svg,
  imageLink: string,
  size: { width: number; height: number },
  pos: { x: number; y: number },
  label = 'Card Logo/Image'
) {
  if (!imageLink) return;
  const img = draw.image(imageLink).size(size.width, size.height).move(pos.x, pos.y);
  img.attr({
    href: imageLink,
    role: 'img',
    'aria-label': label
  });
}

/**
 * Renders a single-line title text element on the SVG canvas.
 */
function renderTitle(
  draw: Svg,
  titleText: string,
  x: number,
  y: number,
  fontSize: number,
  anchor: string,
  style?: string
) {
  const title = draw
    .text(titleText || '')
    .font({ size: fontSize })
    .attr({
      x,
      y,
      'text-anchor': anchor
    });

  if (style) {
    title.attr('style', style);
  }
}

/**
 * Renders a multi-line description text element with auto-wrapped <tspan> rows.
 */
function renderMultilineText(
  draw: Svg,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  lineSpacing: string,
  anchor: string,
  style?: string
) {
  const lines = (text || '').split('\n');
  const description = draw
    .text((add) => {
      lines.forEach((line, index) => {
        const tspan = add.tspan(line);
        tspan.attr({
          x,
          dy: index === 0 ? '0em' : lineSpacing
        });
      });
    })
    .font({ size: fontSize })
    .attr({
      x,
      y,
      'text-anchor': anchor
    });

  if (style) {
    description.attr('style', style);
  }
}

export async function generateCard(options: CardOptions): Promise<SVGSVGElement> {
  const { width, height } = getCardDimensions(options);
  const { draw } = createBaseSvg(width, height, options, 'Title Card');

  renderImage(draw, options.imageLink, { width: 300, height: 300 }, { x: 50, y: 50 });
  renderTitle(draw, options.title, 200, 400, 35, 'middle', options.titleStyle);
  renderMultilineText(draw, options.description, 200, 450, 25, '1.2em', 'middle', options.descriptionStyle);

  return draw.node as SVGSVGElement;
}

export async function generateWidecard(options: CardOptions): Promise<SVGSVGElement> {
  const { width, height } = getCardDimensions(options);
  const { draw } = createBaseSvg(width, height, options, 'Wide Banner Card');

  renderImage(draw, options.imageLink, { width: 260, height: 260 }, { x: 20, y: 20 });
  renderTitle(draw, options.title, 300, 90, 50, 'start', options.titleStyle);
  renderMultilineText(draw, options.description, 300, 140, 30, '1.2em', 'start', options.descriptionStyle);

  return draw.node as SVGSVGElement;
}

export async function generateWidescreen(options: CardOptions): Promise<SVGSVGElement> {
  const { width, height } = getCardDimensions(options);
  const { draw } = createBaseSvg(width, height, options, 'Widescreen Card');

  renderImage(draw, options.imageLink, { width: 260, height: 260 }, { x: 35, y: 72.5 });
  renderTitle(draw, options.title, 330, 135, 44, 'start', options.titleStyle);
  renderMultilineText(draw, options.description, 330, 195, 26, '1.25em', 'start', options.descriptionStyle);

  return draw.node as SVGSVGElement;
}

export async function generateBadge(options: CardOptions): Promise<SVGSVGElement> {
  const { width, height } = getCardDimensions(options);
  const { draw, margin } = createBaseSvg(width, height, options, 'Badge', false);

  const hasImage = Boolean(options.imageLink && options.imageLink.trim());
  const imgPadding = Math.max(8, height * 0.15);
  const imgSize = Math.max(16, height - 2 * margin - 2 * imgPadding);
  const imgX = margin + imgPadding;
  const imgY = (height - imgSize) / 2;

  if (hasImage) {
    renderImage(draw, options.imageLink, { width: imgSize, height: imgSize }, { x: imgX, y: imgY }, 'Badge Logo/Icon');
  }

  const baseFontSize = Math.min(Math.max(16, height * 0.3), 60);
  const textX = hasImage ? imgX + imgSize + Math.max(12, height * 0.12) : width / 2;
  const textY = height / 2 + baseFontSize * 0.35;
  const textAnchor = hasImage ? 'start' : 'middle';

  renderTitle(draw, options.title, textX, textY, baseFontSize, textAnchor, options.titleStyle);

  return draw.node as SVGSVGElement;
}

export async function generateSVG(options: CardOptions): Promise<SVGSVGElement> {
  const handler = generateTypes[options.generateType] || generateTypes.card;
  return await handler(options);
}
