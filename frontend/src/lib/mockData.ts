// Mock data for HRMS application

export type UserRole = 'employee' | 'admin';

export interface User {
  id: string;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  department: string;
  position: string;
  joinDate: string;
  phone: string;
  address: string;
  salary: number;
  status: 'active' | 'inactive';
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'leave' | 'halfday';
  workHours?: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'paid' | 'sick' | 'unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  reviewedBy?: string;
  reviewComment?: string;
}

export interface SalarySlip {
  id: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'paid' | 'pending';
  paidOn?: string;
}

export interface Activity {
  id: string;
  type: 'attendance' | 'leave' | 'payroll' | 'profile';
  message: string;
  timestamp: string;
}

// Current logged-in user mock
export const currentUser: User = {
  id: '1',
  employeeId: 'EMP001',
  email: 'john.doe@dayflow.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'employee',
  avatar: undefined,
  department: 'Engineering',
  position: 'Senior Developer',
  joinDate: '2022-03-15',
  phone: '+1 (555) 123-4567',
  address: '123 Tech Street, San Francisco, CA 94105',
  salary: 85000,
  status: 'active',
};

export const adminUser: User = {
  id: '2',
  employeeId: 'ADM001',
  email: 'sarah.hr@dayflow.com',
  firstName: 'Sarah',
  lastName: 'Johnson',
  role: 'admin',
  avatar: undefined,
  department: 'Human Resources',
  position: 'HR Manager',
  joinDate: '2021-01-10',
  phone: '+1 (555) 987-6543',
  address: '456 Corporate Ave, San Francisco, CA 94105',
  salary: 95000,
  status: 'active',
};

export const employees: User[] = [
  currentUser,
  {
    id: '3',
    employeeId: 'EMP002',
    email: 'mike.smith@dayflow.com',
    firstName: 'Mike',
    lastName: 'Smith',
    role: 'employee',
    department: 'Design',
    position: 'UI/UX Designer',
    joinDate: '2022-06-20',
    phone: '+1 (555) 234-5678',
    address: '789 Design Blvd, San Francisco, CA 94105',
    salary: 75000,
    status: 'active',
  },
  {
    id: '4',
    employeeId: 'EMP003',
    email: 'emily.chen@dayflow.com',
    firstName: 'Emily',
    lastName: 'Chen',
    role: 'employee',
    department: 'Marketing',
    position: 'Marketing Manager',
    joinDate: '2021-09-01',
    phone: '+1 (555) 345-6789',
    address: '321 Market St, San Francisco, CA 94105',
    salary: 80000,
    status: 'active',
  },
  {
    id: '5',
    employeeId: 'EMP004',
    email: 'david.wilson@dayflow.com',
    firstName: 'David',
    lastName: 'Wilson',
    role: 'employee',
    department: 'Engineering',
    position: 'Full Stack Developer',
    joinDate: '2023-01-15',
    phone: '+1 (555) 456-7890',
    address: '654 Code Lane, San Francisco, CA 94105',
    salary: 78000,
    status: 'active',
  },
  {
    id: '6',
    employeeId: 'EMP005',
    email: 'lisa.brown@dayflow.com',
    firstName: 'Lisa',
    lastName: 'Brown',
    role: 'employee',
    department: 'Sales',
    position: 'Sales Representative',
    joinDate: '2022-11-01',
    phone: '+1 (555) 567-8901',
    address: '987 Sales Drive, San Francisco, CA 94105',
    salary: 65000,
    status: 'inactive',
  },
];

export const attendanceRecords: AttendanceRecord[] = [
  { id: '1', date: '2026-01-03', checkIn: '09:02', checkOut: '18:05', status: 'present', workHours: 9 },
  { id: '2', date: '2026-01-02', checkIn: '08:55', checkOut: '17:30', status: 'present', workHours: 8.5 },
  { id: '3', date: '2026-01-01', status: 'leave' },
  { id: '4', date: '2025-12-31', checkIn: '09:15', checkOut: '13:00', status: 'halfday', workHours: 4 },
  { id: '5', date: '2025-12-30', checkIn: '08:45', checkOut: '17:45', status: 'present', workHours: 9 },
  { id: '6', date: '2025-12-29', status: 'absent' },
  { id: '7', date: '2025-12-28', checkIn: '09:00', checkOut: '18:00', status: 'present', workHours: 9 },
];

