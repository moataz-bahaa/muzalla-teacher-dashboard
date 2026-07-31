export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  forgetPassword: '/forget-password',
  verifyOtp: '/verify-otp',
  resetPassword: '/reset-password',
  courses: '/courses',
  courseNew: '/courses/new',
} as const

export type TRoute = (typeof routes)[keyof typeof routes]
