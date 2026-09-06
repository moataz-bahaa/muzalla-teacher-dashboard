import type { ILoginInput, IRegisterInput, IResetPasswordInput, IVerifyOtpInput } from '@/types/auth';
import Joi from 'joi';

export const loginSchema: Joi.ObjectSchema<ILoginInput> = Joi.object({
  username: Joi.string().trim().required().label('auth.email'),
  password: Joi.string().min(8).required().label('auth.password'),
});

export const registerSchema: Joi.ObjectSchema<IRegisterInput> = Joi.object({
  tenantName: Joi.string().trim().required().label('auth.tenantName'),
  domain: Joi.string().trim().required().label('auth.domain'),
  logo: Joi.any().optional().allow(null),
  firstName: Joi.string().trim().required().label('auth.firstName'),
  lastName: Joi.string().trim().required().label('auth.lastName'),
  username: Joi.string().trim().required().label('auth.username'),
  password: Joi.string().min(8).required().label('auth.password'),
  imageProfile: Joi.any().optional().allow(null),
  phoneNumber: Joi.string().trim().required().label('auth.phoneNumber'),
});

export type TRegisterFormValues = IRegisterInput;

export const forgetPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().label('auth.email'),
});

export const verifyOtpSchema: Joi.ObjectSchema<IVerifyOtpInput> = Joi.object({
  code: Joi.string().trim().min(4).required().label('auth.verifyOtp.codeLabel'),
});

export const resetPasswordSchema: Joi.ObjectSchema<IResetPasswordInput> = Joi.object({
  password: Joi.string()
    .min(8)
    .required()
    .label('auth.resetPassword.newPassword'),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .label('auth.resetPassword.confirmPassword'),
});


export type TForgetPasswordFormValues = {
  email: string;
};

export type TVerifyOtpFormValues = {
  code: string;
};

export type TResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};
