export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  forgetPassword: '/forget-password',
  verifyOtp: '/verify-otp',
  resetPassword: '/reset-password',
} as const

export type TRoute = (typeof routes)[keyof typeof routes]
