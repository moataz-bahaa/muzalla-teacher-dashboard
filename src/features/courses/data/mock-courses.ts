import type { ICourse } from '@/types/course'

const cover =
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80'

export const MOCK_COURSES: ICourse[] = [
  {
    id: 1,
    title: 'أكسدة الحديد بالكهرباء',
    description:
      'أكسدة الحديد هي تفاعل كيميائي يحدث عند تعرض الحديد للأكسجين والرطوبة، مما يؤدي إلى فقدان الإلكترونات',
    coverUrl: cover,
    tags: ['أكسيد الحديد', 'الحديد', 'كيمياء'],
    price: 2500,
    currency: 'جنية',
    publishedAt: '22/7/2026',
    status: 'published',
    level: 'الصف الثالث الثانوي',
    pricingType: 'fixed',
    allowMarketplace: true,
  },
  {
    id: 2,
    title: 'أكسدة الحديد بالكهرباء',
    description:
      'أكسدة الحديد هي تفاعل كيميائي يحدث عند تعرض الحديد للأكسجين والرطوبة، مما يؤدي إلى فقدان الإلكترونات',
    coverUrl: cover,
    tags: ['أكسيد الحديد', 'الحديد', 'كيمياء'],
    price: 2500,
    currency: 'جنية',
    publishedAt: '22/7/2026',
    status: 'published',
    level: 'الصف الثالث الثانوي',
    pricingType: 'subscription',
  },
  {
    id: 3,
    title: 'أكسدة الحديد بالكهرباء',
    description:
      'أكسدة الحديد هي تفاعل كيميائي يحدث عند تعرض الحديد للأكسجين والرطوبة، مما يؤدي إلى فقدان الإلكترونات',
    coverUrl: cover,
    tags: ['أكسيد الحديد', 'الحديد', 'كيمياء'],
    price: 2500,
    currency: 'جنية',
    publishedAt: '22/7/2026',
    status: 'published',
    level: 'الصف الثالث الثانوي',
    pricingType: 'fixed',
  },
  {
    id: 4,
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
  },
]
