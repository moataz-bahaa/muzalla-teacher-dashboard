export const routes = {
  home: '/',
  login: '/login',
  register: '/register',
  forgetPassword: '/forget-password',
  verifyOtp: '/verify-otp',
  resetPassword: '/reset-password',
  students: '/students',
  courses: '/courses',
  courseNew: '/courses/new',
  coursesBuilder: '/courses/builder',
} as const

export type TRoute = (typeof routes)[keyof typeof routes]
