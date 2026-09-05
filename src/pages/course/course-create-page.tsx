import { FilesDropzone } from '@/components/files-dropzone';
import DraftIcon from '@/components/icons/draft-icon';
import { PageBreadcrumb } from '@/components/page-breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { CourseCard } from '@/features/courses/components/course/course-card';
import { useAddCourseMutation } from '@/lib/data/courses';
import { useTagsQuery } from '@/lib/data/tags';
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';
import type { ICourseCardPreview } from '@/features/courses/components/course/course-card';
import { ECourseStatus } from '@/types/page-block';
import { ChevronRight, ImagePlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const CourseCreatePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tags: availableTags } = useTagsQuery();

  const [name, setName] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [description, setDescription] = useState('');
  const [durationInMinutes, setDurationInMinutes] = useState(60);
  const [hasCertificate, setHasCertificate] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'info' | 'curriculum'>('info');

  const addMutation = useAddCourseMutation({
    onSuccess: (response) => {
      const courseId = response.data;
      if (typeof courseId === 'number' && courseId > 0) {
        void navigate(routes.courseBuilder(courseId));
      } else {
        void navigate(routes.courses);
      }
    },
  });

  const selectedTags = useMemo(
    () => availableTags.filter((tag) => selectedTagIds.includes(tag.id)),
    [availableTags, selectedTagIds],
  );

  const previewCourse = useMemo<ICourseCardPreview>(
    () => ({
      id: 0,
      name: name || t('courses.create.titlePlaceholder'),
      description:
        description || t('courses.create.descriptionPlaceholder'),
      coverUrl:
        coverPreviewUrl ||
        'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80',
      tags: selectedTags,
    }),
    [coverPreviewUrl, description, name, selectedTags, t],
  );

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const onSave = (asDraft: boolean) => {
    if (!name.trim()) {
      toast.error(t('courses.create.nameRequired'));
      return;
    }
    if (!coverFile) {
      toast.error(t('courses.create.coverRequired'));
      return;
    }
    if (durationInMinutes < 1) {
      toast.error(t('courses.create.durationRequired'));
      return;
    }

    addMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      durationInMinutes,
      tags: selectedTagIds,
      cover: coverFile,
      image: coverFile,
      hasCertificate,
      status: asDraft ? ECourseStatus.Draft : ECourseStatus.Published,
    });
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center gap-3'>
          <h1 className='font-heading text-3xl font-bold text-purple-heart-950 sm:text-4xl'>
            {t('courses.title')}
          </h1>
          <div className='grow'></div>
          <Button
            className='h-12 gap-2 rounded-lg bg-purple-heart-900 px-8 hover:bg-purple-heart-800'
            onClick={() => onSave(false)}
            isLoading={addMutation.isPending}
          >
            {t('courses.create.saveContinue')}
            <ChevronRight className='size-6' />
          </Button>
          <Button
            variant='outline'
            className='h-12 gap-2 rounded-lg border-neutral-200 bg-white px-8 text-neutral-700'
            onClick={() => onSave(true)}
            disabled={addMutation.isPending}
          >
            {t('courses.create.saveDraft')}
            <DraftIcon className='size-6' />
          </Button>
        </div>
        <PageBreadcrumb
          items={[
            { label: t('dashboard.home'), to: routes.home },
            { label: t('courses.listTitle'), to: routes.courses },
            { label: t('courses.create.breadcrumb') },
          ]}
        />
      </div>

      <div className='grid grid-cols-1 gap-6 xl:-ms-10 xl:grid-cols-[464px_minmax(0,1fr)_340px]'>
        <aside className='rounded-2xl border border-neutral-200 bg-white p-4'>
          <div className='mb-6 flex items-center gap-2 rounded-lg bg-purple-heart-100 p-1.5'>
            <button
              type='button'
              onClick={() => setPreviewTab('info')}
              className={cn(
                'grow text-sm',
                previewTab === 'info'
                  ? 'rounded-lg bg-white py-1 font-medium text-purple-heart-800'
                  : 'text-neutral-500',
              )}
            >
              {t('courses.create.infoTab')}
            </button>
            <button
              type='button'
              onClick={() => setPreviewTab('curriculum')}
              className={cn(
                'grow text-sm',
                previewTab === 'curriculum'
                  ? 'rounded-lg bg-white py-1 font-medium text-purple-heart-800'
                  : 'text-neutral-500',
              )}
            >
              {t('courses.create.curriculumTab')}
            </button>
          </div>
          <h3 className='mb-3 font-medium text-neutral-800'>
            {t('courses.create.cardPreview')}
          </h3>
          {previewTab === 'info' ? (
            <CourseCard course={previewCourse} compact />
          ) : (
            <div className='rounded-xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500'>
              {t('courses.create.curriculumEmpty')}
            </div>
          )}
          <Button asChild variant='outline' className='mt-4 w-full'>
            <Link to={routes.courses}>{t('courses.create.backToList')}</Link>
          </Button>
        </aside>

        <div className='flex flex-col gap-5'>
          <section className='rounded-2xl border border-neutral-200 bg-white p-5'>
            <div className='flex flex-col gap-5'>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>
                  {t('courses.create.courseTitle')}
                </label>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className='h-12 rounded-lg'
                  placeholder={t('courses.create.titlePlaceholder')}
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>
                  {t('courses.create.keywords')}
                </label>
                {availableTags.length === 0 ? (
                  <p className='text-sm text-neutral-500'>
                    {t('courses.create.noTags')}
                  </p>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {availableTags.map((tag) => {
                      const selected = selectedTagIds.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type='button'
                          onClick={() => toggleTag(tag.id)}
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                            selected
                              ? 'bg-purple-heart-800 text-white'
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
                          )}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>
                  {t('courses.create.duration')}
                </label>
                <Input
                  type='number'
                  min={1}
                  value={durationInMinutes}
                  onChange={(event) =>
                    setDurationInMinutes(Number(event.target.value) || 0)
                  }
                  className='h-12 rounded-lg'
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium'>
                  {t('courses.create.description')}
                </label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={t('courses.create.descriptionPlaceholder')}
                  className='min-h-35 rounded-lg'
                />
              </div>

              <div className='flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-4 py-3'>
                <span className='text-sm font-medium'>
                  {t('courses.create.hasCertificate')}
                </span>
                <Switch
                  checked={hasCertificate}
                  onCheckedChange={setHasCertificate}
                  className='data-checked:bg-purple-heart-600'
                />
              </div>
            </div>
          </section>
        </div>

        <div className='flex flex-col gap-5'>
          <div
            className='rounded-2xl bg-white px-4 py-7'
            style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.10)' }}
          >
            <h3 className='text-base font-medium'>
              {t('courses.create.cover')}
            </h3>
            <FilesDropzone
              className='mt-6'
              accept={'image/*'}
              hint={t('courses.create.coverHint')}
              maxFileSize={20 * 1024 * 1024}
              value={coverFile}
              onChange={(file) => {
                if (!file) {
                  setCoverFile(null);
                  setCoverPreviewUrl(null);
                  return;
                }
                if (file.size > 20 * 1024 * 1024) {
                  toast.error(t('courses.create.coverTooLarge'));
                  return;
                }
                setCoverFile(file);
                setCoverPreviewUrl(URL.createObjectURL(file));
              }}
              emptyIcon={
                <ImagePlus className='size-12 text-purple-heart-700' />
              }
              validateFile={(selectedFile) =>
                selectedFile.type.startsWith('image/')
                  ? null
                  : t('courses.create.coverInvalidType')
              }
              onValidationError={(message) => toast.error(message)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
