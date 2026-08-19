import type { User, Task, LeaveRequest, Department } from '../types';

export interface AttendanceRecord {
  id: number;
  user_id: number;
  date: string;
  time_in: string | null;
  time_out: string | null;
  status: 'present' | 'late' | 'absent';
  late_minutes: number;
  early_leave_minutes: number;
  overtime_minutes: number;
}

export const mockDepartments: Department[] = [
  { dep_id: 1, dep_name: 'Sales' },
];

export const mockCurrentUser: User = {
  user_id: 18,
  first_name: 'Mohamed',
  last_name: 'Saber',
  email: 'supervisor@example.com',
  phone: '0123456229',
  role: 'supervisor',
  job_title: 'S. Sales Consultant',
  base_salary: 27000,
  department_id: 1,
  supervisor_id: null,
  Avatar: 'https://i.pravatar.cc/150?img=12',
};

export const mockEmployees: User[] = [
  {
    user_id: 17,
    first_name: 'Ali',
    last_name: 'Mohamed',
    email: 'emp@example.com',
    phone: '0123456789',
    role: 'employee',
    job_title: 'Sales Consultant',
    base_salary: 20000,
    department_id: 1,
    supervisor_id: 18,
    Avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    user_id: 19,
    first_name: 'Ahmad',
    last_name: 'Eid',
    email: 'emp2@example.com',
    phone: '0103456700',
    role: 'employee',
    job_title: 'Sales Consultant',
    base_salary: 20000,
    department_id: 1,
    supervisor_id: 18,
    Avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
  },
];

export const mockTasks: Task[] = [
  {
    task_id: 1,
    title: 'Prepare Monthly Report',
    description: 'Compile all sales data for February',
    due_date: '2026-04-25',
    status: 'completed',
    assigned_to: 17,
    created_by: 18,
  },
  {
    task_id: 2,
    title: 'Home Page Development',
    description: 'Compile coding home page',
    due_date: '2026-04-25',
    status: 'pinding',
    assigned_to: 19,
    created_by: 18,
  },
  {
    task_id: 3,
    title: 'Sales Target 150K',
    description: 'Compile 150k sales target for the quarter',
    due_date: '2026-04-25',
    status: 'completed',
    assigned_to: 17,
    created_by: 18,
  },
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    leave_id: 6,
    user_id: 17,
    leave_type: 'annual',
    reason: '---',
    status: 'approved',
    start_date: '2026-04-12',
    end_date: '2026-04-15',
  },
  {
    leave_id: 7,
    user_id: 17,
    leave_type: 'casual',
    reason: 'Any (:',
    status: 'pending',
    start_date: '2026-04-28',
    end_date: '2026-04-30',
  },
  {
    leave_id: 8,
    user_id: 17,
    leave_type: 'sick',
    reason: 'Corona',
    status: 'approved',
    start_date: '2026-04-04',
    end_date: '2026-04-06',
  },
];


export const mockAttendance: AttendanceRecord[] = [
  { id: 15, user_id: 17, date: '2026-03-01', time_in: '09:05', time_out: '17:00', status: 'present', late_minutes: 0, early_leave_minutes: 0, overtime_minutes: 0 },
  { id: 16, user_id: 17, date: '2026-03-02', time_in: '09:25', time_out: '17:00', status: 'late', late_minutes: 20, early_leave_minutes: 0, overtime_minutes: 0 },
  { id: 17, user_id: 17, date: '2026-03-03', time_in: '09:00', time_out: '16:30', status: 'present', late_minutes: 0, early_leave_minutes: 30, overtime_minutes: 0 },
  { id: 18, user_id: 17, date: '2026-03-04', time_in: '09:00', time_out: '18:00', status: 'present', late_minutes: 0, early_leave_minutes: 0, overtime_minutes: 60 },
  { id: 19, user_id: 17, date: '2026-03-05', time_in: null, time_out: null, status: 'absent', late_minutes: 0, early_leave_minutes: 0, overtime_minutes: 0 },
  { id: 20, user_id: 19, date: '2026-03-01', time_in: '09:00', time_out: '17:00', status: 'present', late_minutes: 0, early_leave_minutes: 0, overtime_minutes: 0 },
  { id: 21, user_id: 19, date: '2026-03-02', time_in: '09:40', time_out: '17:00', status: 'late', late_minutes: 40, early_leave_minutes: 0, overtime_minutes: 0 },
  { id: 22, user_id: 19, date: '2026-03-03', time_in: '09:00', time_out: '18:30', status: 'present', late_minutes: 0, early_leave_minutes: 0, overtime_minutes: 90 },
  { id: 23, user_id: 19, date: '2026-03-04', time_in: '09:00', time_out: '15:30', status: 'present', late_minutes: 0, early_leave_minutes: 90, overtime_minutes: 0 },
  { id: 24, user_id: 19, date: '2026-03-05', time_in: null, time_out: null, status: 'absent', late_minutes: 0, early_leave_minutes: 0, overtime_minutes: 0 },
  { id: 25, user_id: 17, date: '2026-03-06', time_in: '09:05', time_out: '17:00', status: 'present', late_minutes: 0, early_leave_minutes: 0, overtime_minutes: 0 },
  { id: 26, user_id: 17, date: '2026-03-07', time_in: '09:25', time_out: '17:00', status: 'late', late_minutes: 20, early_leave_minutes: 0, overtime_minutes: 0 },
  { id: 27, user_id: 17, date: '2026-03-08', time_in: '09:00', time_out: '16:30', status: 'present', late_minutes: 0, early_leave_minutes: 30, overtime_minutes: 0 },
  { id: 28, user_id: 19, date: '2026-03-06', time_in: '09:00', time_out: '17:00', status: 'present', late_minutes: 0, early_leave_minutes: 0, overtime_minutes: 0 },
  { id: 29, user_id: 19, date: '2026-03-07', time_in: '09:40', time_out: '17:00', status: 'late', late_minutes: 40, early_leave_minutes: 0, overtime_minutes: 0 },
];
