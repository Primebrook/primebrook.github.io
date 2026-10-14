// Series that posts can belong to. A post joins one in its frontmatter:
//
//   series:
//     id: hashing
//     part: 1
//
// Most posts aren't in a series and leave this out.
export const SERIES = {
  hashing: {
    title: 'Hashing – Being Lucky on Purpose',
    description: 'How do you get guarantees out of randomness?',
    // false shows "More parts to come" under the list of parts.
    complete: false,
  },
} as const;

export type SeriesId = keyof typeof SERIES;
