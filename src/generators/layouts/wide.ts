import { WideCardOptions } from '../../types.ts';
import { getCardDimensions } from '../../utils/dimensions.ts';
import { createBaseSvg } from '../svg-base.ts';
import { renderImage, renderTitle, renderMultilineDescription } from '../elements.ts';

export function generateWidecard(options: WideCardOptions): SVGSVGElement {
  const { width, height } = getCardDimensions(options);
  const { draw } = createBaseSvg(width, height, options, 'Wide Banner Card');

  const imgSize = options.image.size || 220;
  const hasImage = Boolean(options.image.show && options.image.url);

  if (options.imagePosition === 'right') {
    if (hasImage) {
      const imgX = width - imgSize - 35;
      const imgY = (height - imgSize) / 2;
      renderImage(draw, options.image, { x: imgX, y: imgY }, imgSize, imgSize, 'wideLogo');
    }
    renderTitle(draw, options.title, 45, 100, options.titleFont, 'start');
    const descY = 100 + (options.titleFont.fontSize || 44) + 14;
    renderMultilineDescription(draw, options.description, 45, descY, options.descriptionFont, 'start');
  } else {
    // Left (default)
    if (hasImage) {
      const imgX = 35;
      const imgY = (height - imgSize) / 2;
      renderImage(draw, options.image, { x: imgX, y: imgY }, imgSize, imgSize, 'wideLogo');

      const textX = 35 + imgSize + 35;
      renderTitle(draw, options.title, textX, 100, options.titleFont, 'start');
      const descY = 100 + (options.titleFont.fontSize || 44) + 14;
      renderMultilineDescription(draw, options.description, textX, descY, options.descriptionFont, 'start');
    } else {
      renderTitle(draw, options.title, 50, 110, options.titleFont, 'start');
      const descY = 110 + (options.titleFont.fontSize || 44) + 16;
      renderMultilineDescription(draw, options.description, 50, descY, options.descriptionFont, 'start');
    }
  }

  return draw.node as SVGSVGElement;
}
