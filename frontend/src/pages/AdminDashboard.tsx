import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Clock,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { employees, leaveRequests, departmentStats } from '@/lib/mockData';
import { format, parseISO, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useState } from 'react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState(leaveRequests);

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const onLeaveToday = 3;

  const stats = [
    {
      icon: Users,
      label: 'Total Employees',
      value: totalEmployees.toString(),
      subValue: `${activeEmployees} active`,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+2 this month',
    },
    {
      icon: Clock,
      label: 'Present Today',
      value: (totalEmployees - onLeaveToday).toString(),
      subValue: `${onLeaveToday} on leave`,
      color: 'text-status-present',
      bgColor: 'bg-status-present/10',
      trend: '85% attendance',
    },
    {
      icon: CalendarDays,
      label: 'Pending Leaves',
      value: pendingLeaves.length.toString(),
      subValue: 'Awaiting approval',
      color: 'text-status-pending',
      bgColor: 'bg-status-pending/10',
      trend: 'Action needed',
    },
    {
      icon: TrendingUp,
      label: 'This Month',
      value: '$285K',
      subValue: 'Total payroll',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      trend: '+5% from last month',
    },
  ];

  const handleLeaveAction = (id: string, action: 'approved' | 'rejected') => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: action } : l));
    toast.success(`Leave request ${action}`);
  };

  return (
    <DashboardLayout
      title="HR Dashboard"
      subtitle={format(new Date(), 'EEEE, MMMM d, yyyy')}
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="card-hover border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{stat.subValue}</span>
                    </div>
                  </div>
                  <div className={cn('p-3 rounded-xl', stat.bgColor)}>
                    <stat.icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Leave Requests */}
          <Card className="xl:col-span-2 border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-semibold">Leave Requests</CardTitle>
                <CardDescription>Pending approval</CardDescription>
              </div>
              <Link to="/admin/leave-requests">
                <Button variant="ghost" size="sm" className="text-primary">
                  View all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {pendingLeaves.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-status-approved/50 mb-3" />
                  <p className="text-muted-foreground">All leave requests have been processed!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingLeaves.slice(0, 4).map((leave) => (
                    <div key={leave.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {leave.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{leave.employeeName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs capitalize">
                              {leave.type}
                            </Badge>
                            <span>•</span>
                            <span>
                              {format(parseISO(leave.startDate), 'MMM d')} - {format(parseISO(leave.endDate), 'MMM d')}
                            </span>
                            <span>•</span>
                            <span>
                              {differenceInDays(parseISO(leave.endDate), parseISO(leave.startDate)) + 1} days
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleLeaveAction(leave.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleLeaveAction(leave.id, 'approved')}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Department Overview */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Department Overview</CardTitle>
              <CardDescription>Today's attendance by department</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {departmentStats.map((dept, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{dept.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">{dept.employees} employees</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground text-sm">{dept.present}/{dept.employees}</p>
                    <p className="text-xs text-muted-foreground">Present</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Employees Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-semibold">Employee Directory</CardTitle>
              <CardDescription>Quick overview of all employees</CardDescription>
            </div>
            <Link to="/admin/employees">
              <Button variant="ghost" size="sm" className="text-primary">
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.slice(0, 5).map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-secondary/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                            {employee.firstName[0]}{employee.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{employee.department}</TableCell>
                    <TableCell className="text-muted-foreground">{employee.position}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          employee.status === 'active' ? 'status-approved' : 'status-absent'
                        )}
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem>View Attendance</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
