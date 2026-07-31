import { Dialog, Transition, TransitionChild } from '@headlessui/react'
import { Fragment } from 'react'
import { DeleteCourseModal } from '@/features/courses/components/delete-course-modal'
import { type MODAL_VIEWS, useModalAction, useModalState } from './context'

function renderModalContent(view: MODAL_VIEWS) {
  switch (view) {
    case 'DELETE_COURSE':
      return <DeleteCourseModal />
    default:
      return null
  }
}

export default function ModalsContainer() {
  const { isOpen, view } = useModalState()
  const { closeModal } = useModalAction()

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        onClose={closeModal}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          className="fixed inset-0 bg-black/70 transition-opacity"
          onClick={closeModal}
        />
        {view && (
          <TransitionChild
            enter="transition ease-out duration-300"
            enterFrom="transform scale-110 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition ease-in duration-150"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-110 opacity-0"
          >
            <div className="relative z-50 mx-4 w-full max-w-md overflow-hidden rounded-xl bg-white p-6 shadow-lg">
              {renderModalContent(view)}
            </div>
          </TransitionChild>
        )}
      </Dialog>
    </Transition>
  )
}
