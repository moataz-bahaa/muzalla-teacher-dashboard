import { EBlockType } from '@/types/page-block';
import {
  getDefaultBlockData,
  getDefaultQuestionOptions,
  isMediaBlockType,
  isQuestionBlockType,
  isTextBlockType,
} from '../utils/block-helpers';

export type TBlockCategory =
  | 'text'
  | 'media'
  | 'question'
  | 'link'
  | 'structure'
  | 'resources';

export type TInsertSlot = 'text' | 'image' | 'video' | 'question' | 'more';

export type TBlockRendererKey =
  | 'text'
  | 'media'
  | 'question'
  | 'relatedLessons'
  | 'resources';

export interface IBlockDefinition {
  type: EBlockType;
  category: TBlockCategory;
  renderer: TBlockRendererKey;
  insertSlots: TInsertSlot[];
}

const define = (
  type: EBlockType,
  category: TBlockCategory,
  renderer: TBlockRendererKey,
  insertSlots: TInsertSlot[] = [],
): IBlockDefinition => ({ type, category, renderer, insertSlots });

export const BLOCK_REGISTRY: IBlockDefinition[] = [
  define(EBlockType.H1, 'text', 'text', ['text']),
  define(EBlockType.H2, 'text', 'text', ['text']),
  define(EBlockType.H3, 'text', 'text', ['text']),
  define(EBlockType.H4, 'text', 'text'),
  define(EBlockType.H5, 'text', 'text'),
  define(EBlockType.H6, 'text', 'text'),
  define(EBlockType.Body, 'text', 'text', ['text', 'more']),
  define(EBlockType.SmallText, 'text', 'text', ['text']),
  define(EBlockType.Quote, 'text', 'text', ['more']),
  define(EBlockType.Notes, 'text', 'text', ['more']),
  define(EBlockType.Table, 'structure', 'text', ['more']),
  define(EBlockType.HorizontalDivider, 'structure', 'text', ['more']),
  define(EBlockType.VerticalDivider, 'structure', 'text', ['more']),
  define(EBlockType.Image, 'media', 'media', ['image', 'more']),
  define(EBlockType.Video, 'media', 'media', ['video', 'more']),
  define(EBlockType.Audio, 'media', 'media', ['more']),
  define(EBlockType.Pdf, 'media', 'media', ['more']),
  define(EBlockType.Attachment, 'media', 'media'),
  define(EBlockType.QuestionSingleChoice, 'question', 'question', ['question']),
  define(EBlockType.QuestionMultipleChoice, 'question', 'question', [
    'question',
  ]),
  define(EBlockType.QuestionWritten, 'question', 'question', ['question']),
  define(EBlockType.LinkToPage, 'link', 'relatedLessons'),
  define(EBlockType.ExternalLink, 'resources', 'resources', ['more']),
];

const byType = new Map(BLOCK_REGISTRY.map((def) => [def.type, def]));

export const getBlockDefinition = (type: EBlockType): IBlockDefinition =>
  byType.get(type) ?? define(type, 'text', 'text');

export const getBlockRendererKey = (type: EBlockType): TBlockRendererKey =>
  getBlockDefinition(type).renderer;

export const getInsertTypesForSlot = (slot: TInsertSlot): EBlockType[] =>
  BLOCK_REGISTRY.filter((def) => def.insertSlots.includes(slot)).map(
    (def) => def.type,
  );

export const createBlockDefaults = (
  type: EBlockType,
  copy?: Parameters<typeof getDefaultBlockData>[1],
) => ({
  data: getDefaultBlockData(type, copy),
  questionOptions: getDefaultQuestionOptions(type, copy),
});

export {
  isMediaBlockType,
  isQuestionBlockType,
  isTextBlockType,
};
