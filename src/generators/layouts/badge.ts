import { BadgeCardOptions } from '../../types.ts';
import { getCardDimensions } from '../../utils/dimensions.ts';
import { createBaseSvg } from '../svg-base.ts';
import { renderImage, renderTitle } from '../elements.ts';

export function generateBadge(options: BadgeCardOptions): SVGSVGElement {
  const { width, height } = getCardDimensions(options);
  const { draw, margin } = createBaseSvg(width, height, options, 'Badge Card', false);

  const hasImage = Boolean(options.image.show && options.image.url && options.iconPosition !== 'none');
  const imgSize = Math.max(16, Math.min(options.image.size || 70, height - 2 * margin - 16));
  const imgY = (height - imgSize) / 2;

  const titleFontSize = options.titleFont.fontSize || Math.min(Math.max(16, height * 0.35), 48);
  const titleY = height / 2 + titleFontSize * 0.35;

  if (hasImage) {
    if (options.iconPosition === 'right') {
      const imgX = width - margin - 12 - imgSize;
      renderImage(draw, options.image, { x: imgX, y: imgY }, imgSize, imgSize, 'badgeLogo');

      const textX = margin + 18;
      renderTitle(
        draw,
        options.title,
        textX,
        titleY,
        { ...options.titleFont, fontSize: titleFontSize },
        'start'
      );
    } else {
      const imgX = margin + 12;
      renderImage(draw, options.image, { x: imgX, y: imgY }, imgSize, imgSize, 'badgeLogo');

      const textX = imgX + imgSize + 14;
      renderTitle(
        draw,
        options.title,
        textX,
        titleY,
        { ...options.titleFont, fontSize: titleFontSize },
        'start'
      );
    }
  } else {
    renderTitle(
      draw,
      options.title,
      width / 2,
      titleY,
      { ...options.titleFont, fontSize: titleFontSize },
      'middle'
    );
  }

  return draw.node as SVGSVGElement;
}
