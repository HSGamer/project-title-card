import { StandardCardOptions } from '../../types.ts';
import { getCardDimensions } from '../../utils/dimensions.ts';
import { createBaseSvg } from '../svg-base.ts';
import { renderImage, renderTitle, renderMultilineDescription } from '../elements.ts';

export function generateCard(options: StandardCardOptions): SVGSVGElement {
  const { width, height } = getCardDimensions(options);
  const { draw } = createBaseSvg(width, height, options, 'Standard Title Card');

  const imgSize = options.image.size || 260;
  const hasImage = Boolean(options.image.show && options.image.url);

  if (options.textAlign === 'left') {
    if (hasImage) {
      renderImage(draw, options.image, { x: 40, y: 45 }, imgSize, imgSize, 'cardLogo');
    }
    const titleY = hasImage ? 45 + imgSize + 45 : 180;
    renderTitle(draw, options.title, 40, titleY, options.titleFont, 'start');
    const descY = titleY + (options.titleFont.fontSize || 34) + 16;
    renderMultilineDescription(draw, options.description, 40, descY, options.descriptionFont, 'start');
  } else {
    // Center (default)
    const imgX = (width - imgSize) / 2;
    const imgY = 50;
    if (hasImage) {
      renderImage(draw, options.image, { x: imgX, y: imgY }, imgSize, imgSize, 'cardLogo');
    }
    const titleY = hasImage ? 50 + imgSize + 45 : 220;
    renderTitle(draw, options.title, width / 2, titleY, options.titleFont, 'middle');
    const descY = titleY + (options.titleFont.fontSize || 34) + 15;
    renderMultilineDescription(draw, options.description, width / 2, descY, options.descriptionFont, 'middle');
  }

  return draw.node as SVGSVGElement;
}
