import React from 'react'
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    let data = localStorage.getItem('auth_token');
    return data ? children : <Navigate to='/' />
}
