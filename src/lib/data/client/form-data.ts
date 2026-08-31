import type { ICreatePageBlocksInput } from '@/types/page-block';
import type { ICreatePageInput, IReorderPageItem, IUpdatePageInput } from '@/types/page';
import type {
  ICreateSectionInput,
  IReorderSectionItem,
  IUpdateSectionInput,
} from '@/types/section';
import type { IReorderPageBlockItem } from '@/types/page-block';
import type { IUpdateCourseInput } from '@/types/course-api';
import { toPascalCase } from '@/utils/helpers';

function appendFormValue(formData: FormData, key: string, value: unknown) {
  if (value === null || value === undefined) return;
  if (value instanceof File) {
    formData.append(key, value);
    return;
  }
  formData.append(key, String(value));
}

export function buildCreatePageBlocksFormData(
  input: ICreatePageBlocksInput,
): FormData {
  const formData = new FormData();
  appendFormValue(formData, 'PageId', input.pageId);

  input.blocks.forEach((block, index) => {
    const prefix = `Blocks[${index}]`;
    appendFormValue(formData, `${prefix}.Data`, block.data);
    appendFormValue(formData, `${prefix}.Order`, block.order);
    appendFormValue(formData, `${prefix}.Type`, block.type);

    if (block.file) {
      formData.append(`${prefix}.File`, block.file);
    }

    block.questionOptions?.forEach((option, optionIndex) => {
      const optionPrefix = `${prefix}.QuestionOptions[${optionIndex}]`;
      appendFormValue(formData, `${optionPrefix}.Text`, option.text);
      appendFormValue(formData, `${optionPrefix}.IsCorrect`, option.isCorrect);
      appendFormValue(formData, `${optionPrefix}.Order`, option.order);
    });
  });

  return formData;
}

export function buildCreateSectionFormData(input: ICreateSectionInput): FormData {
  const formData = new FormData();
  Object.entries(input).forEach(([key, value]) => {
    appendFormValue(formData, toPascalCase(key), value);
  });
  return formData;
}

export function buildCreatePageFormData(input: ICreatePageInput): FormData {
  const formData = new FormData();
  Object.entries(input).forEach(([key, value]) => {
    appendFormValue(formData, toPascalCase(key), value);
  });
  return formData;
}

export function buildUpdateSectionFormData(
  input: Omit<IUpdateSectionInput, 'id'>,
): FormData {
  const formData = new FormData();
  Object.entries(input).forEach(([key, value]) => {
    appendFormValue(formData, toPascalCase(key), value);
  });
  return formData;
}

export function buildUpdatePageFormData(
  input: Omit<IUpdatePageInput, 'id'>,
): FormData {
  const formData = new FormData();
  Object.entries(input).forEach(([key, value]) => {
    appendFormValue(formData, toPascalCase(key), value);
  });
  return formData;
}

export function buildUpdateCourseFormData(
  input: Omit<IUpdateCourseInput, 'id'>,
): FormData {
  const formData = new FormData();
  Object.entries(input).forEach(([key, value]) => {
    appendFormValue(formData, toPascalCase(key), value);
  });
  return formData;
}

export function buildReorderSectionsBody(
  courseId: number,
  items: IReorderSectionItem[],
) {
  return { courseId, items };
}

export function buildReorderPagesBody(
  sectionId: number,
  items: IReorderPageItem[],
) {
  return { sectionId, items };
}

export function buildReorderPageBlocksBody(
  pageId: number,
  items: IReorderPageBlockItem[],
) {
  return { pageId, items };
}
