import type { EPageType } from './page-block';

export interface IPage {
  id: number;
  order: number;
  type: EPageType;
  name: string;
  sectionId?: number;
}

export interface ICreatePageInput {
  name: string;
  order: number;
  type: EPageType;
  sectionId: number;
}

export interface IUpdatePageInput {
  id: number;
  type?: EPageType;
  name?: string;
}

export interface IReorderPageItem {
  id: number;
  order: number;
}
