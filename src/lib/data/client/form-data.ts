import type { ICreateCourseInput, IUpdateCourseInput } from '@/types/course';
import type {
  ICreatePageInput,
  IReorderPageItem,
  IUpdatePageInput,
} from '@/types/page';
import type {
  ICreatePageBlocksInput,
  IReorderPageBlockItem,
} from '@/types/page-block';
import type {
  ICreateSectionInput,
  IReorderSectionItem,
  IUpdateSectionInput,
} from '@/types/section';
import type { ICreateStudentInput } from '@/types/student';
import { toPascalCase } from '@/utils/helpers';

function appendFormValue(formData: FormData, key: string, value: unknown) {
  if (value === null || value === undefined) return;
  if (value instanceof File) {
    formData.append(key, value);
    return;
  }
  formData.append(key, String(value));
}

function appendTagIds(formData: FormData, tags: number[] | undefined) {
  if (!tags) return;
  tags.forEach((tagId, index) => {
    appendFormValue(formData, `Tags[${index}]`, tagId);
  });
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

export function buildCreateSectionFormData(
  input: ICreateSectionInput,
): FormData {
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
  const { tags, cover, image, ...rest } = input;

  Object.entries(rest).forEach(([key, value]) => {
    appendFormValue(formData, toPascalCase(key), value);
  });

  appendTagIds(formData, tags);
  if (cover) formData.append('Cover', cover);
  if (image) formData.append('Image', image);

  return formData;
}

export function buildCreateCourseFormData(input: ICreateCourseInput): FormData {
  const formData = new FormData();
  appendFormValue(formData, 'Name', input.name);
  appendFormValue(formData, 'Description', input.description);
  appendFormValue(formData, 'LevelId', input.levelId);
  appendFormValue(formData, 'DurationInMinutes', input.durationInMinutes);
  appendFormValue(formData, 'Prerequisites', input.prerequisites);
  appendFormValue(formData, 'HasCertificate', input.hasCertificate);
  appendFormValue(formData, 'Status', input.status);
  appendTagIds(formData, input.tags);
  formData.append('Cover', input.cover);
  formData.append('Image', input.image);
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

export function buildCreateStudentFormData(
  input: ICreateStudentInput,
): FormData {
  const formData = new FormData();
  Object.entries(input).forEach(([key, value]) => {
    appendFormValue(formData, toPascalCase(key), value);
  });
  return formData;
}

export function buildImportStudentsFormData(file: File): FormData {
  const formData = new FormData();
  formData.append('File', file);
  return formData;
}
