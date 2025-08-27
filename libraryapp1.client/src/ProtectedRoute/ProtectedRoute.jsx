// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = useSelector((state) => state.auth.user);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect admin to admin dashboard and users to user dashboard
        if (user.role === 'Admin') {
            return <Navigate to="/admin" replace />;
        } else if (user.role === 'user') {
            return <Navigate to="/user/home" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
