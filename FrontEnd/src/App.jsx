import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { Toaster } from 'react-hot-toast'
import Protected_Route from './components/Protected_Route'

const App = () => {
  return (
    <div className='bg-[#0f2d42] text-white min-h-screen'>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Protected_Route />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
