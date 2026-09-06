import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function objectToFormData(
  input: unknown,
  formData: FormData = new FormData(),
  parentKey?: string,
): FormData {
  if (input === null || input === undefined) return formData;

  parentKey = parentKey ?? undefined;

  if (input instanceof File) {
    if (!parentKey) throw new Error('File must have a key');
    formData.append(parentKey, input);
    return formData;
  }

  if (input instanceof FileList) {
    if (!parentKey) throw new Error('FileList must have a key');
    Array.from(input).forEach((file) => {
      formData.append(parentKey, file);
    });
    return formData;
  }

  if (Array.isArray(input)) {
    if (!parentKey) throw new Error('Array must have a key');
    input.forEach((value) => {
      objectToFormData(value, formData, parentKey);
    });
    return formData;
  }

  if (input instanceof Date) {
    if (!parentKey) throw new Error('Date must have a key');
    formData.append(parentKey, input.toISOString());
    return formData;
  }

  if (typeof input === 'object') {
    Object.entries(input).forEach(([key, value]) => {
      objectToFormData(
        value,
        formData,
        parentKey ? `${parentKey}.${key}` : key,
      );
    });
    return formData;
  }

  if (parentKey) {
    formData.append(parentKey, String(input));
  }

  return formData;
}
