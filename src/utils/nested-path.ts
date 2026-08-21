/**
 * Retrieves a value from an object using a dot-notation path.
 * Example: getNestedValue(options, 'background.color')
 */
export function getNestedValue(obj: any, path: string): any {
  if (obj === null || obj === undefined || !path) return undefined;
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current;
}

/**
 * Immutably sets a value in an object using a dot-notation path.
 * Example: setNestedValue(options, 'background.color', '#ff0000')
 */
export function setNestedValue<T = any>(obj: T, path: string, value: any): T {
  if (!path) return obj;
  const parts = path.split(".");

  if (parts.length === 1) {
    return {
      ...(obj as any),
      [parts[0]]: value,
    };
  }

  const [head, ...tail] = parts;
  const currentNested = (obj as any)?.[head] || {};

  return {
    ...(obj as any),
    [head]: setNestedValue(currentNested, tail.join("."), value),
  };
}
