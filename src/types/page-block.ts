export const EBlockType = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4,
  H5: 5,
  H6: 6,
  Attachment: 7,
  QuestionSingleChoice: 8,
  QuestionMultipleChoice: 9,
  QuestionWritten: 10,
  LinkToPage: 11,
  ExternalLink: 12,
  Body: 13,
  SmallText: 14,
  Image: 15,
  Video: 16,
  Audio: 17,
  Pdf: 18,
  Table: 19,
  Quote: 20,
  Notes: 21,
  HorizontalDivider: 22,
  VerticalDivider: 23,
} as const;

export type EBlockType = (typeof EBlockType)[keyof typeof EBlockType];

export const EPageType = {
  Mixed: 1,
  Exam: 2,
} as const;

export type EPageType = (typeof EPageType)[keyof typeof EPageType];

export const ECourseStatus = {
  Published: 1,
  Draft: 2,
  Pending: 3,
  Upcoming: 4,
} as const;

export type ECourseStatus = (typeof ECourseStatus)[keyof typeof ECourseStatus];

export interface IQuestionOption {
  id?: number;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface IMediaData {
  url: string;
  name?: string;
  size?: string;
  mime?: string;
}

export interface ILinkToPageData {
  pageId: number;
  title: string;
}

export interface IExternalLinkData {
  href: string;
  title?: string;
  source?: string;
}

export interface IPageBlock {
  id: number;
  data: string;
  order: number;
  type: EBlockType;
  questionOptions?: IQuestionOption[];
}

export interface ICreatePageBlockItem {
  data?: string;
  order: number;
  type: EBlockType;
  questionOptions?: IQuestionOption[];
  file?: File;
}

export interface ICreatePageBlocksInput {
  pageId: number;
  blocks: ICreatePageBlockItem[];
}

export interface IUpdatePageBlockItem {
  id: number;
  data?: string;
  type?: EBlockType;
  order?: number;
}

export interface IUpdatePageBlocksInput {
  blocks: IUpdatePageBlockItem[];
}

export interface IReorderPageBlockItem {
  id: number;
  order: number;
}
