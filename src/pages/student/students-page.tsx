import { useDrawerAction } from '@/components/drawer-views/context';
import SearchInput from '@/components/form/search-input';
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
import { Switch } from '@/components/ui/switch';
import Table from '@/components/ui/table';
import type { IEditStudentModalData } from '@/features/students/components/edit-student-modal';
import { StudentPasswordCell } from '@/features/students/components/student-password-cell';
import { MOCK_STUDENTS } from '@/features/students/data/mock-students';
import { useColumnConfig } from '@/hooks/use-column-config';
import { useFilter } from '@/hooks/use-filter';
import { cn } from '@/lib/utils';
import type { IGetStudentsParams, IStudent } from '@/types/student';
import { type ColumnDef } from '@tanstack/react-table';
import {
  ArrowRightLeft,
  ArrowUpDown,
  CalendarDays,
  ChevronDown,
  ExternalLink,
  Eye,
  FileUp,
  ListFilter,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const PAGE_SIZE = 8;

export const StudentsPage: React.FC = () => {
  const { t } = useTranslation();
  const { openDrawer } = useDrawerAction();
  const { openModal } = useModalAction();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const filter = useFilter<IGetStudentsParams>({
    status: 'all',
    academicYear: 'all',
  });

  const [students] = useState<IStudent[]>(MOCK_STUDENTS);

  const openAddModal = () => {
    openModal('ADD_STUDENT');
  };

  const openEditModal = (student: IStudent) => {
    openModal('EDIT_STUDENT', {
      student,
    } as IEditStudentModalData);
  };

  const onStatusChange = (_id: number, _active: boolean) => {
    // TODO handle status change
    toast.success(t('students.toast.statusUpdated'));
  };

  const onDelete = (student: IStudent) => {
    openModal('DELETE_OBJECT', {
      object: 'student',
      id: student.id,
      title: t('students.delete.title'),
      description: t('students.delete.description', {
        name: student.name,
      }),
      onSuccess() {},
    });
  };

  const allSelected =
    students.length > 0 &&
    students.every((student) => selectedIds.includes(student.id));

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? students.map((student) => student.id) : []);
  };

  const toggleOne = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id),
    );
  };

  const columns = useMemo<ColumnDef<IStudent>[]>(
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
        id: 'avatar',
        accessorKey: 'avatarUrl',
        size: 140,
        enableSorting: false,
        header: t('students.columns.avatar'),
        cell: ({ row }) => (
          <Avatar size='sm' className='mx-auto'>
            <AvatarImage src={row.original.avatarUrl} alt={row.original.name} />
            <AvatarFallback>{row.original.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
        ),
      },
      {
        accessorKey: 'name',
        size: 180,
        header: t('students.columns.name'),
        cell: ({ row }) => (
          <span className='text-neutral-800'>{row.original.name}</span>
        ),
      },
      {
        accessorKey: 'email',
        size: 200,
        header: t('students.columns.email'),
      },
      {
        accessorKey: 'phone',
        size: 140,
        enableSorting: false,
        header: t('students.columns.phone'),
      },
      {
        accessorKey: 'password',
        size: 160,
        enableSorting: false,
        header: t('students.columns.password'),
        cell: ({ row }) => (
          <StudentPasswordCell password={row.original.password} />
        ),
      },
      {
        id: 'status',
        accessorKey: 'active',
        size: 100,
        enableSorting: false,
        header: t('students.columns.status'),
        cell: ({ row }) => (
          <Switch
            checked={row.original.active}
            onCheckedChange={(checked) =>
              onStatusChange(row.original.id, checked)
            }
            className='data-checked:bg-purple-heart-600'
          />
        ),
      },
      {
        accessorKey: 'academicYear',
        size: 180,
        header: t('students.columns.academicYear'),
        cell: ({ row }) => (
          <span className='text-neutral-700'>
            {t(`students.academicYears.${row.original.academicYear}`)}
          </span>
        ),
      },

      {
        id: 'actions',
        size: 80,
        enableSorting: false,
        header: t('students.columns.actions'),
        cell: ({ row }) => {
          const student = row.original;
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
              <DropdownMenuContent align='end' className='min-w-56'>
                <DropdownMenuItem
                  onClick={() => openDrawer('STUDENT_PROFILE', { student })}
                >
                  <Eye className='size-4' />
                  {t('students.actions.viewProfile')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openEditModal(student)}>
                  <Pencil className='size-4' />
                  {t('students.actions.edit')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant='destructive'
                  onClick={() => onDelete(student)}
                >
                  <Trash2 className='size-4' />
                  {t('students.actions.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t, selectedIds, allSelected],
  );

  const { visibleColumns, openConfigModal } = useColumnConfig(
    'students',
    columns,
  );

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-center gap-3'>
        <h1 className='font-heading text-4xl font-bold text-purple-heart-950'>
          {t('students.title')}
        </h1>
        <div className='grow' />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='h-11 gap-2 rounded-lg bg-purple-heart-900 px-5 hover:bg-purple-heart-800'>
              {t('students.add')}
              <ChevronDown className='size-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='min-w-48'>
            <DropdownMenuItem onClick={() => openAddModal()}>
              <UserPlus className='size-4' />
              {t('students.actions.addManual')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                openModal('IMPORT_STUDENTS', {
                  onImported: (_imported: IStudent[]) => {
                    // TODO
                  },
                })
              }
            >
              <FileUp className='size-4' />
              {t('students.actions.import')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant='outline'
          className='h-11 gap-2 rounded-lg border-purple-heart-300 bg-white px-5 text-purple-heart-800'
          onClick={() => toast.success(t('students.toast.exported'))}
        >
          {t('students.export')}
          <ExternalLink className='size-3.5' />
        </Button>
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <Button variant='filter' size='xl'>
          {t('students.selectPeriod')}
          <CalendarDays className='size-4' />
        </Button>
        <Button variant='filter' size='xl' onClick={() => {}}>
          {t('students.sortBy')}
          <ArrowUpDown className='size-4' />
        </Button>
        <Button
          variant='filter'
          size='xl'
          onClick={() =>
            openDrawer('STUDENT_FILTERS', {
              filters: filter.filters,
              onApply: (next: IGetStudentsParams) => {
                filter.onChange('status', next.status);
                filter.onChange('academicYear', next.academicYear);
              },
            })
          }
        >
          {t('students.filter')}
          <ListFilter className='size-4' />
        </Button>
      </div>

      <div className='overflow-hidden rounded-2xl border border-neutral-200 shadow-sm'>
        <div className='flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 p-4'>
          <SearchInput
            value={filter.filters.search}
            onChange={(event) => {
              filter.onChange('search', event.target.value);
            }}
            placeholder={t('students.searchPlaceholder')}
          />
          <Button variant='filter' size='xl' onClick={openConfigModal}>
            {t('students.arrangeColumns')}
            <ArrowRightLeft className='size-3.5' />
          </Button>
        </div>

        <Table
          columns={visibleColumns}
          data={students}
          syncOrderingToUrl={false}
          skeletonRowsLength={PAGE_SIZE}
          headerClassName='bg-neutral-100'
          cellClassName='align-middle'
        />

        <Pagination
          current={filter.filters.page ?? 1}
          total={Math.ceil(students.length / PAGE_SIZE)}
          onChange={(page) => filter.onChange('page', page)}
          className='border-t border-neutral-200 px-4 py-4'
        />
      </div>
    </div>
  );
};
