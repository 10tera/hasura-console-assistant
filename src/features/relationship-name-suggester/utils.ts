// 単語を複数形にする
export const pluralize = (word: string): string => {
  if (!word) return word;

  const lower = word.toLowerCase();

  // 不規則形（末尾パターンで判定、長い順にチェック）
  const irregulars: Array<[string, string]> = [
    ['woman', 'women'], // 'man'より先にチェック
    ['person', 'people'],
    ['child', 'children'],
    ['tooth', 'teeth'],
    ['foot', 'feet'],
    ['mouse', 'mice'],
    ['goose', 'geese'],
    ['man', 'men'], // より短いパターンは後に
  ];

  for (const [singular, plural] of irregulars) {
    if (lower.endsWith(singular)) {
      // 末尾が不規則形にマッチする場合、その部分だけを置換
      const prefix = word.slice(0, word.length - singular.length);
      // 元の単語の最初が大文字の場合、複数形も大文字にする
      const isCapitalized =
        word[word.length - singular.length]?.toUpperCase() === word[word.length - singular.length];
      return prefix + (isCapitalized ? plural.charAt(0).toUpperCase() + plural.slice(1) : plural);
    }
  }

  // s, x, z, ch, sh で終わる場合: +es
  if (/[sxz]$/.test(lower) || /[cs]h$/.test(lower)) {
    return `${word}es`;
  }

  // 子音 + y で終わる場合: y -> ies
  if (/[^aeiou]y$/.test(lower)) {
    return `${word.slice(0, -1)}ies`;
  }

  // f, fe で終わる場合: f/fe -> ves
  if (/f$/.test(lower)) {
    return `${word.slice(0, -1)}ves`;
  }
  if (/fe$/.test(lower)) {
    return `${word.slice(0, -2)}ves`;
  }

  // 子音 + o で終わる場合: +es
  if (/[^aeiou]o$/.test(lower)) {
    return `${word}es`;
  }

  // デフォルト: +s
  return `${word}s`;
};
