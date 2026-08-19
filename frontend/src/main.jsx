import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Login from './pages/Login.tsx';


import EmployeeLayout from './layouts/EmployeeLayout';
import AdminLayout from './layouts/AdminLayout';
import SupervisorLayout from './layouts/SupervisorLayout';
import HRLayout from './layouts/HRLayout';
import ApplyLayout from './layouts/ApplyLayout';



import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeAttendance from './pages/employee/Attendance';
import EmployeeLeaves from './pages/employee/Leaves';
import EmployeeTasks from './pages/employee/Tasks';
import EmployeeProfile from './pages/employee/Profile';
import EmployeePayslips from './pages/employee/Payslips';
import EmployeeAlerts from './pages/employee/Alerts';

import AdminDashboard from './pages/admin/Dashboard';
import AdminAttendance from './pages/admin/Attendance';
import AdminManageDepartments from './pages/admin/ManageDepartments';
import AdminLeaves from './pages/admin/Leaves';
import AdminPayslips from './pages/admin/Payslips';
import AdminProfile from './pages/admin/Profile';
import AdminQRCodePage from './pages/admin/QRCodePage';
import AdminAlerts from './pages/admin/Alerts';
import AdminAttendanceSettings from './pages/admin/AttendanceSettings';
import AdminManageUsers from './pages/admin/ManageUsers';


import SupervisorDashboard from './pages/Supervisor/Dashboard';
import SupervisorEmployees from './pages/Supervisor/Team';
import SupervisorLeaveRequests from './pages/Supervisor/LeaveRequests';
import SupervisorAttendance from './pages/Supervisor/Attendance';
import SupervisorLeaves from './pages/Supervisor/Leaves';
import SupervisorPayslips from './pages/Supervisor/Payslips';
import SupervisorProfile from './pages/Supervisor/Profile';
import SupervisorTasks from './pages/Supervisor/Tasks';
import SupervisorAlerts from './pages/Supervisor/Alerts';
import SupervisorReports from './pages/Supervisor/Reports';


import Dashboard from './pages/hr/Dashboard';
import Attendance from './pages/hr/Attendance';
import Employees from './pages/hr/Employees';
import LeaveManagement from './pages/hr/LeaveManagement';
import HRMyLeaves from './pages/hr/MyLeaves';
import Payslips from './pages/hr/Payroll';
import Performance from './pages/hr/Performance';
import Recruitment from './pages/hr/Recruitment';
import Reports from './pages/hr/Reports';
import Tasks from './pages/hr/Tasks';
import Settings from './pages/hr/Settings';
import JobDetails from './pages/hr/JobDetails';
import Applicants from './pages/hr/Applicants';
import AIApplicants from './pages/hr/AIApplicants';  
import Alerts from './pages/hr/Alerts';
import Profile from './pages/hr/Profile';


import ApplyRecruitment from './pages/apply/OpenJobs';
import JobDetailsApply from './pages/apply/JobDetailsApply';
import Page from './pages/apply/Us';
import Payment from './pages/apply/Payment';
import NotFound from './pages/NotFound';


const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {}
        <Route path="/" element={<Navigate to="/Portal/Us" replace />} />
        <Route path="/login" element={<Login />} />

        {}
        {}
        <Route path="Portal" element={<ApplyLayout />} >
          <Route index element={<Page />} />
          <Route path="OpenPosition" element={<ApplyRecruitment />} />
          <Route path="OpenPosition/:jobId" element={<JobDetailsApply />} />
          <Route path="Us" element={<Page />} />
          <Route path="Payment" element={<Payment />} />
        </Route>

        

        {}
        <Route path="/employee" element={
          <ProtectedRoute>
            <EmployeeLayout />
          </ProtectedRoute>
        }>
          <Route path="home" element={<EmployeeDashboard />} />
          <Route path="attendance" element={<EmployeeAttendance />} />
          <Route path="leaves" element={<EmployeeLeaves />} />
          <Route path="tasks" element={<EmployeeTasks />} />
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="payslips" element={<EmployeePayslips />} />
          <Route path="alerts" element={<EmployeeAlerts />} />
        </Route>

        {}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="home" element={<AdminDashboard />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="departments" element={<AdminManageDepartments />} />
          <Route path="leaves" element={<AdminLeaves />} />
          <Route path="payslips" element={<AdminPayslips />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="qr" element={<AdminQRCodePage />} />
          <Route path="alerts" element={<AdminAlerts />} />
          <Route path="attendance-settings" element={<AdminAttendanceSettings />} />
          <Route path="users" element={<AdminManageUsers />} />
        </Route>

        {}
        <Route path="/supervisor" element={
          <ProtectedRoute>
            <SupervisorLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<SupervisorDashboard />} />
          <Route path="team" element={<SupervisorEmployees />} />
          <Route path="leave-requests" element={<SupervisorLeaveRequests />} />
          <Route path="attendance" element={<SupervisorAttendance />} />
          <Route path="leaves" element={<SupervisorLeaves />} />
          <Route path="payslips" element={<SupervisorPayslips />} />
          <Route path="profile" element={<SupervisorProfile />} />
          <Route path="tasks" element={<SupervisorTasks />} />
          <Route path="alerts" element={<SupervisorAlerts />} />
          <Route path="reports" element={<SupervisorReports />} />
        </Route>

        {}
        <Route path="/hr" element={
          <ProtectedRoute>
            <HRLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Dashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="users" element={<Employees />} />
          <Route path="departments" element={<LeaveManagement />} />
          <Route path="my-leaves" element={<HRMyLeaves />} />
          <Route path="leaves" element={<LeaveManagement />} />
          <Route path="Payslips" element={<Payslips />} />
          <Route path="performance" element={<Performance />} />
          <Route path="recruitment" element={<Recruitment />} />
          <Route path="reports" element={<Reports />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="settings" element={<Settings />} />
          <Route path="recruitment/:jobId" element={<JobDetails />} />
          <Route path="recruitment/:jobId/applicants" element={<Applicants />} />
          
          {}
          <Route path="vacancies/:jobId/ai-filter" element={<AIApplicants />} />
          
          <Route path="alerts" element={<Alerts />} />
          <Route path="Profile" element={<Profile />} />
        </Route>

        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);