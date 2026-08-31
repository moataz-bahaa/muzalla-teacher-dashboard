import { useDrawerAction } from '@/components/drawer-views/context';
import SearchInput from '@/components/form/search-input';
import { PageBreadcrumb } from '@/components/page-breadcrumb';
import { useModalAction } from '@/components/modal-views/context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Pagination from '@/components/ui/pagination';
import Table from '@/components/ui/table';
import type { ICourseViewModalData } from '@/features/courses/components/course/course-view-modal';
import { ALL_MOCK_COURSES } from '@/features/courses/data/mock-courses';
import { useColumnConfig } from '@/hooks/use-column-config';
import { useFilter } from '@/hooks/use-filter';
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';
import type { ICourse, IGetCoursesParams } from '@/types/course';
import { type ColumnDef } from '@tanstack/react-table';
import {
  ArrowRightLeft,
  ArrowUpDown,
  CalendarDays,
  ExternalLink,
  Eye,
  ListFilter,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

export const CoursesPage: React.FC = () => {
  const { t } = useTranslation();
  const { openDrawer } = useDrawerAction();
  const { openModal } = useModalAction();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filter = useFilter<IGetCoursesParams>({
    keywords: '',
    tags: [],
    priceFrom: 0,
    priceTo: 10000,
    search: '',
    page: 1,
  });

  const filteredCourses = useMemo(() => {
    return ALL_MOCK_COURSES.filter((course) => {
      const { keywords, tags, priceFrom, priceTo, search } = filter.filters;

      if (keywords) {
        const q = keywords.toLowerCase();
        const haystack =
          `${course.title} ${course.description} ${course.tags.join(' ')}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (search) {
        const q = search.toLowerCase();
        const haystack =
          `${course.title} ${course.subject} ${course.instructor} ${course.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (tags.length > 0 && !tags.some((tag) => course.tags.includes(tag))) {
        return false;
      }

      if (course.price < priceFrom || course.price > priceTo) {
        return false;
      }

      return true;
    });
  }, [filter.filters]);

  const page = filter.filters.page ?? 1;
  const paginatedCourses = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredCourses.slice(start, start + PAGE_SIZE);
  }, [filteredCourses, page]);

  const openViewModal = (course: ICourse, initialTab?: 'details' | 'curriculum') => {
    openModal('COURSE_VIEW', {
      course,
      initialTab,
    } satisfies ICourseViewModalData);
  };

  const onDelete = (course: ICourse) => {
    openModal('DELETE_OBJECT', {
      object: 'course',
      id: course.id,
      title: t('courses.delete.title'),
      description: t('courses.delete.description', { title: course.title }),
      onSuccess() {
        toast.success(t('courses.toast.deleted', { title: course.title }));
      },
    });
  };

  const allSelected =
    paginatedCourses.length > 0 &&
    paginatedCourses.every((course) => selectedIds.includes(course.id));

  const toggleAll = (checked: boolean) => {
    setSelectedIds(
      checked ? paginatedCourses.map((course) => course.id) : [],
    );
  };

  const toggleOne = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id),
    );
  };

  const columns = useMemo<ColumnDef<ICourse>[]>(
    () => [
      {
        id: 'select',
        size: 56,
        enableSorting: false,
        header: () => (
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => toggleAll(checked === true)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedIds.includes(row.original.id)}
            onCheckedChange={(checked) =>
              toggleOne(row.original.id, checked === true)
            }
          />
        ),
      },
      {
        id: 'cover',
        accessorKey: 'coverUrl',
        size: 100,
        enableSorting: false,
        header: t('courses.columns.cover'),
        cell: ({ row }) => (
          <Avatar size='sm' className='mx-auto rounded-md'>
            <AvatarImage src={row.original.coverUrl} alt={row.original.title} />
            <AvatarFallback className='rounded-md'>
              {row.original.title.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        ),
      },
      {
        accessorKey: 'title',
        size: 180,
        header: t('courses.columns.title'),
        cell: ({ row }) => (
          <span className='text-neutral-800'>{row.original.title}</span>
        ),
      },
      {
        accessorKey: 'subject',
        size: 120,
        header: t('courses.columns.subject'),
      },
      {
        accessorKey: 'instructor',
        size: 160,
        header: t('courses.columns.instructor'),
      },
      {
        accessorKey: 'description',
        size: 280,
        header: t('courses.columns.description'),
        cell: ({ row }) => (
          <span className='line-clamp-2 text-neutral-600'>
            {row.original.description}
          </span>
        ),
      },
      {
        accessorKey: 'price',
        size: 100,
        header: t('courses.columns.price'),
        cell: ({ row }) => (
          <span className='text-neutral-800'>
            {row.original.price}
            {row.original.currency}
          </span>
        ),
      },
      {
        accessorKey: 'academicYear',
        size: 180,
        header: t('courses.columns.academicYear'),
      },
      {
        id: 'actions',
        size: 80,
        enableSorting: false,
        header: t('courses.columns.actions'),
        cell: ({ row }) => {
          const course = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type='button'
                  className={cn(
                    'flex size-8 items-center justify-center rounded-lg text-neutral-500',
                    'hover:bg-neutral-100 hover:text-neutral-800',
                  )}
                >
                  <MoreHorizontal className='size-5' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' className='min-w-48'>
                <DropdownMenuItem onClick={() => openViewModal(course)}>
                  <Eye className='size-4' />
                  {t('courses.actions.view')}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={routes.courseBuilder(course.id)}>
                    <Pencil className='size-4' />
                    {t('courses.actions.edit')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant='destructive'
                  onClick={() => onDelete(course)}
                >
                  <Trash2 className='size-4' />
                  {t('courses.actions.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t, selectedIds, allSelected],
  );

  const { visibleColumns, openConfigModal } = useColumnConfig('courses', columns);

  const applyDrawerFilters = (next: IGetCoursesParams) => {
    filter.onChange('keywords', next.keywords);
    filter.onChange('tags', next.tags);
    filter.onChange('priceFrom', next.priceFrom);
    filter.onChange('priceTo', next.priceTo);
    filter.onChange('page', 1);
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-wrap items-center gap-3'>
          <h1 className='font-heading text-4xl font-bold text-purple-heart-950'>
            {t('courses.listTitle')}
          </h1>
          <div className='grow' />

          <Button
            asChild
            className='h-11 gap-2 rounded-lg bg-purple-heart-900 px-5 hover:bg-purple-heart-800'
          >
            <Link to={routes.courseNew}>
              {t('courses.add')}
              <Plus className='size-4' />
            </Link>
          </Button>

          <Button
            variant='outline'
            className='h-11 gap-2 rounded-lg border-purple-heart-300 bg-white px-5 text-purple-heart-800'
            onClick={() => toast.success(t('courses.toast.exported'))}
          >
            {t('courses.export')}
            <ExternalLink className='size-3.5' />
          </Button>
        </div>

        <PageBreadcrumb
          items={[
            { label: t('dashboard.home'), to: routes.home },
            { label: t('courses.listTitle') },
          ]}
        />
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <Button variant='filter' size='xl'>
          {t('courses.selectPeriod')}
          <CalendarDays className='size-4' />
        </Button>
        <Button variant='filter' size='xl' onClick={() => {}}>
          {t('courses.sortBy')}
          <ArrowUpDown className='size-4' />
        </Button>
        <Button
          variant='filter'
          size='xl'
          onClick={() =>
            openDrawer('COURSE_FILTERS', {
              filters: {
                keywords: filter.filters.keywords,
                tags: filter.filters.tags,
                priceFrom: filter.filters.priceFrom,
                priceTo: filter.filters.priceTo,
              },
              onApply: applyDrawerFilters,
            })
          }
        >
          {t('courses.filter')}
          <ListFilter className='size-4' />
        </Button>
      </div>

      <div className='overflow-hidden rounded-2xl border border-neutral-200 shadow-sm'>
        <div className='flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 p-4'>
          <SearchInput
            value={filter.filters.search ?? ''}
            onChange={(event) => {
              filter.onChange('search', event.target.value);
              filter.onChange('page', 1);
            }}
            placeholder={t('courses.searchPlaceholder')}
          />
          <Button variant='filter' size='xl' onClick={openConfigModal}>
            {t('courses.arrangeColumns')}
            <ArrowRightLeft className='size-3.5' />
          </Button>
        </div>

        <Table
          columns={visibleColumns}
          data={paginatedCourses}
          syncOrderingToUrl={false}
          skeletonRowsLength={PAGE_SIZE}
          headerClassName='bg-neutral-100'
          cellClassName='align-middle'
        />

        <Pagination
          current={page}
          total={Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE))}
          onChange={(nextPage) => filter.onChange('page', nextPage)}
          className='border-t border-neutral-200 px-4 py-4'
        />
      </div>
    </div>
  );
};
