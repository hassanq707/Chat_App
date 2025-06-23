import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const Protected_Route = () => {
  const { authUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="fixed inset-0  flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-[#328dc5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return authUser ? <Outlet /> : <Navigate to="/login" />;
};

export default Protected_Route
