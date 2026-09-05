import { useDrawerState } from '@/components/drawer-views/context';
import DrawerContent from '@/components/drawer-views/drawer-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStudentQuery } from '@/lib/data/students';
import type { IStudent } from '@/types/student';
import { CircleUserRound, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const StudentProfileDrawer: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useDrawerState<{ student?: IStudent }>();
  const studentId = data?.student?.id ?? 0;
  const { student, isPending } = useStudentQuery(studentId);

  if (!student) return null;

  const name = student.firstName + ' ' + student.lastName;

  const enrolledCourses = student?.enrolledCourses ?? [];

  return (
    <DrawerContent className='w-112.5' applyGrow={false}>
      <div className='flex flex-col items-center gap-3'>
        <Avatar className='size-24'>
          <AvatarImage src={student.profileImage ?? undefined} alt={name} />
          <AvatarFallback className='text-4xl'>
            {name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <h3 className='font-heading text-3xl font-medium text-black'>{name}</h3>
      </div>

      <div className='flex-1 overflow-y-auto px-6'>
        <div className='flex flex-col gap-3'>
          <ProfileField
            label={t('students.columns.name')}
            icon={<CircleUserRound className='size-6 text-neutral-500' />}
            value={name}
          />
          <ProfileField
            label={t('students.columns.username')}
            icon={<Mail className='size-6 text-neutral-500' />}
            value={student.username}
          />
          <ProfileField
            label={t('students.columns.phone')}
            icon={<Phone className='size-6 text-neutral-500' />}
            value={student.phoneNumber ?? ''}
          />
        </div>

        <div className='mt-8'>
          <h4 className='mb-4 text-3xl font-medium text-black'>
            {t('students.profile.enrolledCourses')}
          </h4>
          {isPending ? (
            <p className='text-sm text-neutral-500'>{t('common.loading')}</p>
          ) : enrolledCourses.length === 0 ? (
            <p className='text-sm text-neutral-500'>
              {t('students.profile.noCourses')}
            </p>
          ) : (
            <div className='flex flex-col gap-3'>
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className='rounded-xl border border-neutral-200 bg-white p-4'
                >
                  <p className='text-sm font-medium text-neutral-800'>
                    {course.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DrawerContent>
  );
};

interface IProfileFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
}

const ProfileField: React.FC<IProfileFieldProps> = ({ label, icon, value }) => {
  return (
    <div className='flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2'>
      {icon}
      <p className='text-sm text-neutral-800'>{label}</p>
      <div className='grow'></div>
      <p className='text-sm text-neutral-800'>{value}</p>
    </div>
  );
};
