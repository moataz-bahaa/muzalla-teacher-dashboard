import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import useAuth from '@/features/auth/hooks/use-auth';
import { cn } from '@/lib/utils';
import { routes } from '@/routes/routes';
import {
  Award,
  ChevronDown,
  CreditCard,
  ExternalLink,
  LogOut,
  MessageSquare,
  Paintbrush,
  PlayCircle,
  Plus,
  Settings,
  Users,
} from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

interface INavItem {
  to: string;
  labelKey: string;
  icon: ComponentType<{ className?: string }>;
  end?: boolean;
  badge?: ReactNode;
}

const navItems: INavItem[] = [
  { to: routes.home, labelKey: 'dashboard.nav.home', icon: HomeIcon, end: true },
  { to: routes.students, labelKey: 'dashboard.nav.students', icon: Users },
  { to: routes.courses, labelKey: 'dashboard.nav.courses', icon: PlayCircle },
  { to: '#awards', labelKey: 'dashboard.nav.awards', icon: Award },
  { to: '#payments', labelKey: 'dashboard.nav.payments', icon: CreditCard },
  {
    to: '#create-course',
    labelKey: 'dashboard.nav.createCourse',
    icon: PlayCircle,
    badge: (
      <img
        src='/sidebar/plus-badge.svg'
        alt=''
        width={8}
        height={8}
        className='absolute -end-0.5 -bottom-0.5 size-2'
      />
    ),
  },
  { to: '#design', labelKey: 'dashboard.nav.design', icon: Paintbrush },
];

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      aria-hidden
    >
      <path
        d='M2.5 7.5L10 2.5L17.5 7.5V16.25C17.5 16.5815 17.3683 16.8995 17.1339 17.1339C16.8995 17.3683 16.5815 17.5 16.25 17.5H3.75C3.41848 17.5 3.10054 17.3683 2.86612 17.1339C2.6317 16.8995 2.5 16.5815 2.5 16.25V7.5Z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7.5 17.5V10H12.5V17.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

const AppSidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { unauthorize, isLoggingOut } = useAuth();
  const { state, isMobile } = useSidebar();
  const isRtl = i18n.dir() === 'rtl';
  const isCollapsed = state === 'collapsed' && !isMobile;
  const currentLang = i18n.language.startsWith('ar') ? 'ar' : 'en';

  const toggleLanguage = () => {
    void i18n.changeLanguage(currentLang === 'ar' ? 'en' : 'ar');
  };

  return (
    <Sidebar
      side={isRtl ? 'right' : 'left'}
      collapsible='icon'
      className='border-neutral-200'
    >
      <SidebarHeader>
        <SidebarTrigger
          className={cn(
            'absolute top-3 z-40',
            isRtl ? '-left-4.5' : '-right-4.5',
            isMobile && 'static ms-auto translate-x-0',
          )}
        />
        <NavLink
          to={routes.home}
          className={cn(
            'flex items-center gap-1 overflow-hidden text-purple-heart-900',
            isCollapsed && 'justify-center',
          )}
          dir='ltr'
          aria-label={t('common.brand')}
        >
          <img
            src='/sidebar/logo-mark.svg'
            alt=''
            width={36}
            height={27}
            className='h-[27px] w-9 shrink-0'
          />
          <span
            className={cn(
              'font-heading text-2xl font-semibold lowercase tracking-tight transition-[width,opacity] duration-200',
              isCollapsed ? 'w-0 opacity-0' : 'opacity-100',
            )}
          >
            uzalla
          </span>
        </NavLink>
      </SidebarHeader>

      <SidebarContent className='gap-2.5 pt-2.5'>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className='gap-2.5'>
              {navItems.map(({ to, labelKey, icon: Icon, end, badge }) => {
                const label = t(labelKey);
                return (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton
                      asChild
                      tooltip={label}
                      className='justify-start text-neutral-500 data-active:bg-purple-heart-50 data-active:text-purple-heart-900 group-data-[collapsible=icon]:justify-center'
                    >
                      <NavLink
                        to={to}
                        end={Boolean(end)}
                        className={({ isActive }) =>
                          cn(
                            to.startsWith('#') && 'pointer-events-none',
                            isActive &&
                              !to.startsWith('#') &&
                              'bg-purple-heart-50 text-purple-heart-900',
                          )
                        }
                      >
                        <span className='relative inline-flex size-5 shrink-0 items-center justify-center'>
                          <Icon className='size-5' />
                          {badge}
                        </span>
                        <span>{label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className='gap-2.5'>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t('common.language')}
              onClick={toggleLanguage}
              className='text-neutral-500'
            >
              <img
                src='/sidebar/lang-sa.svg'
                alt=''
                width={20}
                height={20}
                className='size-5 shrink-0 rounded-full object-cover'
              />
              <span>
                {currentLang === 'ar' ? t('common.english') : t('common.arabic')}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t('dashboard.nav.settings')}
              className='text-neutral-500'
            >
              <Settings className='size-5' />
              <span>{t('dashboard.nav.settings')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t('dashboard.nav.profile')}
              className='text-neutral-500'
            >
              <img
                src='/sidebar/avatar.png'
                alt=''
                width={20}
                height={20}
                className='size-5 shrink-0 rounded-full object-cover'
              />
              <span>{t('dashboard.nav.profile')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t('auth.logout')}
              disabled={isLoggingOut}
              onClick={() => unauthorize(() => void navigate(routes.login))}
              className='text-danger-500 hover:bg-danger-50 hover:text-danger-600 data-active:bg-danger-50 data-active:text-danger-600'
            >
              <LogOut className='size-5' />
              <span>{t('auth.logout')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

const DashboardHeader: React.FC = () => {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();

  return (
    <header className='sticky top-0 z-20 flex h-20 items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 sm:px-6 lg:px-10'>
      <div className='flex min-w-0 items-center gap-2 sm:gap-3'>
        {isMobile && <SidebarTrigger className='static shadow-sm' />}
        <Button className='h-9 gap-2 rounded-lg bg-purple-heart-900 px-3 text-sm hover:bg-purple-heart-800 sm:px-4'>
          <span className='hidden sm:inline'>{t('dashboard.addItem')}</span>
          <Plus className='size-4 sm:hidden' />
          <ChevronDown className='hidden size-4 sm:block' />
        </Button>
        <Button
          variant='outline'
          className='hidden h-9 gap-2 rounded-lg border-neutral-200 bg-white px-4 text-sm text-neutral-700 sm:inline-flex'
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
      <div id='dashboard-breadcrumb' className='hidden min-w-0 flex-1 text-sm text-neutral-500 md:block' />
    </header>
  );
};

export const DashboardLayout: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  return (
    <SidebarProvider defaultOpen={false} className='bg-neutral-50 text-neutral-900'>
      <AppSidebar />
      <SidebarInset className='min-w-0 bg-neutral-50'>
        <DashboardHeader />
        <main
          className={cn(
            'min-h-[calc(100svh-5rem)] bg-neutral-100 px-4 py-6 sm:px-6 lg:px-10',
            isRtl && 'text-start',
          )}
        >
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
