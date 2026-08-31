import type { ReactNode } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { client } from '@/lib/data/client';
import {
  useCreatePageBlocksMutation,
  useCreateSectionMutation,
  usePageBlocksQuery,
  usePagesQuery,
  useSectionsQuery,
  useUpdatePageBlocksMutation,
} from '@/lib/data/course-builder';
import { EBlockType, EPageType, type IPageBlock } from '@/types/page-block';
import type { IPage } from '@/types/page';
import type { ISection } from '@/types/section';
import {
  addBlockToStore,
  addPageToStore,
  addSectionToStore,
  buildEmptyStore,
  loadBuilderStore,
  saveBuilderStore,
  type IBuilderStore,
} from '../utils/block-helpers';
import { createLocalBlock } from '../utils/block-helpers';

export type TBuilderTab = 'curriculum' | 'info';

interface IBuilderContextValue {
  courseId: number;
  sections: ISection[];
  selectedSectionId: number | null;
  selectedPageId: number | null;
  activeBlockId: number | null;
  isTeacherView: boolean;
  sidebarTab: TBuilderTab;
  onboardingDismissed: boolean;
  setSidebarTab: (tab: TBuilderTab) => void;
  setIsTeacherView: (value: boolean) => void;
  setActiveBlockId: (id: number | null) => void;
  selectSection: (sectionId: number | null) => void;
  selectPage: (pageId: number | null, sectionId?: number) => void;
  addSection: (name?: string) => Promise<number>;
  addPage: (sectionId: number, name?: string) => Promise<number>;
  updateSectionName: (id: number, name: string) => void;
  updatePageName: (id: number, name: string) => void;
  deleteSection: (id: number) => void;
  deletePage: (sectionId: number, pageId: number) => void;
  getPages: (sectionId: number) => IPage[];
  getBlocks: (pageId: number) => IPageBlock[];
  addBlock: (type: EBlockType, afterBlockId?: number | null) => void;
  updateBlock: (block: IPageBlock) => void;
  deleteBlock: (blockId: number) => void;
  duplicateBlock: (blockId: number) => void;
  reorderBlocks: (blocks: IPageBlock[]) => void;
  dismissOnboarding: () => void;
}

const BuilderContext = createContext<IBuilderContextValue | null>(null);

const onboardingKey = (courseId: number) => `muzalla-builder-onboarding-${courseId}`;

