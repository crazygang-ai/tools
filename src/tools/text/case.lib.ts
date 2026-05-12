function splitWords(input: string): string[] {
  if (!input) return [];
  // Insert space at boundaries: lower→Upper, letter→digit, digit→letter, acronym→Word
  const spaced = input
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_\-./\\]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return spaced.split(' ').filter(Boolean);
}

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

export const cases = {
  camel: (s: string) =>
    splitWords(s)
      .map((w, i) => (i === 0 ? w.toLowerCase() : cap(w)))
      .join(''),
  pascal: (s: string) => splitWords(s).map(cap).join(''),
  snake: (s: string) =>
    splitWords(s)
      .map((w) => w.toLowerCase())
      .join('_'),
  kebab: (s: string) =>
    splitWords(s)
      .map((w) => w.toLowerCase())
      .join('-'),
  constant: (s: string) =>
    splitWords(s)
      .map((w) => w.toUpperCase())
      .join('_'),
  title: (s: string) => splitWords(s).map(cap).join(' '),
  sentence: (s: string) => {
    const words = splitWords(s).map((w) => w.toLowerCase());
    if (words.length === 0) return '';
    words[0] = cap(words[0]);
    return words.join(' ');
  },
  upper: (s: string) => splitWords(s).join(' ').toUpperCase(),
  lower: (s: string) => splitWords(s).join(' ').toLowerCase(),
} as const;

export type CaseId = keyof typeof cases;
