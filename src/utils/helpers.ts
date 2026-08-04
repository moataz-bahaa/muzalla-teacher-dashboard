export const toCamelCase = (key: string) => key[0].toLowerCase() + key.slice(1);

export const toPascalCase = (key: string) =>
  key[0].toUpperCase() + key.slice(1);

export function formatData(data: any, formatFn: (key: string) => string): any {
  if (Array.isArray(data)) {
    return data.map((item) => formatData(item, formatFn));
  } else if (
    data !== null &&
    typeof data === 'object' &&
    !(data instanceof Date)
  ) {
    return Object.entries(data).reduce(
      (acc, [key, value]) => {
        const formattedKey = formatFn(key);
        acc[formattedKey] = formatData(value, formatFn);
        return acc;
      },
      {} as Record<string, any>,
    );
  }

  return data;
}
