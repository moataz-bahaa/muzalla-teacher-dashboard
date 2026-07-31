import { CourseFiltersDrawer } from '@/features/courses/components/course/course-filters-drawer';
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
            <DialogPanel className='w-screen rounded-e-2xl max-w-[450px] bg-white shadow-lg'>
              {view && renderDrawerContent(view)}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
