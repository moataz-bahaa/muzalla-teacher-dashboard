import type { ICourse } from '@/types/course';

const cover =
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80';

const DEFAULT_OUTCOMES = [
  'فهم أساسيات أكسدة الحديد وتطبيقاتها',
  'تحليل التفاعلات الكيميائية الكهربائية',
  'تطبيق المعادلات الكيميائية على أمثلة عملية',
  'التعرف على عوامل التأثير على سرعة الأكسدة',
  'ربط المفاهيم النظرية بالتجارب المعملية',
];

const DEFAULT_LESSONS = [
  { id: 1, title: 'مقدمة في أكسدة الحديد', type: 'video' as const, duration: '12:30' },
  { id: 2, title: 'التفاعلات الكهربائية', type: 'video' as const, duration: '18:45' },
  { id: 3, title: 'اختبار الفصل الأول', type: 'quiz' as const, duration: '15:00' },
  { id: 4, title: 'تطبيقات عملية', type: 'article' as const, duration: '8:00' },
  { id: 5, title: 'مراجعة شاملة', type: 'video' as const, duration: '22:10' },
];

const baseCourse = {
  description:
    'أكسدة الحديد هي تفاعل كيميائي يحدث عند تعرض الحديد للأكسجين والرطوبة، مما يؤدي إلى فقدان الإلكترونات',
  coverUrl: cover,
  tags: ['أكسيد الحديد', 'الحديد', 'كيمياء'],
  price: 250,
  currency: 'جنية',
  publishedAt: '22/7/2026',
  status: 'published' as const,
  level: 'الصف الثالث الثانوي',
  pricingType: 'fixed' as const,
  allowMarketplace: true,
  instructor: 'ا/ احمد محمد على',
  subject: 'كيمياء',
  academicYear: 'السنة الدراسية الإولى',
  outcomes: DEFAULT_OUTCOMES,
  lessons: DEFAULT_LESSONS,
};

export const MOCK_COURSES: ICourse[] = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  title: 'اكسدة الحديد الفصل الاول',
  ...baseCourse,
}));

export const MOCK_COURSES_INACTIVE: ICourse[] = [
  {
    id: 11,
    title: 'مقدمة في الفيزياء الحديثة',
    description: 'دورة تمهيدية حول مفاهيم الفيزياء الحديثة وتطبيقاتها في الحياة اليومية',
    coverUrl: cover,
    tags: ['فيزياء'],
    price: 1800,
    currency: 'جنية',
    publishedAt: '10/6/2026',
    status: 'inactive',
    level: 'الصف الثاني الثانوي',
    pricingType: 'fixed',
    instructor: 'ا/ سارة محمود',
    subject: 'فيزياء',
    academicYear: 'السنة الدراسية الثانية',
    outcomes: ['فهم مفاهيم الفيزياء الحديثة', 'تطبيق النظريات على أمثلة واقعية'],
    lessons: [
      { id: 1, title: 'مقدمة في الفيزياء', type: 'video', duration: '10:00' },
    ],
  },
];

export const ALL_MOCK_COURSES: ICourse[] = [...MOCK_COURSES, ...MOCK_COURSES_INACTIVE];
