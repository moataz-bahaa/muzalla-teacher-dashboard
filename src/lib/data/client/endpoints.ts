export const API_ENDPOINTS = {
  login: '/auth/login',
  logout: '/auth/logout',
  refreshToken: '/auth/refresh-token',
  register: '/instructors',
  forgetPassword: '/auth/forgot-password',
  verifyOtp: '/auth/verify-otp',
  resetPassword: '/auth/reset-password',
  devices: '/auth/devices',

  courses: '/courses',
  courseById: (id: number) => `/courses/${id}`,

  pages: '/pages',
  pageById: (id: number) => `api/pages/${id}`,

  sections: '/sections',
  sectionById: (id: number) => `api/sections/${id}`,

  students: '/students',

  tags: '/tags',
  tagById: (id: number) => `/tags/${id}`,

  threads: '/threads',
  threadById: (id: number) => `/threads/${id}`,
  addThradParticipants: (id: number) => `/threads/${id}/participants`,
  deleteThreadParticipant: (id: number, participantId: number) =>
    `/threads/${id}/participants/${participantId}`,

  users: '/users',
  userById: (id: number) => `/users/${id}`,
} as const;
