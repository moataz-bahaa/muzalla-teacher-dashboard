import type { IRegisterInput } from '@/types/auth';
import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().label('auth.email'),
  password: Joi.string().min(8).required().label('auth.password'),
});

export const registerSchema: Joi.ObjectSchema<IRegisterInput> = Joi.object({
  TenantName: Joi.string().trim().required().label('auth.tenantName'),
  Domain: Joi.string().trim().required().label('auth.domain'),
  Logo: Joi.any().optional().allow(null),
  FirstName: Joi.string().trim().required().label('auth.firstName'),
  LastName: Joi.string().trim().required().label('auth.lastName'),
  Username: Joi.string().trim().required().label('auth.username'),
  Password: Joi.string().min(8).required().label('auth.password'),
  ImageProfile: Joi.any().optional().allow(null),
  PhoneNumber: Joi.string().trim().required().label('auth.phoneNumber'),
});

export type TRegisterFormValues = IRegisterInput;

export const forgetPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().label('auth.email'),
});

export const verifyOtpSchema = Joi.object({
  code: Joi.string().trim().min(4).required().label('auth.verifyOtp.codeLabel'),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .required()
    .label('auth.resetPassword.newPassword'),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .label('auth.resetPassword.confirmPassword'),
});

export type TLoginFormValues = {
  email: string;
  password: string;
};

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
