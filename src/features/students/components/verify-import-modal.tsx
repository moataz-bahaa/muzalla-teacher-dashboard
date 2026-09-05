import {
  useModalAction,
  useModalState,
} from '@/components/modal-views/context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, CloseButton } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import Table from '@/components/ui/table';
import type { IStudent } from '@/types/student';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface IVerifyImportModalData {
  students?: IStudent[];
  onConfirm?: (students: IStudent[]) => void;
}

const studentName = (student: IStudent) =>
  `${student.firstName} ${student.lastName}`.trim();

export const VerifyImportModal: React.FC = () => {
  const { t } = useTranslation();
  const { closeModal } = useModalAction();
  const { data } = useModalState<IVerifyImportModalData>();
  const [rows, setRows] = useState<IStudent[]>(data?.students ?? []);
  const [selectedIds, setSelectedIds] = useState<number[]>(
    (data?.students ?? []).map((student) => student.id),
  );

  const allSelected =
    rows.length > 0 && rows.every((row) => selectedIds.includes(row.id));

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? rows.map((row) => row.id) : []);
  };

  const toggleOne = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id),
    );
  };

  const onStatusChange = (id: number, isActive: boolean) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, isActive } : row)),
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
        accessorKey: 'profileImage',
        size: 140,
        enableSorting: false,
        header: t('students.columns.avatar'),
        cell: ({ row }) => (
          <Avatar size='sm' className='mx-auto'>
            <AvatarImage
              src={row.original.profileImage ?? undefined}
              alt={studentName(row.original)}
            />
            <AvatarFallback>
              {studentName(row.original).slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        ),
      },
      {
        id: 'name',
        size: 180,
        header: t('students.columns.name'),
        cell: ({ row }) => (
          <span className='text-neutral-800'>{studentName(row.original)}</span>
        ),
      },
      {
        accessorKey: 'username',
        size: 200,
        header: t('students.columns.username'),
      },
      {
        accessorKey: 'phoneNumber',
        size: 140,
        enableSorting: false,
        header: t('students.columns.phone'),
        cell: ({ row }) => (
          <span dir='ltr'>{row.original.phoneNumber}</span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'isActive',
        size: 100,
        enableSorting: false,
        header: t('students.columns.status'),
        cell: ({ row }) => (
          <Switch
            checked={row.original.isActive}
            onCheckedChange={(checked) =>
              onStatusChange(row.original.id, checked)
            }
            className='data-checked:bg-purple-heart-600'
          />
        ),
      },
      {
        accessorKey: 'levelName',
        size: 180,
        header: t('students.columns.academicYear'),
        cell: ({ row }) => (
          <span className='text-neutral-700'>
            {row.original.levelName || '—'}
          </span>
        ),
      },
    ],
    [t, selectedIds, allSelected],
  );

  const save = () => {
    const selected = rows.filter((row) => selectedIds.includes(row.id));
    data?.onConfirm?.(selected);
    toast.success(t('students.toast.imported'));
    closeModal();
  };

  return (
    <div className='relative max-w-full w-4xl rounded-2xl bg-white p-6 shadow-xl sm:p-8'>
      <CloseButton
        className='absolute top-4 ltr:right-4 rtl:left-4'
        onClick={closeModal}
      />
      <h2 className='font-heading text-2xl font-bold text-purple-heart-950'>
        {t('students.verifyModal.title')}
      </h2>
      <p className='mt-2 text-sm text-neutral-500'>
        {t('students.verifyModal.subtitle')}
      </p>

      <div className='mt-6 overflow-hidden rounded-xl border border-neutral-200'>
        <Table
          columns={columns}
          data={rows}
          syncOrderingToUrl={false}
          skeletonRowsLength={6}
        />
      </div>

      <div className='mt-8 btn-group'>
        <Button
          className='h-10 rounded-lg bg-purple-heart-900 px-8 hover:bg-purple-heart-800'
          onClick={save}
        >
          {t('students.verifyModal.save')}
        </Button>
        <Button
          variant='outline'
          className='h-10 rounded-lg border-neutral-200 px-8'
          onClick={closeModal}
        >
          {t('students.verifyModal.cancel')}
        </Button>
      </div>
    </div>
  );
};
