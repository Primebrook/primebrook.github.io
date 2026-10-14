import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SERIES, type SeriesId } from './series';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    // Drafts render under `npm run dev` and are left out of the built site.
    draft: z.boolean().default(false),
    // Unlisted posts are built and reachable by URL, but are left off the home
    // page and marked noindex. The test post is one: a permanent reference.
    unlisted: z.boolean().default(false),
    // Part of a series in src/series.ts: shown above the title, in a list of
    // parts at the end of the post, and on the home page.
    series: z
      .object({
        id: z.enum(Object.keys(SERIES) as [SeriesId, ...SeriesId[]]),
        part: z.number().int().positive(),
      })
      .optional(),
  }),
});

export const collections = { posts };
