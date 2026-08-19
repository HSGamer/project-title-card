import { CardOptions } from '../types.ts';
import { generateSVG } from '../generators/index.ts';
import { resolveImageLink } from './image.ts';
import { normalizeCardOptions } from './normalizer.ts';

/**
 * Resolves both logo image and background image links into inline data URLs before exporting
 */
async function resolveAllImages(options: CardOptions): Promise<CardOptions> {
  const resolvedLogoUrl = await resolveImageLink(options.image.url);

  let resolvedBgUrl = options.background.imageUrl;
  if (options.background.type === 'image' && options.background.imageUrl) {
    resolvedBgUrl = await resolveImageLink(options.background.imageUrl);
  }

  return {
    ...options,
    image: {
      ...options.image,
      url: resolvedLogoUrl
    },
    background: {
      ...options.background,
      imageUrl: resolvedBgUrl
    }
  } as CardOptions;
}

export async function downloadSVG(options: CardOptions, filename = 'card.svg'): Promise<void> {
  const optionsWithResolvedImages = await resolveAllImages(options);
  const svg = generateSVG(optionsWithResolvedImages);
  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadPNG(
  options: CardOptions,
  resizePercentage: number,
  filename = 'card.png'
): Promise<void> {
  if (isNaN(resizePercentage) || resizePercentage < 1 || resizePercentage > 200) {
    throw new Error('Invalid resize percentage');
  }

  const optionsWithResolvedImages = await resolveAllImages(options);
  const svg = generateSVG(optionsWithResolvedImages);
  const svgData = new XMLSerializer().serializeToString(svg);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain canvas 2D context');

  const img = new Image();
  const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
  img.src = `data:image/svg+xml;base64,${svgBase64}`;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      canvas.width = (img.width * resizePercentage) / 100;
      canvas.height = (img.height * resizePercentage) / 100;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      resolve();
    };
    img.onerror = (err) => reject(err);
  });
}

export function exportOptions(options: CardOptions, filename = 'card-options.json'): void {
  const blob = new Blob([JSON.stringify(options, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function importOptions(file: File): Promise<CardOptions> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON format: root must be an object');
        }
        const normalized = normalizeCardOptions(parsed);
        resolve(normalized);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}
