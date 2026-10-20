import {
  useCreatePageMutation,
  useCreateSectionMutation,
  useDeletePageMutation,
  useDeleteSectionMutation,
  usePageBlocksQuery,
  usePagesQuery,
  useSectionsQuery,
  useUpdatePageMutation,
  useUpdateSectionMutation,
  useUpsertPageContentMutation,
} from '@/lib/data/course-builder';
import type { IPage } from '@/types/page';
import { EBlockType, EPageType, type IPageBlock } from '@/types/page-block';
import type { ISection } from '@/types/section';
import type { ReactNode } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  addBlockToStore,
  addPageToStore,
  addSectionToStore,
  buildEmptyStore,
  createLocalBlock,
  isQuestionBlockType,
  loadBuilderStore,
  saveBuilderStore,
  withNormalizedOrder,
  type IBuilderStore,
} from '../utils/block-helpers';

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
  isDirty: boolean;
  isSaving: boolean;
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
  addBlock: (
    type: EBlockType,
    afterBlockId?: number | null,
    data?: string,
  ) => void;
  updateBlock: (block: IPageBlock) => void;
  deleteBlock: (blockId: number) => void;
  duplicateBlock: (blockId: number) => void;
  reorderBlocks: (blocks: IPageBlock[]) => void;
  setBlockPendingFile: (blockId: number, file: File | null) => void;
  savePageContent: () => Promise<boolean>;
  dismissOnboarding: () => void;
}

const BuilderContext = createContext<IBuilderContextValue | null>(null);

const onboardingKey = (courseId: number) =>
  `muzalla-builder-onboarding-${courseId}`;

const confirmDiscard = (message: string) =>
  typeof window === 'undefined' ? true : window.confirm(message);

