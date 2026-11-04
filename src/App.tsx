import { Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddProduct from './pages/AddProduct'
import Explore from './pages/Explore'
import ProductDetails from './pages/ProductDetails'
export default function App() {
  return (
    <Routes>
  <Route path="/" element={<Navigate to="/explore" replace />} />

  <Route path="/explore" element={<Explore />} />
  <Route path="/products/:slug" element={<ProductDetails />} />

  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/dashboard/products/new" element={<AddProduct />} />
  </Route>
</Routes>
  )
}