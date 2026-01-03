import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import {
  Clock,
  LogIn,
  LogOut,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Coffee,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { attendanceRecords, AttendanceRecord } from '@/lib/mockData';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO, addWeeks, subWeeks } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Attendance() {
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [checkInTime] = useState('09:02');

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getAttendanceForDate = (date: Date): AttendanceRecord | undefined => {
    return attendanceRecords.find(record => 
      isSameDay(parseISO(record.date), date)
    );
  };

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    toast.success('Checked in successfully at ' + format(new Date(), 'h:mm a'));
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    toast.success('Checked out successfully at ' + format(new Date(), 'h:mm a'));
  };

  const statusConfig = {
    present: { icon: CheckCircle2, label: 'Present', class: 'status-present' },
    absent: { icon: XCircle, label: 'Absent', class: 'status-absent' },
    leave: { icon: Coffee, label: 'Leave', class: 'status-leave' },
    halfday: { icon: AlertCircle, label: 'Half-day', class: 'status-halfday' },
  };

  const stats = {
    present: attendanceRecords.filter(r => r.status === 'present').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    leave: attendanceRecords.filter(r => r.status === 'leave').length,
    halfday: attendanceRecords.filter(r => r.status === 'halfday').length,
    avgHours: (attendanceRecords.reduce((sum, r) => sum + (r.workHours || 0), 0) / attendanceRecords.filter(r => r.workHours).length).toFixed(1),
  };

  return (
    <DashboardLayout
      title="Attendance"
      subtitle="Track your daily attendance and work hours"
    >
      <div className="space-y-6">
        {/* Check-in/out Card */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-primary/10">
                  <Clock className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today, {format(new Date(), 'MMMM d')}</p>
                  <p className="text-3xl font-bold text-foreground">{format(new Date(), 'h:mm a')}</p>
                  {isCheckedIn && (
                    <p className="text-sm text-status-present flex items-center gap-1 mt-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Checked in at {checkInTime} AM
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant={isCheckedIn ? 'secondary' : 'default'}
                  disabled={isCheckedIn}
                  onClick={handleCheckIn}
                  className="flex-1 md:flex-none"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Check In
                </Button>
                <Button
                  size="lg"
                  variant={!isCheckedIn ? 'secondary' : 'destructive'}
                  disabled={!isCheckedIn}
                  onClick={handleCheckOut}
                  className="flex-1 md:flex-none"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Check Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-status-present">{stats.present}</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-status-absent">{stats.absent}</p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-status-leave">{stats.leave}</p>
              <p className="text-sm text-muted-foreground">Leave</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-status-halfday">{stats.halfday}</p>
              <p className="text-sm text-muted-foreground">Half-day</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.avgHours}h</p>
              <p className="text-sm text-muted-foreground">Avg Hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Views */}
        <Tabs defaultValue="weekly" className="space-y-6">
          <TabsList className="bg-card border shadow-sm">
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="daily">Daily Log</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Weekly Attendance</CardTitle>
                  <CardDescription>
                    {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeek(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((day, i) => {
                    const attendance = getAttendanceForDate(day);
                    const isToday = isSameDay(day, new Date());
                    const status = attendance?.status || (day > new Date() ? null : 'absent');
                    const StatusIcon = status ? statusConfig[status].icon : null;

                    return (
                      <div
                        key={i}
                        className={cn(
                          'p-4 rounded-xl text-center transition-all',
                          isToday ? 'ring-2 ring-primary ring-offset-2' : '',
                          status && statusConfig[status].class,
                          !status && 'bg-secondary/30'
                        )}
                      >
                        <p className="text-xs font-medium text-muted-foreground uppercase">
                          {format(day, 'EEE')}
                        </p>
                        <p className="text-lg font-bold mt-1">{format(day, 'd')}</p>
                        {StatusIcon && (
                          <StatusIcon className="h-5 w-5 mx-auto mt-2" />
                        )}
                        {attendance?.workHours && (
                          <p className="text-xs mt-1">{attendance.workHours}h</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Attendance Log</CardTitle>
                <CardDescription>Detailed daily attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Work Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => {
                      const StatusConfig = statusConfig[record.status];
                      return (
                        <TableRow key={record.id} className="hover:bg-secondary/30">
                          <TableCell className="font-medium">
                            {format(parseISO(record.date), 'EEE, MMM d, yyyy')}
                          </TableCell>
                          <TableCell>{record.checkIn || '-'}</TableCell>
                          <TableCell>{record.checkOut || '-'}</TableCell>
                          <TableCell>{record.workHours ? `${record.workHours}h` : '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={StatusConfig.class}>
                              <StatusConfig.icon className="h-3 w-3 mr-1" />
                              {StatusConfig.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
