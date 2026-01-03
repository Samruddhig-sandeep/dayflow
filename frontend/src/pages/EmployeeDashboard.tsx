import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  Clock,
  CalendarDays,
  Wallet,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { recentActivities, attendanceRecords, leaveBalance, leaveRequests, salarySlips } from '@/lib/mockData';
import { format, parseISO, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

export default function EmployeeDashboard() {
  const { user } = useAuth();

  const todayAttendance = attendanceRecords[0];
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending' && l.employeeId === '1');
  const latestSalary = salarySlips[0];

  const stats = [
    {
      icon: Clock,
      label: 'Today\'s Status',
      value: todayAttendance?.checkIn || '--:--',
      subValue: todayAttendance?.status === 'present' ? 'Checked In' : 'Not checked in',
      color: 'text-status-present',
      bgColor: 'bg-status-present/10',
    },
    {
      icon: CalendarDays,
      label: 'Leave Balance',
      value: `${leaveBalance.paid.remaining}`,
      subValue: 'Paid days remaining',
      color: 'text-status-leave',
      bgColor: 'bg-status-leave/10',
    },
    {
      icon: Wallet,
      label: 'Last Salary',
      value: `$${latestSalary?.netSalary.toLocaleString()}`,
      subValue: latestSalary?.month || '',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: TrendingUp,
      label: 'Work Hours',
      value: '176h',
      subValue: 'This month',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  const quickActions = [
    { icon: User, label: 'View Profile', path: '/profile', color: 'bg-primary' },
    { icon: Clock, label: 'Attendance', path: '/attendance', color: 'bg-status-present' },
    { icon: CalendarDays, label: 'Apply Leave', path: '/leave', color: 'bg-status-leave' },
    { icon: Wallet, label: 'View Payroll', path: '/payroll', color: 'bg-accent' },
  ];

  return (
    <DashboardLayout
      title={`Good ${getTimeOfDay()}, ${user?.firstName}!`}
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
                    <p className="text-xs text-muted-foreground">{stat.subValue}</p>
                  </div>
                  <div className={cn('p-3 rounded-xl', stat.bgColor)}>
                    <stat.icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action, i) => (
                <Link key={i} to={action.path}>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-6 flex flex-col items-center gap-3 hover:shadow-md transition-all"
                  >
                    <div className={cn('p-3 rounded-xl text-primary-foreground', action.color)}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-sm">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={cn(
                    'p-2 rounded-lg mt-0.5',
                    activity.type === 'attendance' && 'bg-status-present/10 text-status-present',
                    activity.type === 'leave' && 'bg-status-leave/10 text-status-leave',
                    activity.type === 'payroll' && 'bg-accent/10 text-accent',
                    activity.type === 'profile' && 'bg-primary/10 text-primary',
                  )}>
                    {activity.type === 'attendance' && <Clock className="h-4 w-4" />}
                    {activity.type === 'leave' && <CalendarDays className="h-4 w-4" />}
                    {activity.type === 'payroll' && <Wallet className="h-4 w-4" />}
                    {activity.type === 'profile' && <User className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(activity.timestamp), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Leave Balance */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-semibold">Leave Balance</CardTitle>
                <CardDescription>Your available leave days</CardDescription>
              </div>
              <Link to="/leave">
                <Button size="sm" variant="outline">
                  Apply Leave
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-5">
              {Object.entries(leaveBalance).map(([type, balance]) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{type} Leave</span>
                    <span className="text-muted-foreground">
                      {balance.remaining} / {balance.total} days
                    </span>
                  </div>
                  <Progress 
                    value={(balance.remaining / (balance.total || 1)) * 100} 
                    className="h-2"
                  />
                </div>
              ))}

              {/* Pending Requests */}
              {pendingLeaves.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-foreground mb-3">Pending Requests</p>
                  {pendingLeaves.map((leave) => (
                    <div key={leave.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium capitalize">{leave.type} Leave</p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(leave.startDate), 'MMM d')} - {format(parseISO(leave.endDate), 'MMM d')}
                        </p>
                      </div>
                      <Badge className="status-pending border">Pending</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {pendingLeaves.length > 0 && (
          <Card className="border-0 shadow-sm bg-status-pending/5 border-status-pending/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-status-pending flex-shrink-0" />
                <p className="text-sm text-foreground">
                  You have <span className="font-semibold">{pendingLeaves.length} pending leave request{pendingLeaves.length > 1 ? 's' : ''}</span> awaiting approval.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
