export const API_ENDPOINTS = {
  login: '/auth/login',
  logout: '/auth/logout',
  refreshToken: '/auth/refresh-token',
  register: '/instructors',
  forgetPassword: '/auth/forgot-password',
  verifyOtp: '/auth/verify-otp',
  resetPassword: '/auth/reset-password',
  devices: '/auth/devices',
  me: '/users/me',

  courses: '/courses',
  courseById: (id: number) => `/courses/${id}`,

  sections: '/sections',
  sectionById: (id: number) => `/sections/${id}`,
  sectionReorder: '/sections/reorder',

  pages: '/pages',
  pageById: (id: number) => `/pages/${id}`,
  pageReorder: '/pages/reorder',

  pageBlocks: '/pageBlocks',
  pageBlockById: (id: number) => `/pageBlocks/${id}`,
  pageBlockReorder: '/pageBlocks/reorder',

  students: '/students',
  studentById: (id: number) => `/students/${id}`,
  studentsImport: '/students/import-excel',

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
