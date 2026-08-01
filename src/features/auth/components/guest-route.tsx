import useAuth from '@/features/auth/hooks/use-auth'
import { routes } from '@/routes/routes'
import { Navigate } from 'react-router-dom'

interface IGuestRouteProps {
  children?: React.ReactNode
}

/** Redirects authenticated users away from login/register/etc. */
export const GuestRoute: React.FC<IGuestRouteProps> = ({ children }) => {
  const { isAuthorized } = useAuth()

  if (isAuthorized) {
    return <Navigate to={routes.home} replace />
  }

  return <>{children}</>
}
