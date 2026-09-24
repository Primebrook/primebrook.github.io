import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// `npm run verify:drafts` sets this so drafts can be built and checked locally.
// CI never sets it, so drafts are never deployed.
const includeDrafts = import.meta.env.DEV || process.env.INCLUDE_DRAFTS === '1';

/** Every post that gets a page: all but drafts, unless drafts are included. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => includeDrafts || !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** The posts shown on the home page: pages that aren't unlisted. */
export async function getListedPosts(): Promise<Post[]> {
  return (await getPosts()).filter((post) => !post.data.unlisted);
}

export function minutesRead(post: Post): number {
  const words = (post.body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
