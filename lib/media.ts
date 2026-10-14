import meta from "@/lib/clip-meta.json";

type Meta = Record<string, { thumb?: boolean; clip?: boolean }>;
const META = meta as Meta;

/** Poster + optional preview-loop paths for a clip (written by `npm run media`). */
export function media(id: string) {
  const m = META[id] ?? {};
  return {
    poster: m.thumb === false ? null : `/images/thumbs/${id}.jpg`,
    clip: m.clip ? `/clips/${id}.mp4` : null,
  };
}
