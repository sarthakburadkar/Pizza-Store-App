import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './compnents/Login'
import Register from './compnents/Register'
import PrivateRoute from './compnents/PrivateRoute'
import Dashboard from './compnents/Dashboard'
import MenuPage from './compnents/MenuPage'
import CartPage from './compnents/Cartpage'
import Orderspage from './compnents/Orderpage'
import AdminOrdersPage from './compnents/AdminOrderpage'
import AdminMenuPage from './compnents/AdminMenuPage'
import AdminDashboard from './compnents/AdminDashboard'
import Navbar from './compnents/Navbar'
import RevenuePage from './compnents/RevenuePage'


function App() {
  
  return (
      <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Dashboard />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard for both roles */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["USER", "ADMIN"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route 
        path="/menu"
        element={
          <PrivateRoute allowedRoles={["USER"]}>
            <MenuPage />
          </PrivateRoute>
        } />

        <Route
    path="/cart"
    element={
        <PrivateRoute allowedRoles={["USER"]}>
            <CartPage />
        </PrivateRoute>
    }
/>
<Route
        path="/orders"
        element={
          <PrivateRoute allowedRoles={["USER"]}>
            <Orderspage />
          </PrivateRoute>
        }
      />

      {/* ADMIN routes */}
      <Route
        path="/admin/orders"
        element={
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <AdminOrdersPage />
          </PrivateRoute>
        }
      />
      <Route
    path="/admin/menu"
    element={
        <PrivateRoute allowedRoles={["ADMIN"]}>
            <AdminMenuPage />
        </PrivateRoute>
    }
/>
<Route
    path="/admin/dashboard"
    element={
        <PrivateRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
        </PrivateRoute>
    }
/>

<Route
    path="/admin/revenue"
    element={
        <PrivateRoute allowedRoles={["ADMIN"]}>
            <RevenuePage />
        </PrivateRoute>
    }
/>

      </Routes>
    </>
  )
}

export default App
