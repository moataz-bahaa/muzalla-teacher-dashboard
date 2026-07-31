import forgetPasswordImage from '@/assets/images/forget-password.png';
import loginImage from '@/assets/images/login.png';
import registerImage from '@/assets/images/register.png';
import resetPasswordImage from '@/assets/images/reset-password.png';
import verifyOtpImage from '@/assets/images/verify-otp.png';

export type TAuthArtVariant = 'login' | 'register' | 'forget' | 'otp' | 'reset';

interface IAuthArtPanelProps {
  variant?: TAuthArtVariant;
}

const ringClass: Record<TAuthArtVariant, string> = {
  login: 'from-purple-heart-200/80 to-purple-heart-100/40',
  register: 'from-purple-heart-300/70 to-purple-heart-100/30',
  forget: 'from-purple-heart-200/80 to-purple-heart-50',
  otp: 'from-purple-heart-300/60 to-purple-heart-100/40',
  reset: 'from-purple-heart-200/70 to-purple-heart-100/30',
};

export const AuthArtPanel: React.FC<IAuthArtPanelProps> = ({
  variant = 'login',
}) => {
  return (
    <div className='relative flex h-full min-h-55 w-full items-center justify-center overflow-hidden rounded-[20px] bg-purple-heart-50 lg:min-h-0'>
      <div
        className={`absolute inset-[12%] rounded-full bg-linear-to-br ${ringClass[variant]} blur-2xl`}
        aria-hidden
      />
      <div className='relative z-10 flex flex-col items-center gap-6 px-8 py-10'>
        <AuthIllustration variant={variant} />
        <div
          className='hidden h-2 w-32 rounded-full bg-purple-heart-200/80 lg:block'
          aria-hidden
        />
      </div>
    </div>
  );
};

const AuthIllustration: React.FC<{ variant: TAuthArtVariant }> = ({
  variant,
}) => {
  switch (variant) {
    case 'register':
      return (
        <img
          src={registerImage}
          alt='login'
          className='w-[40.84rem] h-[24.31.rem]'
        />
      );
    case 'forget':
      return (
        <img
          src={forgetPasswordImage}
          alt='login'
          className='w-[37.45081rem] h-[35.48094rem]'
        />
      );
    case 'otp':
      return (
        <img
          src={verifyOtpImage}
          alt='login'
          className='w-[37.45081rem] h-[35.48094rem]'
        />
      );
    case 'reset':
      return (
        <img
          src={resetPasswordImage}
          alt='login'
          className='w-[37.45081rem] h-[35.48094rem]'
        />
      );
    default:
      return (
        <img
          src={loginImage}
          alt='login'
          className='w-[40.84rem] h-[24.31.rem]'
        />
      );
  }
};
