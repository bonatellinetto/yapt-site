import { supabase } from './supabase';

export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  name_en: string | null;
  name_es: string | null;
  description: string | null;
  color: string;
  position: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  content_html: string | null;
  cover_image_url: string | null;
  card_image_url: string | null;
  category_id: string | null;
  tags: string[];
  author_name: string;
  author_avatar: string | null;
  author_role: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  published_at: string | null;
  locale: string;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  reading_time_minutes: number;
  views_count: number;
  created_at: string;
  updated_at: string;
  category?: BlogCategory | null;
}

const POST_SELECT = `
  id, slug, title, subtitle, excerpt, content_html,
  cover_image_url, card_image_url, category_id, tags,
  author_name, author_avatar, author_role,
  status, published_at, locale,
  seo_title, seo_description, og_image_url,
  reading_time_minutes, views_count,
  created_at, updated_at,
  category:blog_categories(*)
`;

/**
 * Get all published blog posts ordered by publish date.
 */
export async function getAllPublishedPosts(): Promise<BlogPost[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('blog_posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error.message);
    return [];
  }

  return (data || []).map(normalizePost);
}

/**
 * Get a single blog post by slug.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('blog_posts')
    .select(POST_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;

  return normalizePost(data);
}

/**
 * Get all blog categories.
 */
export async function getAllCategories(): Promise<BlogCategory[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error.message);
    return [];
  }

  return data || [];
}

/**
 * Get related posts (same category, excluding current).
 */
export async function getRelatedPosts(postId: string, categoryId: string | null, limit = 3): Promise<BlogPost[]> {
  if (!supabase || !categoryId) return [];

  const { data, error } = await supabase
    .from('blog_posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', postId)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) return [];

  return (data || []).map(normalizePost);
}

function normalizePost(raw: any): BlogPost {
  return {
    ...raw,
    category: Array.isArray(raw.category) ? raw.category[0] || null : raw.category || null,
  };
}

/**
 * Build a lightweight search index for client-side search.
 */
export async function buildSearchIndex(posts: BlogPost[]) {
  return posts.map(p => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || '',
    tags: p.tags || [],
    category: p.category?.name || '',
    published_at: p.published_at,
    cover_image_url: p.card_image_url || p.cover_image_url,
    reading_time_minutes: p.reading_time_minutes,
    author_name: p.author_name,
  }));
}