export const BuilderProvider: React.FC<{
  courseId: number;
  children: ReactNode;
}> = ({ courseId, children }) => {
  const { t } = useTranslation();
  const [store, setStore] = useState<IBuilderStore>(
    () => loadBuilderStore(courseId) ?? buildEmptyStore(),
  );
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null,
  );
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<number | null>(null);
  const [isTeacherView, setIsTeacherView] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<TBuilderTab>('info');
  const [isDirty, setIsDirty] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<Record<number, File>>({});
  const [onboardingDismissed, setOnboardingDismissed] = useState(
    () => localStorage.getItem(onboardingKey(courseId)) === '1',
  );

  const sectionsQuery = useSectionsQuery(courseId);
  const pagesQuery = usePagesQuery(selectedSectionId);
  const blocksQuery = usePageBlocksQuery(selectedPageId);

  const createSectionMutation = useCreateSectionMutation(courseId);
  const updateSectionMutation = useUpdateSectionMutation(courseId);
  const deleteSectionMutation = useDeleteSectionMutation(courseId);
  const createPageMutation = useCreatePageMutation();
  const updatePageMutation = useUpdatePageMutation();
  const deletePageMutation = useDeletePageMutation();
  const upsertContentMutation = useUpsertPageContentMutation(selectedPageId);

  const persist = useCallback(
    (next: IBuilderStore) => {
      saveBuilderStore(courseId, next);
      setStore(next);
    },
    [courseId],
  );

  const markDirty = useCallback(() => setIsDirty(true), []);

  useEffect(() => {
    const remote = sectionsQuery.data;
    if (!remote) return;

    setStore((prev) => {
      const same =
        prev.sections.length === remote.length &&
        prev.sections.every(
          (section, index) =>
            section.id === remote[index]?.id &&
            section.name === remote[index]?.name &&
            section.order === remote[index]?.order,
        );
      if (same) return prev;
      const next = { ...prev, sections: remote };
      saveBuilderStore(courseId, next);
      return next;
    });

    setSidebarTab((tab) => (tab === 'curriculum' ? tab : 'curriculum'));
    setSelectedSectionId((current) => {
      if (current && remote.some((s) => s.id === current)) return current;
      return remote[0]?.id ?? null;
    });
  }, [courseId, sectionsQuery.data]);

  useEffect(() => {
    const remote = pagesQuery.data;
    if (!selectedSectionId || !remote) return;

    setStore((prev) => {
      const current = prev.pagesBySection[selectedSectionId] ?? [];
      const same =
        current.length === remote.length &&
        current.every(
          (page, index) =>
            page.id === remote[index]?.id &&
            page.name === remote[index]?.name &&
            page.order === remote[index]?.order &&
            page.type === remote[index]?.type,
        );
      if (same) return prev;
      const next = {
        ...prev,
        pagesBySection: {
          ...prev.pagesBySection,
          [selectedSectionId]: remote,
        },
      };
      saveBuilderStore(courseId, next);
      return next;
    });
  }, [courseId, pagesQuery.data, selectedSectionId]);

  useEffect(() => {
    const remote = blocksQuery.data;
    if (!selectedPageId || !remote || isDirty) return;

    setStore((prev) => {
      const current = prev.blocksByPage[selectedPageId] ?? [];
      const same =
        current.length === remote.length &&
        current.every(
          (block, index) =>
            block.id === remote[index]?.id &&
            block.order === remote[index]?.order &&
            block.type === remote[index]?.type &&
            block.data === remote[index]?.data,
        );
      if (same) return prev;
      const next = {
        ...prev,
        blocksByPage: {
          ...prev.blocksByPage,
          [selectedPageId]: remote,
        },
      };
      saveBuilderStore(courseId, next);
      return next;
    });
  }, [blocksQuery.data, courseId, isDirty, selectedPageId]);

  const guardDirtyNavigation = useCallback(() => {
    if (!isDirty) return true;
    const ok = confirmDiscard(
      t('courses.builder.confirmDiscard', {
        defaultValue: 'You have unsaved changes. Discard them?',
      }),
    );
    if (ok) {
      setIsDirty(false);
      setPendingFiles({});
    }
    return ok;
  }, [isDirty, t]);

  const selectSection = useCallback(
    (sectionId: number | null) => {
      if (!guardDirtyNavigation()) return;
      setSelectedSectionId(sectionId);
      setSelectedPageId(null);
      setActiveBlockId(null);
      setSidebarTab('curriculum');
    },
    [guardDirtyNavigation],
  );

  const selectPage = useCallback(
    (pageId: number | null, sectionId?: number) => {
      if (pageId === selectedPageId) return;
      if (!guardDirtyNavigation()) return;
      if (sectionId != null) setSelectedSectionId(sectionId);
      setSelectedPageId(pageId);
      setActiveBlockId(null);
      setSidebarTab('curriculum');
    },
    [guardDirtyNavigation, selectedPageId],
  );

  const addSection = useCallback(
    async (name?: string) => {
      const { store: next, sectionId } = addSectionToStore(
        store,
        courseId,
        name,
      );
      persist(next);
      setSelectedSectionId(sectionId);
      setSidebarTab('curriculum');

      try {
        const apiId = await createSectionMutation.mutateAsync({
          name: name ?? `قسم ${next.sections.length}`,
          order: next.sections.length - 1,
        });
        if (apiId > 0) {
          const { [sectionId]: sectionPages, ...restPages } =
            next.pagesBySection;
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
        toast.error(t('courses.builder.toast.saveError'));
      }

      return sectionId;
    },
    [courseId, createSectionMutation, persist, store, t],
  );

  const addPage = useCallback(
    async (sectionId: number, name?: string) => {
      if (sectionId <= 0) {
        toast.error(t('courses.builder.toast.saveError'));
        return -1;
      }
      if (!guardDirtyNavigation()) return selectedPageId ?? -1;

      const { store: next, pageId } = addPageToStore(
        store,
        courseId,
        sectionId,
        name,
      );
      persist(next);
      setSelectedSectionId(sectionId);
      setSelectedPageId(pageId);
      setIsDirty(false);

      const pages = next.pagesBySection[sectionId] ?? [];

      try {
        const apiId = await createPageMutation.mutateAsync({
          name: name ?? `درس ${pages.length}`,
          order: pages.length - 1,
          type: EPageType.Mixed,
          sectionId,
        });
        if (apiId > 0) {
          const updatedPages = (next.pagesBySection[sectionId] ?? []).map(
            (p) => (p.id === pageId ? { ...p, id: apiId } : p),
          );
          const { [pageId]: pageBlocks, ...restBlocks } = next.blocksByPage;
          persist({
            ...next,
            pagesBySection: {
              ...next.pagesBySection,
              [sectionId]: updatedPages,
            },
            blocksByPage: {
              ...restBlocks,
              [apiId]: pageBlocks ?? [],
            },
          });
          setSelectedPageId(apiId);
          return apiId;
        }
      } catch {
        toast.error(t('courses.builder.toast.saveError'));
      }

      return pageId;
    },
    [
      courseId,
      createPageMutation,
      guardDirtyNavigation,
      persist,
      selectedPageId,
      store,
      t,
    ],
  );

  const updateSectionName = useCallback(
    (id: number, name: string) => {
      persist({
        ...store,
        sections: store.sections.map((s) => (s.id === id ? { ...s, name } : s)),
      });
      if (id > 0) {
        void updateSectionMutation.mutateAsync({ id, name }).catch(() => {
          toast.error(t('courses.builder.toast.saveError'));
        });
      }
    },
    [persist, store, t, updateSectionMutation],
  );

  const updatePageName = useCallback(
    (id: number, name: string) => {
      if (!selectedSectionId) return;
      persist({
        ...store,
        pagesBySection: {
          ...store.pagesBySection,
          [selectedSectionId]: (
            store.pagesBySection[selectedSectionId] ?? []
          ).map((p) => (p.id === id ? { ...p, name } : p)),
        },
      });
      if (id > 0) {
        void updatePageMutation.mutateAsync({ id, name }).catch(() => {
          toast.error(t('courses.builder.toast.saveError'));
        });
      }
    },
    [persist, selectedSectionId, store, t, updatePageMutation],
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
        setIsDirty(false);
      }
      if (id > 0) {
        void deleteSectionMutation.mutateAsync(id).catch(() => {
          toast.error(t('courses.builder.toast.saveError'));
        });
      }
    },
    [deleteSectionMutation, persist, selectedSectionId, store, t],
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
      if (selectedPageId === pageId) {
        setSelectedPageId(null);
        setIsDirty(false);
        setPendingFiles({});
      }
      if (pageId > 0) {
        void deletePageMutation.mutateAsync(pageId).catch(() => {
          toast.error(t('courses.builder.toast.saveError'));
        });
      }
    },
    [deletePageMutation, persist, selectedPageId, store, t],
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
    (type: EBlockType, afterBlockId?: number | null, data?: string) => {
      if (!selectedPageId) return;
      const { store: next, block } = addBlockToStore(
        store,
        courseId,
        selectedPageId,
        type,
        afterBlockId,
        data,
      );
      persist(next);
      setActiveBlockId(block.id);
      markDirty();
    },
    [courseId, markDirty, persist, selectedPageId, store],
  );

  const updateBlock = useCallback(
    (block: IPageBlock) => {
      if (!selectedPageId) return;
      const blocks = (store.blocksByPage[selectedPageId] ?? []).map((b) =>
        b.id === block.id ? block : b,
      );
      persist({
        ...store,
        blocksByPage: { ...store.blocksByPage, [selectedPageId]: blocks },
      });
      markDirty();
    },
    [markDirty, persist, selectedPageId, store],
  );

  const deleteBlock = useCallback(
    (blockId: number) => {
      if (!selectedPageId) return;
      const blocks = withNormalizedOrder(
        (store.blocksByPage[selectedPageId] ?? []).filter(
          (b) => b.id !== blockId,
        ),
      );
      persist({
        ...store,
        blocksByPage: { ...store.blocksByPage, [selectedPageId]: blocks },
      });
      setPendingFiles((prev) => {
        const { [blockId]: _removed, ...rest } = prev;
        return rest;
      });
      if (activeBlockId === blockId) setActiveBlockId(null);
      markDirty();
    },
    [activeBlockId, markDirty, persist, selectedPageId, store],
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
      const ordered = withNormalizedOrder(blocks);
      persist({
        ...store,
        blocksByPage: { ...store.blocksByPage, [selectedPageId]: ordered },
      });
      setActiveBlockId(copy.id);
      markDirty();
    },
    [markDirty, persist, selectedPageId, store],
  );

  const reorderBlocks = useCallback(
    (blocks: IPageBlock[]) => {
      if (!selectedPageId) return;
      const ordered = withNormalizedOrder(blocks);
      persist({
        ...store,
        blocksByPage: { ...store.blocksByPage, [selectedPageId]: ordered },
      });
      markDirty();
    },
    [markDirty, persist, selectedPageId, store],
  );

  const setBlockPendingFile = useCallback(
    (blockId: number, file: File | null) => {
      setPendingFiles((prev) => {
        if (!file) {
          const { [blockId]: _removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [blockId]: file };
      });
      markDirty();
    },
    [markDirty],
  );

  const savePageContent = useCallback(async () => {
    if (!selectedPageId || selectedPageId <= 0) {
      toast.error(
        t('courses.builder.toast.savePageFirst', {
          defaultValue: 'Save the page in the curriculum before saving content',
        }),
      );
      return false;
    }

    const blocks = getBlocks(selectedPageId);
    try {
      const saved = await upsertContentMutation.mutateAsync({
        blocks: blocks.map((block) => ({
          id: block.id > 0 ? block.id : undefined,
          type: block.type,
          order: block.order,
          data: block.data,
          questionOptions:
            isQuestionBlockType(block.type) && block.questionOptions?.length
              ? block.questionOptions
              : undefined,
          clientKey: String(block.id),
          file: pendingFiles[block.id],
        })),
      });

      persist({
        ...store,
        blocksByPage: {
          ...store.blocksByPage,
          [selectedPageId]: saved,
        },
      });
      setPendingFiles({});
      setIsDirty(false);
      toast.success(t('courses.builder.toast.saved'));
      return true;
    } catch {
      return false;
    }
  }, [
    getBlocks,
    pendingFiles,
    persist,
    selectedPageId,
    store,
    t,
    upsertContentMutation,
  ]);

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
      isDirty,
      isSaving: upsertContentMutation.isPending,
      setSidebarTab,
      setIsTeacherView,
      setActiveBlockId,
      selectSection,
      selectPage,
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
      setBlockPendingFile,
      savePageContent,
      dismissOnboarding,
    }),
    [
      activeBlockId,
      addBlock,
      addPage,
      addSection,
      courseId,
      deleteBlock,
      deletePage,
      deleteSection,
      dismissOnboarding,
      duplicateBlock,
      getBlocks,
      getPages,
      isDirty,
      isTeacherView,
      onboardingDismissed,
      reorderBlocks,
      savePageContent,
      selectPage,
      selectSection,
      selectedPageId,
      selectedSectionId,
      setBlockPendingFile,
      sidebarTab,
      store.sections,
      updateBlock,
      updatePageName,
      updateSectionName,
      upsertContentMutation.isPending,
    ],
  );

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const ctx = useContext(BuilderContext);
  if (!ctx) {
    throw new Error('useBuilder must be used within BuilderProvider');
  }
  return ctx;
};
