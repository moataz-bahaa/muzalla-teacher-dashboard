import { Routes, Route } from 'react-router-dom'
import { routes } from '@/routes/routes'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { HomePage } from '@/pages/home-page'
import { LoginPage } from '@/pages/login-page'
import { RegisterPage } from '@/pages/register-page'
import { ForgetPasswordPage } from '@/pages/forget-password-page'
import { VerifyOtpPage } from '@/pages/verify-otp-page'
import { ResetPasswordPage } from '@/pages/reset-password-page'
import { CoursesPage } from '@/pages/courses-page'
import { CourseCreatePage } from '@/pages/course-create-page'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path={routes.login} element={<LoginPage />} />
      <Route path={routes.register} element={<RegisterPage />} />
      <Route path={routes.forgetPassword} element={<ForgetPasswordPage />} />
      <Route path={routes.verifyOtp} element={<VerifyOtpPage />} />
      <Route path={routes.resetPassword} element={<ResetPasswordPage />} />

      <Route element={<DashboardLayout />}>
        <Route path={routes.home} element={<HomePage />} />
        <Route path={routes.courses} element={<CoursesPage />} />
        <Route path={routes.courseNew} element={<CourseCreatePage />} />
      </Route>
    </Routes>
  )
}
