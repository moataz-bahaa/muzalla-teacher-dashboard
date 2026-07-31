import { Routes, Route } from 'react-router-dom'
import { routes } from '@/routes/routes'
import { HomePage } from '@/pages/home-page'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path={routes.home} element={<HomePage />} />
    </Routes>
  )
}
