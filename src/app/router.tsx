import { Routes, Route } from 'react-router-dom'
import { routes } from '@/routes/routes'
import { DashboardLayout } from '@/layouts/dashboard-layout'
import { HomePage } from '@/pages/home-page'
import { LoginPage } from '@/pages/auth/login-page'
import { RegisterPage } from '@/pages/auth/register-page'
import { ForgetPasswordPage } from '@/pages/auth/forget-password-page'
import { VerifyOtpPage } from '@/pages/auth/verify-otp-page'
import { ResetPasswordPage } from '@/pages/auth/reset-password-page'
import { CoursesPage } from '@/pages/course/courses-page'
import { CourseCreatePage } from '@/pages/course/course-create-page'
import { StudentsPage } from '@/pages/student/students-page'
import { GuestRoute } from '@/features/auth/components/guest-route'
import { PrivateRoute } from '@/features/auth/components/private-route'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route
        path={routes.login}
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path={routes.register}
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route
        path={routes.forgetPassword}
        element={
          <GuestRoute>
            <ForgetPasswordPage />
          </GuestRoute>
        }
      />
      <Route
        path={routes.verifyOtp}
        element={
          <GuestRoute>
            <VerifyOtpPage />
          </GuestRoute>
        }
      />
      <Route
        path={routes.resetPassword}
        element={
          <GuestRoute>
            <ResetPasswordPage />
          </GuestRoute>
        }
      />

      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path={routes.home} element={<HomePage />} />
        <Route path={routes.students} element={<StudentsPage />} />
        <Route path={routes.courses} element={<CoursesPage />} />
        <Route path={routes.courseNew} element={<CourseCreatePage />} />
      </Route>
    </Routes>
  )
}
