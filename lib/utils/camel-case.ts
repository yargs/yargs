export function camelCase(s: string) {
  if (!s) return '';
  // split camel case, then match ascii words
  const words = asciiWords(s.replace(/([a-z0-9])([A-Z])/g, '$1 $2'));
  return words.length > 1
    ? words[0].toLowerCase() + words.slice(1).map(capitalizeFirst).join('')
    : words[0].toLowerCase();
}

function capitalizeFirst(word: string): string {
  return word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : '';
}

// eslint-disable-next-line no-control-regex
const reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

function asciiWords(s: string) {
  return s.match(reAsciiWord) || [];
}
