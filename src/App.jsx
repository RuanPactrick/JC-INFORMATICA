import { Routes, Route } from 'react-router-dom'
import Storefront from './pages/Storefront'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProductsList from './pages/admin/AdminProductsList'
import AdminProductForm from './pages/admin/AdminProductForm'

function App() {
  return (
    <Routes>
      {/* Public Storefront */}
      <Route path="/*" element={<Storefront />} />

      {/* Protected Admin Area */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProductsList />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
      </Route>
    </Routes>
  )
}

export default App
