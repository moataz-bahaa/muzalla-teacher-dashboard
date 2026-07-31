import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import i18n from '@/i18n'
import { queryClient } from '@/lib/query-client'

interface IAppProvidersProps {
  children: React.ReactNode
}

export const AppProviders: React.FC<IAppProvidersProps> = ({ children }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            {children}
            <Toaster richColors position='top-center' />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </I18nextProvider>
  )
}
