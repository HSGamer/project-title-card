import { WidescreenCardOptions } from "../../types.ts";
import { getCardDimensions } from "../../utils/dimensions.ts";
import { createBaseSvg } from "../svg-base.ts";
import {
  renderImage,
  renderMultilineDescription,
  renderTitle,
} from "../elements.ts";

export function generateWidescreen(
  options: WidescreenCardOptions,
): SVGSVGElement {
  const { width, height } = getCardDimensions(options);
  const { draw } = createBaseSvg(width, height, options, "Widescreen Card");

  const imgSize = options.image.size || 240;
  const hasImage = Boolean(options.image.show && options.image.url);

  if (options.layoutStyle === "centered") {
    const smallImg = Math.min(imgSize, 160);
    const imgX = (width - smallImg) / 2;
    const imgY = 40;

    if (hasImage) {
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        smallImg,
        smallImg,
        "wsLogo",
      );
    }

    const titleY = hasImage ? 40 + smallImg + 40 : 160;
    renderTitle(
      draw,
      options.title,
      width / 2,
      titleY,
      options.titleFont,
      "middle",
    );
    const descY = titleY + (options.titleFont.fontSize || 42) + 14;
    renderMultilineDescription(
      draw,
      options.description,
      width / 2,
      descY,
      options.descriptionFont,
      "middle",
    );
  } else if (options.layoutStyle === "banner") {
    if (hasImage) {
      const bannerImgSize = Math.min(imgSize, 220);
      const imgX = width - bannerImgSize - 40;
      const imgY = (height - bannerImgSize) / 2;
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        bannerImgSize,
        bannerImgSize,
        "wsLogo",
      );
    }

    renderTitle(draw, options.title, 45, 140, options.titleFont, "start");
    const descY = 140 + (options.titleFont.fontSize || 42) + 16;
    renderMultilineDescription(
      draw,
      options.description,
      45,
      descY,
      options.descriptionFont,
      "start",
    );
  } else {
    // Split (Default)
    if (hasImage) {
      const imgX = 40;
      const imgY = (height - imgSize) / 2;
      renderImage(
        draw,
        options.image,
        { x: imgX, y: imgY },
        imgSize,
        imgSize,
        "wsLogo",
      );

      const textX = 40 + imgSize + 40;
      renderTitle(draw, options.title, textX, 145, options.titleFont, "start");
      const descY = 145 + (options.titleFont.fontSize || 42) + 16;
      renderMultilineDescription(
        draw,
        options.description,
        textX,
        descY,
        options.descriptionFont,
        "start",
      );
    } else {
      renderTitle(draw, options.title, 50, 150, options.titleFont, "start");
      const descY = 150 + (options.titleFont.fontSize || 42) + 16;
      renderMultilineDescription(
        draw,
        options.description,
        50,
        descY,
        options.descriptionFont,
        "start",
      );
    }
  }

  return draw.node as SVGSVGElement;
}
