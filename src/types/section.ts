export interface ISection {
  id: number;
  name: string | null;
  order: number;
}

export interface ICreateSectionInput {
  name?: string;
  order: number;
  courseId: number;
}

export interface IUpdateSectionInput {
  id: number;
  name?: string;
}

export interface IReorderSectionItem {
  id: number;
  order: number;
}
