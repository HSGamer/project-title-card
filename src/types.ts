export type GenerateType = 'card' | 'widecard' | 'widescreen' | 'badge';

export interface CardOptions {
  backgroundStyle: string;
  imageLink: string;
  title: string;
  titleStyle: string;
  description: string;
  descriptionStyle: string;
  borderRadius: string;
  borderMargin: string;
  defs: string;
  generateType: GenerateType;
  badgeWidth?: string;
  badgeHeight?: string;
}
