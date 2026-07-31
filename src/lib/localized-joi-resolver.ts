import type { Schema } from 'joi'
import type { FieldError, FieldErrors, FieldValues, Resolver } from 'react-hook-form'
import i18n from '@/i18n'

/**
 * Validates with Joi and maps error types to i18n `validation.*` messages.
 * Field labels should be translation keys (e.g. `auth.email`) via `.label(...)`.
 */
export const localizedJoiResolver = <T extends FieldValues>(
  schema: Schema,
): Resolver<T> => {
  return async (data) => {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      errors: {
        label: 'key',
      },
    })

    if (!error) {
      return {
        values: value as T,
        errors: {},
      }
    }

    const errors = {} as FieldErrors<T>

    error.details.forEach((detail) => {
      let label = String(detail.context?.label ?? detail.path.join('.'))
      label = label.replace(/(En|Ar)$/, '')
      const limit = detail.context?.limit
      const type = detail.type

      const message = i18n.t(`validation.${type}`, {
        label: i18n.t(label),
        limit,
        defaultValue: i18n.t('validation.any.invalid', { label: i18n.t(label) }),
      })

      const parts = detail.path.map(String)
      if (parts.length === 0) return

      const last = parts[parts.length - 1]!
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = errors

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]!
        current[part] = current[part] ?? {}
        current = current[part]
      }

      current[last] = {
        type,
        message,
      } satisfies FieldError
    })

    return {
      values: {} as Record<string, never>,
      errors,
    }
  }
}
