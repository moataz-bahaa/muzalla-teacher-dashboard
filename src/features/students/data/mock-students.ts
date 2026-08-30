import type { IStudent } from '@/types/student'

const COURSE = {
  id: 1,
  title: 'الفيزياء الحيوية الفصل الأول',
  progress: 60,
}

export const ACADEMIC_YEARS = [
  'year1',
  'year2',
  'year3',
  'year4',
] as const

export const MOCK_STUDENTS: IStudent[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: index === 0 ? 'Heidy Ali al sayed' : 'Ahmed Ali hassan',
  email: index === 0 ? 'Ahmedgomaa@gmail.com' : 'Ahmedhassan@gmail.com',
  phone: index === 0 ? '+201065423825' : '01063010392',
  password: 'Password123!',
  avatarUrl: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
  active: index === 2,
  academicYear: 'year1',
  enrolledCourses: [
    { ...COURSE, id: index * 2 + 1 },
    { ...COURSE, id: index * 2 + 2, progress: 45 },
    { ...COURSE, id: index * 2 + 3, progress: 80 },
  ],
}))

export const MOCK_IMPORT_PREVIEW: IStudent[] = MOCK_STUDENTS.slice(0, 6)
