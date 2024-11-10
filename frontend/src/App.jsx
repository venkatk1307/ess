import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Nav/navbar';
import Login from './components/login/Login';
import LeaveRequestForm from './components/LeaveRequestForm/LeaveRequestForm';
import LeaveApproval from './components/LeaveApproval/LeaveApproval';
import Timesheet from './components/TimeSheet/TimeSheet';
import Holidays from './components/Holidays/Holidays';

const ProtectedRoute = ({ children, isAuthenticated, setIsAuthenticated }) => {
  return isAuthenticated ? (
    <>
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      {children}
    </>
  ) : (
    <Navigate to="/" />
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/timesheet" />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/leave-request"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
                <LeaveRequestForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timesheet"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
                <Timesheet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave-approval"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
                <LeaveApproval />
              </ProtectedRoute>
            }
          />
          <Route
            path="/holidays"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
                <Holidays />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
