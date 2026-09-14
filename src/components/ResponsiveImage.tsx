import type { ImgHTMLAttributes } from 'react';
import { responsiveImages } from '../content/responsive-images';

export const heroImageSizes = '(max-width: 600px) calc(100vw - 52px), (max-width: 1000px) min(72vw, 544px), min(39vw, 544px)';
export const portraitImageSizes = '(max-width: 720px) calc(100vw - 40px), (max-width: 1504px) 31vw, 460px';
export const portraitSourceSizes = '(max-width: 720px) calc((100vw - 40px) * 1.27), (max-width: 1504px) 39vw, 584px';
export const wideImageSizes = '(max-width: 1504px) 96vw, 1440px';

// The approved source remains the fallback and full-size editorial reference.
// Picture sources let the browser select format and DPR without downloading both.
export default function ResponsiveImage({ src, sizes, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const image = responsiveImages[src ?? ''];
  if (!image) return <img src={src} sizes={sizes} {...props} />;
  return <>
    {props.fetchPriority === 'high' && <link rel="preload" as="image" type="image/avif" imageSrcSet={image.avif} imageSizes={sizes} fetchPriority="high" />}
    <picture className="responsive-picture">
      <source type="image/avif" srcSet={image.avif} sizes={sizes} />
      <source type="image/webp" srcSet={image.webp} sizes={sizes} />
      <img src={src} sizes={sizes} {...props} />
    </picture>
  </>;
}
