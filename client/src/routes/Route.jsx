import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Dashboard from '../pages/Dashboard'
import { Profile } from '@/pages/Profile'
import CityPage from '../pages/City'
import TripPage from '../pages/TripPage'
import AttractionDetail from '../pages/AttractionDetail'
import SharedTrip from '../pages/SharedTrip'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/city/:city" element={<CityPage />} />
      <Route path="/trip/:tripId" element={<TripPage />} />
      <Route path="/city/:city/:locationId" element={<AttractionDetail />} />
      <Route path="/shared/:token" element={<SharedTrip />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes