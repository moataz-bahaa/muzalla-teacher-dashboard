import useAuth from '@/features/auth/hooks/use-auth'
import { routes } from '@/routes/routes'
import { Navigate, useSearchParams } from 'react-router-dom'

interface IPrivateRouteProps {
  children?: React.ReactNode
}

export const PrivateRoute: React.FC<IPrivateRouteProps> = ({ children }) => {
  const { isAuthorized } = useAuth()
  const [params] = useSearchParams()
  const error = params.get('error')

  if (!isAuthorized) {
    const search = error ? `?error=${encodeURIComponent(error)}` : ''
    return <Navigate to={`${routes.login}${search}`} replace />
  }

  return <>{children}</>
}