export const leaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Doe',
    type: 'paid',
    startDate: '2026-01-10',
    endDate: '2026-01-12',
    reason: 'Family vacation',
    status: 'pending',
    appliedOn: '2026-01-02',
  },
  {
    id: '2',
    employeeId: '3',
    employeeName: 'Mike Smith',
    type: 'sick',
    startDate: '2026-01-05',
    endDate: '2026-01-06',
    reason: 'Feeling unwell',
    status: 'approved',
    appliedOn: '2026-01-04',
    reviewedBy: 'Sarah Johnson',
    reviewComment: 'Get well soon!',
  },
  {
    id: '3',
    employeeId: '4',
    employeeName: 'Emily Chen',
    type: 'unpaid',
    startDate: '2026-01-20',
    endDate: '2026-01-25',
    reason: 'Personal matters',
    status: 'pending',
    appliedOn: '2026-01-01',
  },
  {
    id: '4',
    employeeId: '5',
    employeeName: 'David Wilson',
    type: 'paid',
    startDate: '2025-12-24',
    endDate: '2025-12-26',
    reason: 'Christmas holiday',
    status: 'approved',
    appliedOn: '2025-12-15',
    reviewedBy: 'Sarah Johnson',
  },
  {
    id: '5',
    employeeId: '1',
    employeeName: 'John Doe',
    type: 'sick',
    startDate: '2025-12-10',
    endDate: '2025-12-10',
    reason: "Doctor's appointment",
    status: 'rejected',
    appliedOn: '2025-12-08',
    reviewedBy: 'Sarah Johnson',
    reviewComment: 'Please reschedule to a less busy day',
  },
];

export const salarySlips: SalarySlip[] = [
  {
    id: '1',
    month: 'December',
    year: 2025,
    basicSalary: 7083,
    allowances: 1500,
    deductions: 850,
    netSalary: 7733,
    status: 'paid',
    paidOn: '2025-12-28',
  },
  {
    id: '2',
    month: 'November',
    year: 2025,
    basicSalary: 7083,
    allowances: 1500,
    deductions: 850,
    netSalary: 7733,
    status: 'paid',
    paidOn: '2025-11-28',
  },
  {
    id: '3',
    month: 'October',
    year: 2025,
    basicSalary: 7083,
    allowances: 1200,
    deductions: 850,
    netSalary: 7433,
    status: 'paid',
    paidOn: '2025-10-28',
  },
];

export const recentActivities: Activity[] = [
  { id: '1', type: 'attendance', message: 'Checked in at 9:02 AM', timestamp: '2026-01-03T09:02:00' },
  { id: '2', type: 'leave', message: 'Leave request submitted', timestamp: '2026-01-02T14:30:00' },
  { id: '3', type: 'payroll', message: 'December salary credited', timestamp: '2025-12-28T10:00:00' },
  { id: '4', type: 'attendance', message: 'Checked out at 6:05 PM', timestamp: '2026-01-02T18:05:00' },
  { id: '5', type: 'profile', message: 'Profile updated', timestamp: '2025-12-20T11:15:00' },
];

export const departmentStats = [
  { name: 'Engineering', employees: 45, present: 42, onLeave: 3 },
  { name: 'Design', employees: 20, present: 18, onLeave: 2 },
  { name: 'Marketing', employees: 15, present: 14, onLeave: 1 },
  { name: 'Sales', employees: 25, present: 22, onLeave: 3 },
  { name: 'HR', employees: 10, present: 10, onLeave: 0 },
];

export const leaveBalance = {
  paid: { total: 20, used: 8, remaining: 12 },
  sick: { total: 10, used: 2, remaining: 8 },
  unpaid: { total: 0, used: 0, remaining: 0 },
};
