import { CourseFiltersDrawer } from '@/features/courses/components/course/course-filters-drawer';
import { StudentFiltersDrawer } from '@/features/students/components/student-filters-drawer';
import { StudentProfileDrawer } from '@/features/students/components/student-profile-drawer';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { DRAWER_VIEWS } from './context';
import { useDrawerAction, useDrawerState } from './context';

function renderDrawerContent(view: DRAWER_VIEWS) {
  switch (view) {
    case 'COURSE_FILTERS':
      return <CourseFiltersDrawer />;
    case 'STUDENT_FILTERS':
      return <StudentFiltersDrawer />;
    case 'STUDENT_PROFILE':
      return <StudentProfileDrawer />;
    default:
      return null;
  }
}

export default function DrawerContainer() {
  const { isOpen, view } = useDrawerState();
  const { closeDrawer } = useDrawerAction();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpen) {
      closeDrawer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-50 overflow-hidden'
        onClose={closeDrawer}
      >
        <div className='fixed inset-0 bg-black/70 transition-opacity' />

        <div className='fixed inset-y-0 start-0 flex max-w-full'>
          <TransitionChild
            as={Fragment}
            enter='transform transition ease-in-out duration-200'
            enterFrom='ltr:-translate-x-full rtl:translate-x-full'
            enterTo='translate-x-0'
            leave='transform transition ease-in-out duration-100'
            leaveFrom='translate-x-0'
            leaveTo='ltr:-translate-x-full rtl:translate-x-full'
          >
            <DialogPanel
              className={cn(
                'w-screen rounded-e-2xl bg-white shadow-lg',
                view === 'STUDENT_PROFILE' ? 'max-w-[420px]' : 'max-w-[450px]',
              )}
            >
              {view && renderDrawerContent(view)}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
