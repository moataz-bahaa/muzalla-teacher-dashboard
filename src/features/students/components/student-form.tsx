import { FilesUpload } from '@/components/files-upload';
import { Input } from '@/components/ui/form/input';
import { PasswordInput } from '@/components/ui/form/password-input';
import { localizedJoiResolver } from '@/lib/localized-joi-resolver';
import type { ICreateStudentInput } from '@/types/student';
import Joi from 'joi';
import { UserRound } from 'lucide-react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export interface IStudentFormProps {
  id: string;
  title: string;
  mode?: 'create' | 'edit';
  initialValues?: Partial<ICreateStudentInput> & { avatarUrl?: string };
  onSubmit: SubmitHandler<ICreateStudentInput>;
}

export const StudentForm: React.FC<IStudentFormProps> = ({
  id,
  title,
  mode = 'create',
  initialValues,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const isEdit = mode === 'edit';

  const schema = Joi.object<ICreateStudentInput>({
    firstName: Joi.string().min(2).required().label('students.addModal.firstName'),
    lastName: Joi.string().min(2).required().label('students.addModal.lastName'),
    username: Joi.string().min(3).required().label('students.addModal.username'),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]\d{8,14}$/)
      .required()
      .label('students.addModal.phoneNumber'),
    password: isEdit
      ? Joi.string().allow('').optional().label('students.addModal.password')
      : Joi.string().min(6).required().label('students.addModal.password'),
    imageProfile: Joi.any().allow(null),
  });

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<ICreateStudentInput>({
    resolver: localizedJoiResolver(schema),
    defaultValues: {
      firstName: initialValues?.firstName ?? '',
      lastName: initialValues?.lastName ?? '',
      username: initialValues?.username ?? '',
      phoneNumber: initialValues?.phoneNumber ?? '',
      password: initialValues?.password ?? '',
      imageProfile: initialValues?.imageProfile ?? null,
    },
  });

  const imageProfile = useWatch({ control, name: 'imageProfile' });

  return (
    <form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      encType='multipart/form-data'
      noValidate
    >
      <div className='mb-10 flex items-center justify-between gap-4'>
        <h2 className='font-heading text-6xl font-bold text-purple-heart-950'>
          {title}
        </h2>
        <FilesUpload
          label={t('students.addModal.photo')}
          hint={t('students.addModal.photoHint')}
          value={imageProfile}
          previewUrl={initialValues?.avatarUrl}
          onChange={(file) =>
            setValue('imageProfile', file, { shouldValidate: true })
          }
          error={errors.imageProfile?.message}
        />
      </div>
      <div className='mb-10 flex border-b border-neutral-200'>
        <div className='flex items-center gap-2 border-b-2 border-purple-heart-700 px-1 pb-3 text-sm font-semibold text-purple-heart-800'>
          <UserRound className='size-4' />
          {t('students.addModal.tab')}
        </div>
      </div>

      <div className='grid max-w-180 gap-10 lg:grid-cols-2'>
        <Input
          label={t('students.addModal.firstName')}
          placeholder={t('students.addModal.firstNamePlaceholder')}
          className='h-11 rounded-lg'
          {...register('firstName')}
          error={errors.firstName?.message}
        />
        <Input
          label={t('students.addModal.lastName')}
          placeholder={t('students.addModal.lastNamePlaceholder')}
          className='h-11 rounded-lg'
          {...register('lastName')}
          error={errors.lastName?.message}
        />
        <Input
          label={t('students.addModal.username')}
          placeholder={t('students.addModal.usernamePlaceholder')}
          className='h-11 rounded-lg'
          {...register('username')}
          error={errors.username?.message}
        />
        <Input
          label={t('students.addModal.phoneNumber')}
          type='tel'
          placeholder={t('students.addModal.phoneNumberPlaceholder')}
          className='h-11 rounded-lg'
          {...register('phoneNumber')}
          error={errors.phoneNumber?.message}
        />
        {!isEdit && (
          <PasswordInput
            label={t('students.addModal.password')}
            placeholder={t('students.addModal.password')}
            className='h-11 rounded-lg'
            {...register('password')}
            error={errors.password?.message}
          />
        )}
      </div>
    </form>
  );
};
