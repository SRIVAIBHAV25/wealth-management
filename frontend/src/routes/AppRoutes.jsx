import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Goals from "../pages/Goals";
import Portfolio from "../pages/Portfolio";
import Investments from "../pages/Investments";
import Transactions from "../pages/Transactions";
import ForgotPassword from "../pages/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";
import InvestmentSimulations from '../pages/InvestmentSimulations';

export default function AppRoutes() {
  const { user, isAuthenticated } = useAuth();

  // Show loading screen while checking authentication
  if (user === undefined) {
    return (
      <Box sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
      }}>
        <CircularProgress size={60} sx={{ color: '#3b82f6' }} />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/investment-simulations" element={<InvestmentSimulations />} />
      </Route>
    </Routes>
  );
}