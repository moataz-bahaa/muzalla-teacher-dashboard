import { useDrawerState } from '@/components/drawer-views/context';
import DrawerContent from '@/components/drawer-views/drawer-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import type { IStudent } from '@/types/student';
import { CircleUserRound, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const StudentProfileDrawer: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useDrawerState<{ student?: IStudent }>();
  const student = data?.student;

  if (!student) return null;

  return (
    <DrawerContent className='w-112.5' applyGrow={false}>
      <div className='flex flex-col items-center gap-3'>
        <Avatar className='size-24'>
          <AvatarImage src={student.avatarUrl} alt={student.name} />
          <AvatarFallback className='text-4xl'>
            {student.name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <h3 className='font-heading text-3xl font-medium text-black'>
          {student.name}
        </h3>
      </div>

      <div className='flex-1 overflow-y-auto px-6'>
        <div className='flex flex-col gap-3'>
          <ProfileField
            label={t('students.columns.name')}
            icon={<CircleUserRound className='size-6 text-neutral-500' />}
            value={student.name}
          />
          <ProfileField
            label={t('students.columns.email')}
            icon={<Mail className='size-6 text-neutral-500' />}
            value={student.email}
          />
          <ProfileField
            label={t('students.columns.phone')}
            icon={<Phone className='size-6 text-neutral-500' />}
            value={student.phone}
          />
        </div>

        <div className='mt-8'>
          <h4 className='mb-4 text-3xl font-medium text-black'>
            {t('students.profile.enrolledCourses')}
          </h4>
          <div className='flex flex-col gap-3'>
            {student.enrolledCourses.map((course) => (
              <div
                key={course.id}
                className='rounded-xl border border-neutral-200 bg-white p-4'
              >
                <p className='mb-3 text-sm font-medium text-neutral-800'>
                  {course.title}
                </p>
                <div className='flex items-center gap-3'>
                  <Progress
                    value={course.progress}
                    className='h-2 flex-1 bg-purple-heart-100 [&_[data-slot=progress-indicator]]:bg-purple-heart-600'
                  />
                  <span className='text-sm font-semibold text-purple-heart-700'>
                    {course.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
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
