import {
  EBlockType,
  EPageType,
  type ICreatePageBlockItem,
  type IPageBlock,
  type IQuestionOption,
} from '@/types/page-block';
import type { IPage } from '@/types/page';
import type { ISection } from '@/types/section';

export const TEXT_BLOCK_TYPES = [
  EBlockType.H1,
  EBlockType.H2,
  EBlockType.H3,
  EBlockType.Body,
  EBlockType.SmallText,
] as const;

export const isTextBlockType = (type: EBlockType) =>
  TEXT_BLOCK_TYPES.includes(type as (typeof TEXT_BLOCK_TYPES)[number]);

export const isMediaBlockType = (type: EBlockType) =>
  (
    [
      EBlockType.Image,
      EBlockType.Video,
      EBlockType.Audio,
      EBlockType.Pdf,
      EBlockType.Attachment,
    ] as EBlockType[]
  ).includes(type);

export const isQuestionBlockType = (type: EBlockType) =>
  (
    [
      EBlockType.QuestionSingleChoice,
      EBlockType.QuestionMultipleChoice,
      EBlockType.QuestionWritten,
    ] as EBlockType[]
  ).includes(type);

export interface ITableBlockData {
  rows: string[][];
  columnCount: number;
  rowCount: number;
}

export const createEmptyTable = (
  rowCount = 2,
  columnCount = 2,
): ITableBlockData => ({
  rowCount,
  columnCount,
  rows: Array.from({ length: rowCount }, () =>
    Array.from({ length: columnCount }, () => ''),
  ),
});

export const parseTableData = (data: string): ITableBlockData => {
  try {
    const parsed = JSON.parse(data) as Partial<ITableBlockData> & {
      rows?: string[][];
    };
    if (Array.isArray(parsed.rows) && parsed.rows.length > 0) {
      const rowCount = parsed.rowCount ?? parsed.rows.length;
      const columnCount =
        parsed.columnCount ??
        Math.max(...parsed.rows.map((row) => row.length), 1);
      const rows = parsed.rows.map((row) => {
        const next = [...row];
        while (next.length < columnCount) next.push('');
        return next.slice(0, columnCount);
      });
      while (rows.length < rowCount) {
        rows.push(Array.from({ length: columnCount }, () => ''));
      }
      return {
        rows: rows.slice(0, rowCount),
        rowCount,
        columnCount,
      };
    }
  } catch {
    // fall through
  }
  return createEmptyTable();
};

export const serializeTableData = (table: ITableBlockData): string =>
  JSON.stringify(table);

export const getDefaultBlockData = (type: EBlockType): string => {
  switch (type) {
    case EBlockType.H1:
      return '<p>عنوان رئيسي</p>';
    case EBlockType.H2:
      return '<p>عنوان فرعي</p>';
    case EBlockType.H3:
      return '<p>عنوان صغير</p>';
    case EBlockType.Body:
    case EBlockType.SmallText:
      return '';
    case EBlockType.Quote:
      return '';
    case EBlockType.Notes:
      return '';
    case EBlockType.Table:
      return serializeTableData(createEmptyTable(2, 2));
    case EBlockType.LinkToPage:
      return JSON.stringify({ pageId: 0, title: 'درس متعلق' });
    case EBlockType.ExternalLink:
      return JSON.stringify({
        href: 'https://',
        title: 'رابط خارجي',
        source: '',
      });
    case EBlockType.HorizontalDivider:
    case EBlockType.VerticalDivider:
      return '';
    default:
      return '';
  }
};

export const getDefaultQuestionOptions = (
  type: EBlockType,
): IQuestionOption[] | undefined => {
  if (type === EBlockType.QuestionWritten) return undefined;

  return [
    { text: 'الخيار الأول', isCorrect: true, order: 0 },
    { text: 'الخيار الثاني', isCorrect: false, order: 1 },
    { text: 'الخيار الثالث', isCorrect: false, order: 2 },
  ];
};

export const createBlockItem = (
  type: EBlockType,
  order: number,
): ICreatePageBlockItem => ({
  type,
  order,
  data: getDefaultBlockData(type),
  questionOptions: getDefaultQuestionOptions(type),
});

export const parseMediaData = (data: string) => {
  try {
    return JSON.parse(data) as { url: string; name?: string; size?: string };
  } catch {
    return { url: data, name: undefined, size: undefined };
  }
};

export const parseLinkToPageData = (data: string) => {
  try {
    return JSON.parse(data) as { pageId: number; title: string };
  } catch {
    return { pageId: 0, title: data };
  }
};

export const parseExternalLinkData = (data: string) => {
  try {
    return JSON.parse(data) as { href: string; title?: string; source?: string };
  } catch {
    return { href: data, title: data, source: '' };
  }
};

export interface IBuilderStore {
  sections: ISection[];
  pagesBySection: Record<number, IPage[]>;
  blocksByPage: Record<number, IPageBlock[]>;
}

const storageKey = (courseId: number) => `muzalla-builder-${courseId}`;

