import DrawerContainer from '@/components/drawer-views/container';
import { DrawerProvider } from '@/components/drawer-views/context';
import ModalsContainer from '@/components/modal-views/container';
import { ModalProvider } from '@/components/modal-views/context';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import i18n from '@/i18n';
import { queryClient } from '@/lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';

interface IAppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<IAppProvidersProps> = ({ children }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools client={queryClient} initialIsOpen={false} />
        <BrowserRouter>
          <ModalProvider>
            <DrawerProvider>
              <TooltipProvider>
                {children}
                <ModalsContainer />
                <DrawerContainer />
                <Toaster richColors position='top-center' />
              </TooltipProvider>
            </DrawerProvider>
          </ModalProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </I18nextProvider>
  );
};
