import React from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function ProtectedRoute({ children }) {
    const { auth } = useAuth()

    const location = useLocation()
    return auth.user?._id ? (
        <>{children}</>
    ) : (
        <Navigate to="/auth" state={{ from: location.pathname }} />
    )
}
