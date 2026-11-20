import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { getAllPublishedPosts } from '../../../lib/blog';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPublishedPosts();
  const covers = new Map<string, string>();
  for (const post of posts) {
    const source = post.og_image_url || post.cover_image_url;
    if (source) covers.set(post.slug, source);
  }
  return [...covers].map(([slug, source]) => ({ params: { slug }, props: { source } }));
};

export const GET: APIRoute = async ({ props }) => {
  const source: unknown = props.source;
  if (typeof source !== 'string' || !source) throw new Error('A capa do artigo não foi informada para a imagem social.');
  const response = await fetch(source, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`Não foi possível carregar a capa do artigo para a imagem social (HTTP ${response.status}).`);
  const input = Buffer.from(await response.arrayBuffer());
  const image = await sharp(input).rotate()
    .resize({ width: 1200, height: 630, fit: 'contain', background: '#edf5ef' })
    .jpeg({ quality: 85 }).toBuffer();
  return new Response(new Uint8Array(image), { headers: { 'Content-Type': 'image/jpeg' } });
};
