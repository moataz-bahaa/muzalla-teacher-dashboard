import { useMutation, type UseMutationProps } from '@/hooks/use-mutation';
import { client } from '@/lib/data/client';
import { API_ENDPOINTS } from '@/lib/data/client/endpoints';
import type { ICourse, IUpdateCourseInput } from '@/types/course';
import type {
  ICreatePageInput,
  IPage,
  IReorderPageItem,
  IUpdatePageInput,
} from '@/types/page';
import type {
  ICreatePageBlocksInput,
  IPageBlock,
  IReorderPageBlockItem,
  IUpdatePageBlocksInput,
} from '@/types/page-block';
import type {
  ICreateSectionInput,
  IReorderSectionItem,
  ISection,
  IUpdateSectionInput,
} from '@/types/section';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export const useCourseQuery = (courseId: number) =>
  useQuery({
    queryKey: [API_ENDPOINTS.courses, courseId],
    queryFn: async () => {
      const res = await client.courses.getById(courseId);
      return res.data as ICourse;
    },
    enabled: courseId > 0,
  });

export const useSectionsQuery = (courseId: number) =>
  useQuery({
    queryKey: [API_ENDPOINTS.sections, courseId],
    queryFn: async () => {
      const res = await client.sections.getAll(courseId);
      return (res.data ?? []) as ISection[];
    },
    enabled: courseId > 0,
  });

export const usePagesQuery = (sectionId: number | null) =>
  useQuery({
    queryKey: [API_ENDPOINTS.pages, sectionId],
    queryFn: async () => {
      const res = await client.pages.getAll(sectionId!);
      return (res.data ?? []) as IPage[];
    },
    enabled: Boolean(sectionId),
  });

export const usePageBlocksQuery = (pageId: number | null) =>
  useQuery({
    queryKey: [API_ENDPOINTS.pageBlocks, pageId],
    queryFn: async () => {
      const res = await client.pageBlocks.getAll(pageId!);
      return (res.data ?? []) as IPageBlock[];
    },
    enabled: Boolean(pageId),
  });

export const useUpdateCourseMutation = (
  options?: Omit<
    UseMutationProps<ICourse, IUpdateCourseInput>,
    'mutationKey' | 'mutationFn' | 'invalidateQueryFilter'
  >,
) => {
  const { t } = useTranslation();

  return useMutation({
    mutationKey: [API_ENDPOINTS.courses, 'update'],
    mutationFn: async (input: IUpdateCourseInput) => {
      const res = await client.courses.update(input);
      return res.data as ICourse;
    },
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.courses] },
    ...options,
    onSuccess(data, variables, onMutateResult, context) {
      toast.success(t('courses.builder.toast.saved'));
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError(error) {
      toast.error(error.message || t('courses.builder.toast.saveError'));
    },
  });
};

export const useCreateSectionMutation = (courseId: number) => {
  const { t } = useTranslation();

  return useMutation({
    mutationKey: [API_ENDPOINTS.sections, 'create', courseId],
    mutationFn: async (input: Omit<ICreateSectionInput, 'courseId'>) => {
      const res = await client.sections.create({ ...input, courseId });
      return res.data as number;
    },
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.sections, courseId] },
    onSuccess() {
      toast.success(t('courses.builder.toast.sectionCreated'));
    },
    onError(error) {
      toast.error(error.message || t('courses.builder.toast.saveError'));
    },
  });
};

export const useUpdateSectionMutation = (courseId: number) =>
  useMutation({
    mutationKey: [API_ENDPOINTS.sections, 'update', courseId],
    mutationFn: async (input: IUpdateSectionInput) => {
      const res = await client.sections.update(input);
      return res.data as ISection;
    },
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.sections, courseId] },
  });

export const useDeleteSectionMutation = (courseId: number) => {
  const { t } = useTranslation();

  return useMutation({
    mutationKey: [API_ENDPOINTS.sections, 'delete', courseId],
    mutationFn: (id: number) => client.sections.delete(id),
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.sections, courseId] },
    onSuccess() {
      toast.success(t('courses.builder.toast.sectionDeleted'));
    },
  });
};

export const useReorderSectionsMutation = (courseId: number) =>
  useMutation({
    mutationKey: [API_ENDPOINTS.sections, 'reorder', courseId],
    mutationFn: (items: IReorderSectionItem[]) =>
      client.sections.reorder(courseId, items),
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.sections, courseId] },
  });

export const useCreatePageMutation = (sectionId: number) => {
  const { t } = useTranslation();

  return useMutation({
    mutationKey: [API_ENDPOINTS.pages, 'create', sectionId],
    mutationFn: async (input: Omit<ICreatePageInput, 'sectionId'>) => {
      const res = await client.pages.create({ ...input, sectionId });
      return res.data as number;
    },
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.pages, sectionId] },
    onSuccess() {
      toast.success(t('courses.builder.toast.pageCreated'));
    },
  });
};

export const useUpdatePageMutation = (sectionId: number) =>
  useMutation({
    mutationKey: [API_ENDPOINTS.pages, 'update', sectionId],
    mutationFn: async (input: IUpdatePageInput) => {
      const res = await client.pages.update(input);
      return res.data as IPage;
    },
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.pages, sectionId] },
  });

export const useDeletePageMutation = (sectionId: number) => {
  const { t } = useTranslation();

  return useMutation({
    mutationKey: [API_ENDPOINTS.pages, 'delete', sectionId],
    mutationFn: (id: number) => client.pages.delete(id),
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.pages, sectionId] },
    onSuccess() {
      toast.success(t('courses.builder.toast.pageDeleted'));
    },
  });
};

export const useReorderPagesMutation = (sectionId: number) =>
  useMutation({
    mutationKey: [API_ENDPOINTS.pages, 'reorder', sectionId],
    mutationFn: (items: IReorderPageItem[]) =>
      client.pages.reorder(sectionId, items),
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.pages, sectionId] },
  });

export const useCreatePageBlocksMutation = (pageId: number) => {
  const { t } = useTranslation();

  return useMutation({
    mutationKey: [API_ENDPOINTS.pageBlocks, 'create', pageId],
    mutationFn: (input: Omit<ICreatePageBlocksInput, 'pageId'>) =>
      client.pageBlocks.create({ ...input, pageId }),
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.pageBlocks, pageId] },
    onError(error) {
      toast.error(error.message || t('courses.builder.toast.saveError'));
    },
  });
};

export const useUpdatePageBlocksMutation = (pageId: number) =>
  useMutation({
    mutationKey: [API_ENDPOINTS.pageBlocks, 'update', pageId],
    mutationFn: (input: IUpdatePageBlocksInput) =>
      client.pageBlocks.update(input),
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.pageBlocks, pageId] },
  });

export const useDeletePageBlockMutation = (pageId: number) =>
  useMutation({
    mutationKey: [API_ENDPOINTS.pageBlocks, 'delete', pageId],
    mutationFn: (id: number) => client.pageBlocks.delete(id),
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.pageBlocks, pageId] },
  });

export const useReorderPageBlocksMutation = (pageId: number) =>
  useMutation({
    mutationKey: [API_ENDPOINTS.pageBlocks, 'reorder', pageId],
    mutationFn: (items: IReorderPageBlockItem[]) =>
      client.pageBlocks.reorder(pageId, items),
    invalidateQueryFilter: { queryKey: [API_ENDPOINTS.pageBlocks, pageId] },
  });
