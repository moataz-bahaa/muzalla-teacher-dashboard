import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface IStudentPasswordCellProps {
  password: string
}

export const StudentPasswordCell: React.FC<IStudentPasswordCellProps> = ({
  password,
}) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className='flex items-center gap-2'>
      <span className='font-mono text-sm tracking-wider text-neutral-700'>
        {visible ? password : '••••••••••••'}
      </span>
      <button
        type='button'
        className='text-neutral-400 hover:text-neutral-600'
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
      </button>
    </div>
  )
}
