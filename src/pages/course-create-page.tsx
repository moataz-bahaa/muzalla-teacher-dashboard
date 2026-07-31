import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ImagePlus, Save, ArrowUpLeft, CloudUpload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { PageBreadcrumb } from '@/components/page-breadcrumb'
import { CourseCard } from '@/features/courses/components/course-card'
import type { ICourse, TPricingType } from '@/types/course'
import { routes } from '@/routes/routes'
import { cn } from '@/lib/utils'

const LEVELS = [
  'الصف الأول الثانوي',
  'الصف الثاني الثانوي',
  'الصف الثالث الثانوي',
]

export const CourseCreatePage: React.FC = () => {
  const { t } = useTranslation()
  const [title, setTitle] = useState('أكسيد الحديد')
  const [tags, setTags] = useState(['أكسيد الحديد', 'الحديد', 'الكيمياء الكهربية'])
  const [tagInput, setTagInput] = useState('')
  const [level, setLevel] = useState(LEVELS[2]!)
  const [description, setDescription] = useState('')
  const [pricingType, setPricingType] = useState<TPricingType>('subscription')
  const [price, setPrice] = useState<number | ''>('')
  const [allowMarketplace, setAllowMarketplace] = useState(true)
  const [coverUrl, setCoverUrl] = useState(
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80',
  )
  const [previewTab, setPreviewTab] = useState<'info' | 'curriculum'>('info')

  const previewCourse = useMemo<ICourse>(
    () => ({
      id: 0,
      title: title || t('courses.create.titlePlaceholder'),
      description:
        description ||
        'أكسدة الحديد هي تفاعل كيميائي يحدث عند تعرض الحديد للأكسجين والرطوبة، مما يؤدي إلى فقدان الإلكترونات',
      coverUrl,
      tags,
      price: pricingType === 'fixed' ? Number(price) || 0 : 2500,
      currency: 'جنية',
      publishedAt: '22/7/2026',
      status: 'published',
      level,
      pricingType,
      allowMarketplace,
    }),
    [
      allowMarketplace,
      coverUrl,
      description,
      level,
      price,
      pricingType,
      t,
      tags,
      title,
    ],
  )

  const addTag = () => {
    const next = tagInput.trim()
    if (!next || tags.includes(next)) return
    setTags((prev) => [...prev, next])
    setTagInput('')
  }

  const onSave = (asDraft: boolean) => {
    toast.success(asDraft ? t('courses.toast.draftSaved') : t('courses.toast.saved'))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 text-end">
        <PageBreadcrumb
          className="justify-end"
          items={[
            { label: t('dashboard.home'), to: routes.home },
            { label: t('courses.title'), to: routes.courses },
            { label: t('courses.create.breadcrumb') },
          ]}
        />
        <h1 className="font-heading text-3xl font-bold text-purple-heart-950 sm:text-4xl">
          {t('courses.title')}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          className="h-12 gap-2 rounded-lg bg-purple-heart-900 px-5 hover:bg-purple-heart-800"
          onClick={() => onSave(false)}
        >
          <ArrowUpLeft className="size-4" />
          {t('courses.create.saveContinue')}
        </Button>
        <Button
          variant="outline"
          className="h-12 gap-2 rounded-lg border-neutral-200 bg-white px-5 text-neutral-700"
          onClick={() => onSave(true)}
        >
          <Save className="size-4" />
          {t('courses.create.saveDraft')}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[464px_minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-5">
          <section className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h2 className="mb-3 text-end text-sm font-medium text-neutral-800">
              {t('courses.create.cover')}
            </h2>
            <label className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-purple-heart-400 bg-purple-heart-50/40 px-4 text-center">
              <ImagePlus className="size-12 text-purple-heart-700" />
              <p className="text-sm text-neutral-700">{t('courses.create.coverHint')}</p>
              <p className="text-xs text-neutral-500">{t('courses.create.coverHintSecondary')}</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  if (file.size > 20 * 1024 * 1024) {
                    toast.error(t('courses.create.coverTooLarge'))
                    return
                  }
                  setCoverUrl(URL.createObjectURL(file))
                }}
              />
            </label>
          </section>

          <section className="rounded-2xl bg-purple-heart-900 p-6 text-white shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <Switch
                checked={allowMarketplace}
                onCheckedChange={setAllowMarketplace}
                className="data-[state=checked]:bg-white data-[state=checked]:[&_span]:bg-purple-heart-900"
              />
              <CloudUpload className="size-8 opacity-90" />
            </div>
            <h3 className="mb-2 text-end text-lg font-bold">
              {t('courses.create.marketplaceTitle')}
            </h3>
            <p className="text-end text-sm leading-relaxed text-purple-heart-100">
              {t('courses.create.marketplaceDescription')}
            </p>
          </section>
        </div>

        <div className="flex flex-col gap-5">
          <section className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex flex-col gap-5">
              <div className="space-y-2 text-end">
                <label className="text-sm font-medium">{t('courses.create.courseTitle')}</label>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="h-12 rounded-lg text-end"
                />
              </div>

              <div className="space-y-2 text-end">
                <label className="text-sm font-medium">{t('courses.create.keywords')}</label>
                <div className="flex min-h-12 flex-wrap items-center justify-end gap-2 rounded-lg border border-neutral-200 px-3 py-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setTags((prev) => prev.filter((item) => item !== tag))}
                      className="rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-800"
                    >
                      {tag}
                    </button>
                  ))}
                  <Input
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder={t('courses.create.keywordsPlaceholder')}
                    className="h-8 min-w-[120px] flex-1 border-0 shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="space-y-2 text-end">
                <label className="text-sm font-medium">{t('courses.create.level')}</label>
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-3 text-end text-sm"
                >
                  {LEVELS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 text-end">
                <label className="text-sm font-medium">
                  {t('courses.create.description')}
                </label>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={t('courses.create.descriptionPlaceholder')}
                  className="min-h-[140px] rounded-lg text-end"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-5">
            <h2 className="mb-4 flex items-center justify-end gap-2 text-end text-lg font-bold">
              {t('courses.create.pricingPlan')}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPricingType('subscription')}
                className={cn(
                  'rounded-xl border p-4 text-end transition-colors',
                  pricingType === 'subscription'
                    ? 'border-purple-heart-700 bg-purple-heart-50'
                    : 'border-neutral-200 bg-white',
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={cn(
                      'flex size-5 items-center justify-center rounded-full border',
                      pricingType === 'subscription'
                        ? 'border-purple-heart-700 bg-purple-heart-700 text-white'
                        : 'border-neutral-300',
                    )}
                  >
                    {pricingType === 'subscription' ? '✓' : ''}
                  </span>
                  <span className="font-medium">{t('courses.create.subscription')}</span>
                </div>
                <p className="text-xs leading-relaxed text-neutral-600">
                  {t('courses.create.subscriptionHint')}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPricingType('fixed')}
                className={cn(
                  'rounded-xl border p-4 text-end transition-colors',
                  pricingType === 'fixed'
                    ? 'border-purple-heart-700 bg-purple-heart-50'
                    : 'border-neutral-200 bg-white',
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={cn(
                      'flex size-5 items-center justify-center rounded-full border',
                      pricingType === 'fixed'
                        ? 'border-purple-heart-700 bg-purple-heart-700 text-white'
                        : 'border-neutral-300',
                    )}
                  >
                    {pricingType === 'fixed' ? '✓' : ''}
                  </span>
                  <span className="font-medium">{t('courses.create.fixedPrice')}</span>
                </div>
                <div className="flex items-center justify-end gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2">
                  <span className="text-sm text-neutral-500">جنية</span>
                  <Input
                    type="number"
                    value={price}
                    onChange={(event) =>
                      setPrice(event.target.value === '' ? '' : Number(event.target.value))
                    }
                    onClick={(event) => event.stopPropagation()}
                    className="h-8 border-0 text-end shadow-none focus-visible:ring-0"
                    placeholder="0"
                  />
                </div>
              </button>
            </div>
          </section>
        </div>

        <aside className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-end gap-4 border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setPreviewTab('curriculum')}
              className={cn(
                'pb-2 text-sm',
                previewTab === 'curriculum'
                  ? 'border-b-2 border-purple-heart-700 font-medium text-purple-heart-800'
                  : 'text-neutral-500',
              )}
            >
              {t('courses.create.curriculumTab')}
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('info')}
              className={cn(
                'pb-2 text-sm',
                previewTab === 'info'
                  ? 'border-b-2 border-purple-heart-700 font-medium text-purple-heart-800'
                  : 'text-neutral-500',
              )}
            >
              {t('courses.create.infoTab')}
            </button>
          </div>
          <h3 className="mb-3 text-end font-medium text-neutral-800">
            {t('courses.create.cardPreview')}
          </h3>
          {previewTab === 'info' ? (
            <CourseCard course={previewCourse} compact />
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
              {t('courses.create.curriculumEmpty')}
            </div>
          )}
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to={routes.courses}>{t('courses.create.backToList')}</Link>
          </Button>
        </aside>
      </div>
    </div>
  )
}