let localIdCounter = -1;
const usedLocalIds = new Set<number>();

export const seedLocalIdsFromStore = (store: IBuilderStore) => {
  const ids = [
    ...store.sections.map((s) => s.id),
    ...Object.values(store.pagesBySection).flatMap((pages) =>
      pages.map((p) => p.id),
    ),
    ...Object.values(store.blocksByPage).flatMap((blocks) =>
      blocks.map((b) => b.id),
    ),
  ];

  ids.forEach((id) => usedLocalIds.add(id));

  const minId = ids.reduce((min, id) => Math.min(min, id), -1);
  if (minId <= localIdCounter) {
    localIdCounter = minId - 1;
  }
};

export const nextLocalId = () => {
  let candidate = localIdCounter;
  while (usedLocalIds.has(candidate) || candidate >= 0) {
    candidate -= 1;
  }
  localIdCounter = candidate - 1;
  usedLocalIds.add(candidate);
  return candidate;
};

export const loadBuilderStore = (courseId: number): IBuilderStore | null => {
  try {
    const raw = localStorage.getItem(storageKey(courseId));
    if (!raw) return null;
    const store = JSON.parse(raw) as IBuilderStore;
    seedLocalIdsFromStore(store);
    return store;
  } catch {
    return null;
  }
};

export const saveBuilderStore = (courseId: number, store: IBuilderStore) => {
  localStorage.setItem(storageKey(courseId), JSON.stringify(store));
};

export const createDefaultSection = (
  order: number,
  name?: string,
): ISection => ({
  id: nextLocalId(),
  name: name ?? `قسم ${order + 1}`,
  order,
});

export const createDefaultPage = (
  sectionId: number,
  order: number,
  name?: string,
): IPage => ({
  id: nextLocalId(),
  order,
  type: EPageType.Mixed,
  name: name ?? `درس ${order + 1}`,
  sectionId,
});

export const createLocalBlock = (
  type: EBlockType,
  order: number,
  data?: string,
): IPageBlock => ({
  id: nextLocalId(),
  type,
  order,
  data: data ?? getDefaultBlockData(type),
  questionOptions: getDefaultQuestionOptions(type),
});

export const getTextBlockClassName = (type: EBlockType) => {
  switch (type) {
    case EBlockType.H1:
      return 'text-3xl font-bold';
    case EBlockType.H2:
      return 'text-2xl font-bold';
    case EBlockType.H3:
      return 'text-xl font-semibold';
    case EBlockType.SmallText:
      return 'text-sm text-neutral-600';
    default:
      return 'text-base leading-relaxed';
  }
};

export const withNormalizedOrder = (blocks: IPageBlock[]): IPageBlock[] =>
  blocks.map((block, index) => ({ ...block, order: index }));

export const buildEmptyStore = (): IBuilderStore => ({
  sections: [],
  pagesBySection: {},
  blocksByPage: {},
});

export const addSectionToStore = (
  store: IBuilderStore,
  courseId: number,
  name?: string,
): { store: IBuilderStore; sectionId: number } => {
  const section = createDefaultSection(store.sections.length, name);
  const nextStore = {
    ...store,
    sections: [...store.sections, section].sort((a, b) => a.order - b.order),
    pagesBySection: { ...store.pagesBySection, [section.id]: [] },
  };
  saveBuilderStore(courseId, nextStore);
  return { store: nextStore, sectionId: section.id };
};

export const addPageToStore = (
  store: IBuilderStore,
  courseId: number,
  sectionId: number,
  name?: string,
): { store: IBuilderStore; pageId: number } => {
  const pages = store.pagesBySection[sectionId] ?? [];
  const page = createDefaultPage(sectionId, pages.length, name);
  const nextStore = {
    ...store,
    pagesBySection: {
      ...store.pagesBySection,
      [sectionId]: [...pages, page].sort((a, b) => a.order - b.order),
    },
    blocksByPage: { ...store.blocksByPage, [page.id]: [] },
  };
  saveBuilderStore(courseId, nextStore);
  return { store: nextStore, pageId: page.id };
};

export const addBlockToStore = (
  store: IBuilderStore,
  courseId: number,
  pageId: number,
  type: EBlockType,
  afterBlockId?: number | null,
  data?: string,
): { store: IBuilderStore; block: IPageBlock } => {
  const blocks = [...(store.blocksByPage[pageId] ?? [])];
  const block = createLocalBlock(type, blocks.length, data);

  if (afterBlockId) {
    const index = blocks.findIndex((b) => b.id === afterBlockId);
    if (index >= 0) {
      blocks.splice(index + 1, 0, block);
    } else {
      blocks.push(block);
    }
  } else {
    blocks.push(block);
  }

  const ordered = withNormalizedOrder(blocks);
  const nextStore = {
    ...store,
    blocksByPage: { ...store.blocksByPage, [pageId]: ordered },
  };
  saveBuilderStore(courseId, nextStore);
  return {
    store: nextStore,
    block: ordered.find((b) => b.id === block.id) ?? block,
  };
};
