import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form/input';
import { Switch } from '@/components/ui/switch';
import { Tabs } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useCourseQuery } from '@/lib/data/course-builder';
import { ECourseStatus, EPageType } from '@/types/page-block';
import {
  ChevronDown,
  ClipboardCheck,
  FileText,
  PlayCircle,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBuilder, type TBuilderTab } from '../context/builder-context';

export const CurriculumSidebar: React.FC = () => {
  const { t } = useTranslation();
  const {
    courseId,
    sections,
    selectedSectionId,
    selectedPageId,
    sidebarTab,
    setSidebarTab,
    selectSection,
    selectPage,
    addSection,
    addPage,
    updateSectionName,
    updatePageName,
    getPages,
  } = useBuilder();

  const { data: course } = useCourseQuery(courseId);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>(
    {},
  );
  const [addOpen, setAddOpen] = useState(false);

  const tabs: { value: TBuilderTab; label: string }[] = [
    { value: 'curriculum', label: t('courses.builder.sidebar.curriculum') },
    { value: 'info', label: t('courses.builder.sidebar.info') },
  ];

  const toggleSection = (id: number) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSection = async () => {
    setAddOpen(false);
    await addSection();
  };

  const handleAddLesson = async () => {
    const sectionId = selectedSectionId ?? sections[0]?.id;
    if (!sectionId) return;
    setAddOpen(false);
    const pageId = await addPage(sectionId);
    selectPage(pageId, sectionId);
    setSidebarTab('curriculum');
  };

  return (
    <aside className='sticky top-10 flex h-full min-h-[815px] w-full flex-col rounded-s-xl border border-neutral-200 bg-white lg:w-[359px]'>
      <div className='p-4'>
        <Tabs
          variant='segmented'
          currentActive={sidebarTab}
          items={tabs}
          onChange={(value) => setSidebarTab(value as TBuilderTab)}
        />
      </div>

      <div className='flex-1 overflow-y-auto px-4 pb-4'>
        {sidebarTab === 'info' ? (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-neutral-700'>
                {t('courses.create.courseTitle')}
              </label>
              <Input
                defaultValue={course?.name ?? ''}
                className='h-11 rounded-lg'
                readOnly
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-neutral-700'>
                {t('courses.create.description')}
              </label>
              <textarea
                defaultValue={course?.description ?? ''}
                readOnly
                className='min-h-30 w-full rounded-lg border border-neutral-200 p-3 text-sm'
              />
            </div>
            {course?.coverUrl && (
              <img
                src={course.coverUrl}
                alt=''
                className='h-32 w-full rounded-xl object-cover'
              />
            )}
            <div className='flex items-center justify-between rounded-xl border border-neutral-200 p-3'>
              <Switch
                checked={course?.status === ECourseStatus.Published}
                disabled
              />
              <span className='text-sm text-neutral-700'>
                {t('courses.builder.sidebar.published')}
              </span>
            </div>
          </div>
        ) : (
          <div className='space-y-2'>
            {sections.map((section) => {
              const pages = getPages(section.id);
              const expanded =
                expandedSections[section.id] ?? section.id === selectedSectionId;

              return (
                <div
                  key={section.id}
                  className='overflow-hidden rounded-xl border border-neutral-100'
                >
                  <button
                    type='button'
                    onClick={() => {
                      toggleSection(section.id);
                      selectSection(section.id);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-3 text-start',
                      selectedSectionId === section.id && 'bg-purple-heart-50',
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        'size-4 shrink-0 text-neutral-400 transition-transform',
                        expanded && 'rotate-180',
                      )}
                    />
                    <Input
                      value={section.name ?? ''}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateSectionName(section.id, e.target.value)
                      }
                      className='h-8 flex-1 border-0 bg-transparent px-0 text-start shadow-none focus-visible:ring-0'
                    />
                  </button>

                  {expanded && (
                    <div className='space-y-1 border-t border-neutral-100 px-2 py-2'>
                      {pages.map((page) => {
                        const Icon =
                          page.type === EPageType.Exam
                            ? ClipboardCheck
                            : page.name.includes('فيديو')
                              ? PlayCircle
                              : FileText;

                        return (
                          <button
                            key={page.id}
                            type='button'
                            onClick={() => selectPage(page.id, section.id)}
                            className={cn(
                              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm',
                              selectedPageId === page.id
                                ? 'bg-purple-heart-100 text-purple-heart-800'
                                : 'text-neutral-700 hover:bg-neutral-50',
                            )}
                          >
                            <Icon className='size-4 shrink-0' />
                            <Input
                              value={page.name}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                updatePageName(page.id, e.target.value)
                              }
                              className='h-7 flex-1 border-0 bg-transparent px-0 text-start shadow-none focus-visible:ring-0'
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className='relative border-t border-neutral-100 p-4'>
        {addOpen && (
          <div className='absolute inset-x-4 bottom-[calc(100%+8px)] overflow-hidden rounded-xl border border-neutral-200 bg-white py-2 shadow-lg'>
            <button
              type='button'
              className='flex w-full px-4 py-2.5 text-start text-xs font-medium text-neutral-800 hover:bg-neutral-50'
              onClick={() => void handleAddSection()}
            >
              {t('courses.builder.sidebar.newSection')}
            </button>
            <button
              type='button'
              disabled={sections.length === 0}
              className='flex w-full px-4 py-2.5 text-start text-xs font-medium text-neutral-800 hover:bg-neutral-50 disabled:opacity-50'
              onClick={() => void handleAddLesson()}
            >
              {t('courses.builder.sidebar.newLesson')}
            </button>
          </div>
        )}
        <Button
          variant='outline'
          className='h-[62px] w-full gap-2 rounded-lg border-purple-heart-900 text-base text-neutral-800'
          onClick={() => setAddOpen((prev) => !prev)}
        >
          <Plus className='size-6' />
          {t('courses.builder.sidebar.add')}
        </Button>
      </div>
    </aside>
  );
};
