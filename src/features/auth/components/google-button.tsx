import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export const GoogleButton: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Button
      type='button'
      variant='outline'
      className='h-11 w-full gap-2 rounded-lg border-neutral-300 bg-neutral-100 text-sm font-medium text-purple-heart-950 hover:bg-neutral-200'
      onClick={() => toast.message(t('auth.toast.googleStub'))}
    >
      <img src='/auth/google.svg' alt='' className='size-5' />
      {t('auth.googleSignIn')}
    </Button>
  )
}
