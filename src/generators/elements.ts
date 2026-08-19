import { Svg } from '@svgdotjs/svg.js';
import { CardOptions, DescriptionFontConfig } from '../types.ts';

/**
 * Renders an image element with shape clipping (circle/rounded/original)
 */
export function renderImage(
  draw: Svg,
  imageConfig: CardOptions['image'],
  pos: { x: number; y: number },
  width: number,
  height: number,
  clipIdPrefix = 'logoClip'
): void {
  if (!imageConfig.show || !imageConfig.url) return;

  const defs = draw.defs();
  const img = draw.image(imageConfig.url).size(width, height).move(pos.x, pos.y);
  img.attr({
    role: 'img',
    'aria-label': 'Card Logo/Image'
  });

  if (imageConfig.shape === 'circle') {
    const clipId = `${clipIdPrefix}_circle_${Math.floor(pos.x)}_${Math.floor(pos.y)}`;
    const clip = defs.element('clipPath').attr('id', clipId);
    const r = Math.min(width, height) / 2;
    clip.element('circle').attr({
      cx: pos.x + width / 2,
      cy: pos.y + height / 2,
      r
    });
    img.attr('clip-path', `url(#${clipId})`);
  } else if (imageConfig.shape === 'rounded') {
    const clipId = `${clipIdPrefix}_rounded_${Math.floor(pos.x)}_${Math.floor(pos.y)}`;
    const clip = defs.element('clipPath').attr('id', clipId);
    clip.element('rect').attr({
      x: pos.x,
      y: pos.y,
      width,
      height,
      rx: Math.min(16, width * 0.1),
      ry: Math.min(16, height * 0.1)
    });
    img.attr('clip-path', `url(#${clipId})`);
  }
}

/**
 * Renders title text with typographic options
 */
export function renderTitle(
  draw: Svg,
  text: string,
  x: number,
  y: number,
  fontConfig: CardOptions['titleFont'],
  anchor: 'start' | 'middle' | 'end' = 'middle'
): void {
  const displayText = fontConfig.uppercase ? (text || '').toUpperCase() : (text || '');
  const title = draw
    .text(displayText)
    .font({
      size: fontConfig.fontSize || 34,
      family: fontConfig.fontFamily || 'sans-serif',
      weight: fontConfig.fontWeight || '800'
    })
    .attr({
      x,
      y,
      fill: fontConfig.color || '#ffffff',
      'text-anchor': anchor
    });

  if (fontConfig.letterSpacing) {
    title.attr('letter-spacing', `${fontConfig.letterSpacing}px`);
  }
}

/**
 * Renders multi-line description text with typography options
 */
export function renderMultilineDescription(
  draw: Svg,
  text: string,
  x: number,
  y: number,
  fontConfig: DescriptionFontConfig,
  anchor: 'start' | 'middle' | 'end' = 'middle'
): void {
  const lines = (text || '').split('\n');
  const lineSpacing = `${fontConfig.lineHeight || 1.3}em`;

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
    .font({
      size: fontConfig.fontSize || 22,
      family: fontConfig.fontFamily || 'sans-serif',
      weight: fontConfig.fontWeight || '500'
    })
    .attr({
      x,
      y,
      fill: fontConfig.color || '#94a3b8',
      'text-anchor': anchor
    });

  if (fontConfig.opacity !== undefined && fontConfig.opacity < 1) {
    description.attr('fill-opacity', fontConfig.opacity);
  }
}
