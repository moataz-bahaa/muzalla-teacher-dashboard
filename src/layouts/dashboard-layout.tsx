import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/features/auth/components/language-switcher';
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';
import {
  Award,
  ChevronDown,
  CreditCard,
  ExternalLink,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  PlayCircle,
  Settings,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';

const navItems: Array<{
  to: string;
  icon: ComponentType<{ className?: string }>;
  end?: boolean;
}> = [
  { to: routes.home, icon: Home, end: true },
  { to: '#students', icon: Users },
  { to: routes.courses, icon: PlayCircle },
  { to: '#awards', icon: Award },
  { to: '#payments', icon: CreditCard },
  { to: '#reports', icon: FileText },
  { to: '#filters', icon: SlidersHorizontal },
];

export const DashboardLayout: React.FC = () => {
  const { t } = useTranslation();

  // TODO handle sidebar expand/collapse and compare to UI

  return (
    <div className='min-h-svh bg-neutral-50 text-neutral-900'>
      <aside className='fixed inset-y-0 start-0 z-40 flex w-20 flex-col items-center border-e border-neutral-200 bg-white py-4'>
        <div className='mb-6 flex size-10 items-center justify-center rounded-xl bg-purple-heart-900 text-sm font-bold text-white'>
          M
        </div>
        <nav className='flex flex-1 flex-col items-center gap-2'>
          {navItems.map(({ to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={Boolean(end)}
              className={({ isActive }) =>
                cn(
                  'flex size-11 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-purple-heart-50 hover:text-purple-heart-700',
                  isActive &&
                    !to.startsWith('#') &&
                    'bg-purple-heart-100 text-purple-heart-800',
                )
              }
            >
              <Icon className='size-5' />
            </NavLink>
          ))}
        </nav>
        <div className='mt-auto flex flex-col items-center gap-2'>
          <div className='size-10 overflow-hidden rounded-full bg-purple-heart-200' />
          <button
            type='button'
            className='flex size-11 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100'
          >
            <Settings className='size-5' />
          </button>
          <button
            type='button'
            className='flex size-11 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100'
          >
            <LogOut className='size-5' />
          </button>
        </div>
      </aside>

      <div className='min-h-svh ps-20'>
        <header className='sticky top-0 z-30 flex h-20 items-center justify-between border-b border-neutral-200 bg-white px-6 lg:px-10'>
          <div className='flex items-center gap-3'>
            <Button className='h-9 gap-2 rounded-lg bg-purple-heart-900 px-4 text-sm hover:bg-purple-heart-800'>
              {t('dashboard.addItem')}
              <ChevronDown className='size-4' />
            </Button>
            <Button
              variant='outline'
              className='h-9 gap-2 rounded-lg border-neutral-200 bg-white px-4 text-sm text-neutral-700'
            >
              {t('dashboard.viewSite')}
              <ExternalLink className='size-4' />
            </Button>
            <button
              type='button'
              className='relative flex size-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100'
            >
              <MessageSquare className='size-5' />
              <span className='absolute end-1 top-1 size-2.5 rounded-full bg-danger-500' />
            </button>
          </div>
          <div id='dashboard-breadcrumb' className='text-sm text-neutral-500' />
          <LanguageSwitcher />
        </header>
        <main className='px-6 py-6 lg:px-10'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
