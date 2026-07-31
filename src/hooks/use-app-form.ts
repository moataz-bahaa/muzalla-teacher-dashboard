import { useForm, type DefaultValues, type FieldValues, type UseFormReturn } from 'react-hook-form'
import type { ObjectSchema } from 'joi'
import { localizedJoiResolver } from '@/lib/localized-joi-resolver'

interface IUseAppFormOptions<T extends FieldValues> {
  schema: ObjectSchema<T>
  defaultValues?: DefaultValues<T>
}

export function useAppForm<T extends FieldValues>({
  schema,
  defaultValues,
}: IUseAppFormOptions<T>): UseFormReturn<T> {
  return useForm<T>({
    resolver: localizedJoiResolver(schema),
    defaultValues,
  })
}
