import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { leaveRequests, leaveBalance, LeaveRequest } from '@/lib/mockData';
import { format, parseISO, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Leave() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [leaves, setLeaves] = useState(leaveRequests.filter(l => l.employeeId === '1'));
  const [formData, setFormData] = useState({
    type: 'paid' as 'paid' | 'sick' | 'unpaid',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLeave: LeaveRequest = {
      id: Date.now().toString(),
      employeeId: '1',
      employeeName: `${user?.firstName} ${user?.lastName}`,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    setLeaves([newLeave, ...leaves]);
    setFormData({ type: 'paid', startDate: '', endDate: '', reason: '' });
    setIsDialogOpen(false);
    toast.success('Leave request submitted successfully!');
  };

  const statusConfig = {
    pending: { icon: Clock, label: 'Pending', class: 'status-pending' },
    approved: { icon: CheckCircle2, label: 'Approved', class: 'status-approved' },
    rejected: { icon: XCircle, label: 'Rejected', class: 'status-rejected' },
  };

  const leaveTypeColors = {
    paid: 'bg-status-approved/10 text-status-approved',
    sick: 'bg-status-pending/10 text-status-pending',
    unpaid: 'bg-muted text-muted-foreground',
  };

  return (
    <DashboardLayout
      title="Leave Management"
      subtitle="Apply for leave and track your requests"
    >
      <div className="space-y-6">
        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(leaveBalance).map(([type, balance]) => (
            <Card key={type} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold capitalize text-foreground">{type} Leave</p>
                  <Badge variant="outline" className={leaveTypeColors[type as keyof typeof leaveTypeColors]}>
                    {balance.remaining} days left
                  </Badge>
                </div>
                <Progress
                  value={(balance.remaining / (balance.total || 1)) * 100}
                  className="h-2 mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Used: {balance.used}</span>
                  <span>Total: {balance.total}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Apply Leave Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Apply for Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>
                  Fill in the details below to submit your leave request.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Leave Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'paid' | 'sick' | 'unpaid') =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Briefly describe the reason for your leave..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Leave Requests */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-card border shadow-sm">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {tab === 'all' ? 'All Leave Requests' : `${tab.charAt(0).toUpperCase() + tab.slice(1)} Requests`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaves
                      .filter(l => tab === 'all' || l.status === tab)
                      .map((leave) => {
                        const StatusConfig = statusConfig[leave.status];
                        const days = differenceInDays(parseISO(leave.endDate), parseISO(leave.startDate)) + 1;

                        return (
                          <div
                            key={leave.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              <div className={cn(
                                'p-3 rounded-xl',
                                leave.status === 'pending' && 'bg-status-pending/10',
                                leave.status === 'approved' && 'bg-status-approved/10',
                                leave.status === 'rejected' && 'bg-status-rejected/10',
                              )}>
                                <CalendarDays className={cn(
                                  'h-5 w-5',
                                  leave.status === 'pending' && 'text-status-pending',
                                  leave.status === 'approved' && 'text-status-approved',
                                  leave.status === 'rejected' && 'text-status-rejected',
                                )} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className={leaveTypeColors[leave.type]}>
                                    {leave.type}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {days} day{days > 1 ? 's' : ''}
                                  </span>
                                </div>
                                <p className="font-medium text-foreground">
                                  {format(parseISO(leave.startDate), 'MMM d')} - {format(parseISO(leave.endDate), 'MMM d, yyyy')}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">{leave.reason}</p>
                                {leave.reviewComment && (
                                  <p className="text-sm text-muted-foreground mt-2 italic">
                                    "{leave.reviewComment}"
                                  </p>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline" className={cn('self-start sm:self-center', StatusConfig.class)}>
                              <StatusConfig.icon className="h-3 w-3 mr-1" />
                              {StatusConfig.label}
                            </Badge>
                          </div>
                        );
                      })}
                    {leaves.filter(l => tab === 'all' || l.status === tab).length === 0 && (
                      <div className="text-center py-8">
                        <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground">No {tab === 'all' ? '' : tab} leave requests found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
