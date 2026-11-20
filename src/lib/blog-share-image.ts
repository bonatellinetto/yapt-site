import type { BlogPost } from './blog';
import { getPostLocale } from './blog-seo';
import { getSocialImage, type SocialImage } from './social-images';

/** Preserve the full article cover inside a horizontal, broadly supported social image. */
export async function blogShareImage(post: BlogPost): Promise<SocialImage> {
  const source = post.og_image_url || post.cover_image_url;
  if (!source) return getSocialImage('/', getPostLocale(post));
  return { url: `/social/articles/${encodeURIComponent(post.slug)}.jpg`, width: 1200, height: 630, type: 'image/jpeg', alt: post.title };
}
