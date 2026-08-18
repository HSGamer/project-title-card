import { CardOptions } from '../types';

export interface CardDimensions {
  width: number;
  height: number;
}

export function getCardDimensions(options: CardOptions): CardDimensions {
  switch (options.generateType) {
    case 'widecard':
      return { width: 800, height: 300 };
    case 'widescreen':
      return { width: 720, height: 405 };
    case 'badge': {
      const width = Math.max(100, Math.min(2000, parseFloat(options.badgeWidth || '400') || 400));
      const height = Math.max(40, Math.min(1000, parseFloat(options.badgeHeight || '120') || 120));
      return { width, height };
    }
    case 'card':
    default:
      return { width: 400, height: 600 };
  }
}

export function getCardDimensionsLabel(options: CardOptions): string {
  const { width, height } = getCardDimensions(options);
  return `${width} × ${height} px`;
}
