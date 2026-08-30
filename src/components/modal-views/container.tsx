import { DeleteModal } from '@/components/modal-views/delete-modal'
import { TableConfigModal } from '@/components/modal-views/table-config-modal'
import { AddStudentModal } from '@/features/students/components/add-student-modal'
import { EditStudentModal } from '@/features/students/components/edit-student-modal'
import { ImportStudentsModal } from '@/features/students/components/import-students-modal'
import { VerifyImportModal } from '@/features/students/components/verify-import-modal'
import { Dialog, Transition, TransitionChild } from '@headlessui/react'
import { Fragment } from 'react'
import { type MODAL_VIEWS, useModalAction, useModalState } from './context'

function renderModalContent(view: MODAL_VIEWS) {
  switch (view) {
    case 'DELETE_OBJECT':
      return <DeleteModal />
    case 'TABLE_CONFIG':
      return <TableConfigModal />
    case 'ADD_STUDENT':
      return <AddStudentModal />
    case 'EDIT_STUDENT':
      return <EditStudentModal />
    case 'IMPORT_STUDENTS':
      return <ImportStudentsModal />
    case 'VERIFY_IMPORT_DATA':
      return <VerifyImportModal />
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
            className='relative z-50 mx-4'
          >
            {renderModalContent(view)}
          </TransitionChild>
        )}
      </Dialog>
    </Transition>
  )
}
