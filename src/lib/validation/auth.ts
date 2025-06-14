import * as Yup from "yup"

const emailValidation = Yup.string().email("Invalid email address").required("Email is required")

const passwordValidation = Yup.string()
  .min(8, "Password must be at least 8 characters")
  .matches(/[a-zA-Z]/, "Password must contain at least one letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .required("Password is required")

const nameValidation = Yup.string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .required("Name is required")

export const LoginSchema = Yup.object().shape({
  email: emailValidation,
  password: Yup.string().required("Password is required"),
  rememberMe: Yup.boolean(),
})

export const RegisterSchema = Yup.object().shape({
  fullName: nameValidation,
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  agreeTerms: Yup.boolean().oneOf([true], "You must agree to the terms and conditions"),
})


export const ForgotPasswordSchema = Yup.object().shape({
  email: emailValidation,
})

export const ResetPasswordSchema = Yup.object().shape({
  password: passwordValidation,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
})

export const VerifyEmailSchema = Yup.object().shape({
  code: Yup.string()
    .matches(/^\d{6}$/, "Verification code must be 6 digits")
    .required("Verification code is required"),
})

export interface LoginFormValues {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterFormValues {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

export interface ForgotPasswordFormValues {
  email: string
}

export interface ResetPasswordFormValues {
  password: string
  confirmPassword: string
}

export interface VerifyEmailFormValues {
  code: string
}
