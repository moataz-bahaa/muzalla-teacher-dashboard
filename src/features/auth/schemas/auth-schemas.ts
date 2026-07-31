import Joi from 'joi'

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().label('auth.email'),
  password: Joi.string().min(8).required().label('auth.password'),
})

export const registerSchema = Joi.object({
  email: Joi.string().trim().email().required().label('auth.email'),
  password: Joi.string().min(8).required().label('auth.password'),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .label('auth.confirmPassword'),
})

export const forgetPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().label('auth.email'),
})

export const verifyOtpSchema = Joi.object({
  code: Joi.string().trim().min(4).required().label('auth.verifyOtp.codeLabel'),
})

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required().label('auth.resetPassword.newPassword'),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .label('auth.resetPassword.confirmPassword'),
})

export type TLoginFormValues = {
  email: string
  password: string
}

export type TRegisterFormValues = {
  email: string
  password: string
  confirmPassword: string
}

export type TForgetPasswordFormValues = {
  email: string
}

export type TVerifyOtpFormValues = {
  code: string
}

export type TResetPasswordFormValues = {
  password: string
  confirmPassword: string
}
