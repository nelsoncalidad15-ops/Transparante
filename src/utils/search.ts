const stopWords = new Set([
  'a', 'al', 'de', 'del', 'el', 'en', 'es', 'la', 'las', 'lo', 'los',
  'mi', 'mis', 'o', 'para', 'por', 'que', 'se', 'su', 'sus', 'tu', 'tus',
  'un', 'una', 'unos', 'unas', 'y', 'como', 'cuando', 'cuanto', 'estas',
]);

export const normalizeSearchText = (value: string): string => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const editDistanceWithin = (left: string, right: string, limit: number): boolean => {
  if (Math.abs(left.length - right.length) > limit) return false;
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row++) {
    const current = [row];
    let smallest = current[0];
    for (let column = 1; column <= right.length; column++) {
      current[column] = Math.min(
        previous[column] + 1,
        current[column - 1] + 1,
        previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1),
      );
      smallest = Math.min(smallest, current[column]);
    }
    if (smallest > limit) return false;
    previous = current;
  }
  return previous[right.length] <= limit;
};

export const matchesSearch = (query: string, fields: Array<string | undefined>): boolean => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  const normalizedFields = fields.map((field) => normalizeSearchText(field || ''));
  if (normalizedFields.some((field) => field.includes(normalizedQuery))) return true;

  const allTokens = normalizedQuery.split(' ');
  const tokens = allTokens.filter((token) => !stopWords.has(token));
  const queryTokens = tokens.length ? tokens : allTokens;
  const fieldTokens = [...new Set(normalizedFields.flatMap((field) => field.split(' ').filter(Boolean)))];
  const matched = queryTokens.filter((token) => fieldTokens.some((word) =>
    word.includes(token) || (token.length >= 5 && editDistanceWithin(token, word, token.length >= 9 ? 2 : 1))
  )).length;
  return matched >= Math.ceil(queryTokens.length * 0.65);
};
