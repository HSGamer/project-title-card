import { CardOptions, GenerateType } from '../types';
import { defaultOptions, generateSVG } from './generate';
import { resolveImageLink } from './image';

export function normalizeCardOptions(raw: Partial<CardOptions> | Record<string, any>): CardOptions {
  const getStr = (val: any, fallback: string): string => {
    if (val === undefined || val === null) return fallback;
    return String(val);
  };

  let genType: GenerateType = 'card';
  if (
    raw.generateType === 'widecard' ||
    raw.generateType === 'widescreen' ||
    raw.generateType === 'badge' ||
    raw.generateType === 'card'
  ) {
    genType = raw.generateType;
  }

  return {
    backgroundStyle: getStr(raw.backgroundStyle, defaultOptions.backgroundStyle),
    imageLink: getStr(raw.imageLink, defaultOptions.imageLink),
    title: getStr(raw.title, defaultOptions.title),
    titleStyle: getStr(raw.titleStyle, defaultOptions.titleStyle),
    description: getStr(raw.description, defaultOptions.description),
    descriptionStyle: getStr(raw.descriptionStyle, defaultOptions.descriptionStyle),
    borderRadius: getStr(raw.borderRadius, defaultOptions.borderRadius),
    borderMargin: getStr(raw.borderMargin, defaultOptions.borderMargin),
    defs: getStr(raw.defs, defaultOptions.defs),
    generateType: genType,
    badgeWidth: getStr(raw.badgeWidth, defaultOptions.badgeWidth || '400'),
    badgeHeight: getStr(raw.badgeHeight, defaultOptions.badgeHeight || '120')
  };
}

export async function downloadSVG(options: CardOptions, filename = 'card.svg'): Promise<void> {
  const resolvedImage = await resolveImageLink(options.imageLink);
  const optionsWithResolvedImage = { ...options, imageLink: resolvedImage };
  const svg = await generateSVG(optionsWithResolvedImage);
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

  const resolvedImage = await resolveImageLink(options.imageLink);
  const optionsWithResolvedImage = { ...options, imageLink: resolvedImage };
  const svg = await generateSVG(optionsWithResolvedImage);
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

export async function importOptions(file: File): Promise<CardOptions> {
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
