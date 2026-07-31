import { DeleteModal } from '@/components/modal-views/delete-modal';
import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import { type MODAL_VIEWS, useModalAction, useModalState } from './context';

function renderModalContent(view: MODAL_VIEWS) {
  switch (view) {
    case 'DELETE_OBJECT':
      return <DeleteModal />;
    default:
      return null;
  }
}

export default function ModalsContainer() {
  const { isOpen, view } = useModalState();
  const { closeModal } = useModalAction();

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        onClose={closeModal}
        className='fixed inset-0 z-50 flex items-center justify-center'
      >
        <div
          className='fixed inset-0 bg-black/70 transition-opacity'
          onClick={closeModal}
        />
        {view && (
          <TransitionChild
            as='div'
            enter='transition ease-out duration-300'
            enterFrom='transform scale-110 opacity-0'
            enterTo='transform scale-100 opacity-100'
            leave='transition ease-in duration-150'
            leaveFrom='transform scale-100 opacity-100'
            leaveTo='transform scale-110 opacity-0'
            className='relative z-50 mx-4 w-full max-w-2xl'
          >
            {renderModalContent(view)}
          </TransitionChild>
        )}
      </Dialog>
    </Transition>
  );
}
