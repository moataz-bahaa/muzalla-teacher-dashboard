import { useForm, type DefaultValues, type FieldValues, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'

interface IUseAppFormOptions<TSchema extends z.ZodType> {
  schema: TSchema
  defaultValues?: DefaultValues<z.infer<TSchema> & FieldValues>
}

export function useAppForm<TSchema extends z.ZodType>(
  options: IUseAppFormOptions<TSchema>,
): UseFormReturn<z.infer<TSchema> & FieldValues> {
  return useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(options.schema as any),
    defaultValues: options.defaultValues,
  })
}