export const BuilderProvider: React.FC<{ courseId: number; children: ReactNode }> = ({
  courseId,
  children,
}) => {
  const [store, setStore] = useState<IBuilderStore>(() =>
    loadBuilderStore(courseId) ?? buildEmptyStore(),
  );
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<number | null>(null);
  const [isTeacherView, setIsTeacherView] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<TBuilderTab>('info');
  const [onboardingDismissed, setOnboardingDismissed] = useState(
    () => localStorage.getItem(onboardingKey(courseId)) === '1',
  );

  const sectionsQuery = useSectionsQuery(courseId);
  const pagesQuery = usePagesQuery(selectedSectionId);
  const blocksQuery = usePageBlocksQuery(selectedPageId);

  const createSectionMutation = useCreateSectionMutation(courseId);
  const createBlocksMutation = useCreatePageBlocksMutation(selectedPageId ?? 0);
  const updateBlocksMutation = useUpdatePageBlocksMutation(selectedPageId ?? 0);

  useEffect(() => {
    if (sectionsQuery.data?.length) {
      setStore((prev) => {
        const next = {
          ...prev,
          sections: sectionsQuery.data!,
        };
        saveBuilderStore(courseId, next);
        return next;
      });
      setSidebarTab('curriculum');
    }
  }, [courseId, sectionsQuery.data]);

  useEffect(() => {
    if (selectedSectionId && pagesQuery.data) {
      setStore((prev) => {
        const next = {
          ...prev,
          pagesBySection: {
            ...prev.pagesBySection,
            [selectedSectionId]: pagesQuery.data!,
          },
        };
        saveBuilderStore(courseId, next);
        return next;
      });
    }
  }, [courseId, pagesQuery.data, selectedSectionId]);

  useEffect(() => {
    if (selectedPageId && blocksQuery.data) {
      setStore((prev) => {
        const next = {
          ...prev,
          blocksByPage: {
            ...prev.blocksByPage,
            [selectedPageId]: blocksQuery.data!,
          },
        };
        saveBuilderStore(courseId, next);
        return next;
      });
    }
  }, [blocksQuery.data, courseId, selectedPageId]);

  const persist = useCallback(
    (next: IBuilderStore) => {
      saveBuilderStore(courseId, next);
      setStore(next);
    },
    [courseId],
  );

  const addSection = useCallback(
    async (name?: string) => {
      const { store: next, sectionId } = addSectionToStore(store, courseId, name);
      persist(next);
      setSelectedSectionId(sectionId);
      setSidebarTab('curriculum');

      try {
        const apiId = await createSectionMutation.mutateAsync({
          name: name ?? `قسم ${next.sections.length}`,
          order: next.sections.length - 1,
        });
        if (apiId > 0) {
          const { [sectionId]: sectionPages, ...restPages } = next.pagesBySection;
          persist({
            ...next,
            sections: next.sections.map((s) =>
              s.id === sectionId ? { ...s, id: apiId } : s,
            ),
            pagesBySection: {
              ...restPages,
              [apiId]: sectionPages ?? [],
            },
          });
          setSelectedSectionId(apiId);
          return apiId;
        }
      } catch {
        // keep local id
      }

      return sectionId;
    },
    [courseId, createSectionMutation, persist, store],
  );

  const addPage = useCallback(
    async (sectionId: number, name?: string) => {
      const { store: next, pageId } = addPageToStore(store, courseId, sectionId, name);
      persist(next);
      setSelectedSectionId(sectionId);
      setSelectedPageId(pageId);

      const pages = next.pagesBySection[sectionId] ?? [];

      try {
        const res = await client.pages.create({
          name: name ?? `درس ${pages.length}`,
          order: pages.length - 1,
          type: EPageType.Mixed,
          sectionId,
        });
        const apiId = res.data as number;
        if (apiId > 0) {
          const updatedPages = (next.pagesBySection[sectionId] ?? []).map((p) =>
            p.id === pageId ? { ...p, id: apiId } : p,
          );
          persist({
            ...next,
            pagesBySection: { ...next.pagesBySection, [sectionId]: updatedPages },
            blocksByPage: {
              ...next.blocksByPage,
              [apiId]: next.blocksByPage[pageId] ?? [],
            },
          });
          setSelectedPageId(apiId);
          return apiId;
        }
      } catch {
        // keep local id
      }

      return pageId;
    },
    [courseId, persist, store],
  );

  const updateSectionName = useCallback(
    (id: number, name: string) => {
      persist({
        ...store,
        sections: store.sections.map((s) => (s.id === id ? { ...s, name } : s)),
      });
    },
    [persist, store],
  );

  const updatePageName = useCallback(
    (id: number, name: string) => {
      if (!selectedSectionId) return;
      persist({
        ...store,
        pagesBySection: {
          ...store.pagesBySection,
          [selectedSectionId]: (store.pagesBySection[selectedSectionId] ?? []).map(
            (p) => (p.id === id ? { ...p, name } : p),
          ),
        },
      });
    },
    [persist, selectedSectionId, store],
  );

  const deleteSection = useCallback(
    (id: number) => {
      const { [id]: _removed, ...restPages } = store.pagesBySection;
      persist({
        sections: store.sections.filter((s) => s.id !== id),
        pagesBySection: restPages,
        blocksByPage: store.blocksByPage,
      });
      if (selectedSectionId === id) {
        setSelectedSectionId(null);
        setSelectedPageId(null);
      }
    },
    [persist, selectedSectionId, store],
  );

  const deletePage = useCallback(
    (sectionId: number, pageId: number) => {
      const { [pageId]: _removed, ...restBlocks } = store.blocksByPage;
      persist({
        ...store,
        pagesBySection: {
          ...store.pagesBySection,
          [sectionId]: (store.pagesBySection[sectionId] ?? []).filter(
            (p) => p.id !== pageId,
          ),
        },
        blocksByPage: restBlocks,
      });
      if (selectedPageId === pageId) setSelectedPageId(null);
    },
    [persist, selectedPageId, store],
  );

  const getPages = useCallback(
    (sectionId: number) => store.pagesBySection[sectionId] ?? [],
    [store.pagesBySection],
  );

  const getBlocks = useCallback(
    (pageId: number) =>
      [...(store.blocksByPage[pageId] ?? [])].sort((a, b) => a.order - b.order),
    [store.blocksByPage],
  );

  const addBlock = useCallback(
    (type: EBlockType, afterBlockId?: number | null) => {
      if (!selectedPageId) return;
      const { store: next, block } = addBlockToStore(
        store,
        courseId,
        selectedPageId,
        type,
        afterBlockId,
      );
      persist(next);
      setActiveBlockId(block.id);

      if (block.id < 0) {
        void createBlocksMutation
          .mutateAsync({
            blocks: [
              {
                type: block.type,
                order: block.order,
                data: block.data,
                questionOptions: block.questionOptions,
              },
            ],
          })
          .catch(() => undefined);
      }
    },
    [courseId, createBlocksMutation, persist, selectedPageId, store],
  );

  const updateBlock = useCallback(
    (block: IPageBlock) => {
      if (!selectedPageId) return;
      const blocks = (store.blocksByPage[selectedPageId] ?? []).map((b) =>
        b.id === block.id ? block : b,
      );
      persist({ ...store, blocksByPage: { ...store.blocksByPage, [selectedPageId]: blocks } });

      if (block.id > 0) {
        void updateBlocksMutation
          .mutateAsync({ blocks: [{ id: block.id, data: block.data, type: block.type, order: block.order }] })
          .catch(() => undefined);
      }
    },
    [persist, selectedPageId, store, updateBlocksMutation],
  );

  const deleteBlock = useCallback(
    (blockId: number) => {
      if (!selectedPageId) return;
      const blocks = (store.blocksByPage[selectedPageId] ?? [])
        .filter((b) => b.id !== blockId)
        .map((b, index) => ({ ...b, order: index }));
      persist({ ...store, blocksByPage: { ...store.blocksByPage, [selectedPageId]: blocks } });
      if (activeBlockId === blockId) setActiveBlockId(null);
    },
    [activeBlockId, persist, selectedPageId, store],
  );

  const duplicateBlock = useCallback(
    (blockId: number) => {
      if (!selectedPageId) return;
      const source = (store.blocksByPage[selectedPageId] ?? []).find(
        (b) => b.id === blockId,
      );
      if (!source) return;
      const copy = createLocalBlock(source.type, source.order + 1);
      copy.data = source.data;
      copy.questionOptions = source.questionOptions?.map((o) => ({ ...o }));
      const blocks = [...(store.blocksByPage[selectedPageId] ?? [])];
      const index = blocks.findIndex((b) => b.id === blockId);
      blocks.splice(index + 1, 0, copy);
      blocks.forEach((b, i) => {
        b.order = i;
      });
      persist({ ...store, blocksByPage: { ...store.blocksByPage, [selectedPageId]: blocks } });
      setActiveBlockId(copy.id);
    },
    [persist, selectedPageId, store],
  );

  const reorderBlocks = useCallback(
    (blocks: IPageBlock[]) => {
      if (!selectedPageId) return;
      const ordered = blocks.map((b, index) => ({ ...b, order: index }));
      persist({
        ...store,
        blocksByPage: { ...store.blocksByPage, [selectedPageId]: ordered },
      });
    },
    [persist, selectedPageId, store],
  );

  const dismissOnboarding = useCallback(() => {
    localStorage.setItem(onboardingKey(courseId), '1');
    setOnboardingDismissed(true);
  }, [courseId]);

  const value = useMemo<IBuilderContextValue>(
    () => ({
      courseId,
      sections: store.sections,
      selectedSectionId,
      selectedPageId,
      activeBlockId,
      isTeacherView,
      sidebarTab,
      onboardingDismissed,
      setSidebarTab,
      setIsTeacherView,
      setActiveBlockId,
      selectSection: setSelectedSectionId,
      selectPage: (pageId, sectionId) => {
        if (sectionId) setSelectedSectionId(sectionId);
        setSelectedPageId(pageId);
      },
      addSection,
      addPage,
      updateSectionName,
      updatePageName,
      deleteSection,
      deletePage,
      getPages,
      getBlocks,
      addBlock,
      updateBlock,
      deleteBlock,
      duplicateBlock,
      reorderBlocks,
      dismissOnboarding,
    }),
    [
      activeBlockId,
      addBlock,
      addPage,
      addSection,
      deleteBlock,
      deletePage,
      deleteSection,
      dismissOnboarding,
      duplicateBlock,
      getBlocks,
      getPages,
      isTeacherView,
      onboardingDismissed,
      reorderBlocks,
      courseId,
      selectedPageId,
      selectedSectionId,
      sidebarTab,
      store.sections,
      updateBlock,
      updatePageName,
      updateSectionName,
    ],
  );

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used within BuilderProvider');
  return ctx;
};
