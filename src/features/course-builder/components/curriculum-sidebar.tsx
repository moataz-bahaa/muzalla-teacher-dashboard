import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { ECourseStatus } from '@/types/page-block';
import {
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  FileText,
  PlayCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBuilder, type TBuilderTab } from '../context/builder-context';
import { EPageType } from '@/types/page-block';
import { useCourseQuery } from '@/lib/data/course-builder';

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
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
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
    <aside className='flex h-full min-h-[815px] sticky top-10 flex-col rounded-2xl border border-neutral-200 bg-white'>
      <div className='p-4'>
        <div className='flex rounded-xl bg-purple-heart-100 p-1'>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type='button'
              onClick={() => setSidebarTab(tab.value)}
              className={cn(
                'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                sidebarTab === tab.value
                  ? 'bg-white text-purple-heart-800 shadow-sm'
                  : 'text-neutral-600',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
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
                className='min-h-[120px] w-full rounded-lg border border-neutral-200 p-3 text-sm'
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
              <Switch checked={course?.status === ECourseStatus.Published} disabled />
              <span className='text-sm text-neutral-700'>
                {t('courses.builder.sidebar.published')}
              </span>
            </div>
          </div>
        ) : (
          <div className='space-y-2'>
            {sections.map((section) => {
              const pages = getPages(section.id);
              const expanded = expandedSections[section.id] ?? section.id === selectedSectionId;

              return (
                <div key={section.id} className='rounded-xl border border-neutral-100'>
                  <button
                    type='button'
                    onClick={() => {
                      toggleSection(section.id);
                      selectSection(section.id);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 px-3 py-3 text-start',
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
                      onChange={(e) => updateSectionName(section.id, e.target.value)}
                      className='h-8 border-0 bg-transparent px-0 text-end shadow-none focus-visible:ring-0'
                    />
                  </button>

                  {expanded && (
                    <div className='space-y-1 border-t border-neutral-100 px-2 py-2'>
                      {pages.map((page) => {
                        const Icon =
                          page.type === EPageType.Exam ? ClipboardCheck : page.name.includes('فيديو')
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
                              onChange={(e) => updatePageName(page.id, e.target.value)}
                              className='h-7 border-0 bg-transparent px-0 text-end shadow-none focus-visible:ring-0'
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
          <div className='absolute inset-x-4 bottom-[calc(100%+8px)] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg'>
            <button
              type='button'
              className='flex w-full px-4 py-3 text-end text-sm hover:bg-neutral-50'
              onClick={() => void handleAddSection()}
            >
              {t('courses.builder.sidebar.newSection')}
            </button>
            <button
              type='button'
              disabled={sections.length === 0}
              className='flex w-full px-4 py-3 text-end text-sm hover:bg-neutral-50 disabled:opacity-50'
              onClick={() => void handleAddLesson()}
            >
              {t('courses.builder.sidebar.newLesson')}
            </button>
          </div>
        )}
        <Button
          variant='outline'
          className='h-14 w-full gap-2 rounded-xl border-neutral-200 text-base'
          onClick={() => setAddOpen((prev) => !prev)}
        >
          {addOpen ? (
            <ChevronUp className='size-5' />
          ) : (
            <ChevronDown className='size-5' />
          )}
          {t('courses.builder.sidebar.add')}
        </Button>
      </div>
    </aside>
  );
};
