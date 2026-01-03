import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  Wallet,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { salarySlips, SalarySlip } from '@/lib/mockData';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Payroll() {
  const { user } = useAuth();
  const latestSlip = salarySlips[0];

  const handleDownload = (slip: SalarySlip) => {
    toast.success(`Downloading ${slip.month} ${slip.year} salary slip...`);
  };

  const yearlyTotal = salarySlips.reduce((sum, s) => sum + s.netSalary, 0);
  const yearlyGross = salarySlips.reduce((sum, s) => sum + s.basicSalary + s.allowances, 0);
  const yearlyDeductions = salarySlips.reduce((sum, s) => sum + s.deductions, 0);

  return (
    <DashboardLayout
      title="Payroll"
      subtitle="View your salary and payment history"
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-2 border-0 shadow-sm overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Annual Salary</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    ${user?.salary?.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ${((user?.salary || 0) / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}/month
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-primary/10">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-5 w-5 text-status-approved" />
                <Badge variant="secondary" className="text-xs">YTD</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <p className="text-xl font-bold text-foreground">${yearlyGross.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <TrendingDown className="h-5 w-5 text-status-absent" />
                <Badge variant="secondary" className="text-xs">YTD</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Deductions</p>
              <p className="text-xl font-bold text-foreground">${yearlyDeductions.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Latest Payslip Detail */}
        {latestSlip && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Latest Salary Slip</CardTitle>
                <CardDescription>
                  {latestSlip.month} {latestSlip.year}
                </CardDescription>
              </div>
              <Button onClick={() => handleDownload(latestSlip)}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/30 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Earnings */}
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-4">Earnings</p>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Basic Salary</span>
                        <span className="text-sm font-medium text-foreground">
                          ${latestSlip.basicSalary.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Allowances</span>
                        <span className="text-sm font-medium text-foreground">
                          ${latestSlip.allowances.toLocaleString()}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-foreground">Gross Salary</span>
                        <span className="text-sm font-bold text-foreground">
                          ${(latestSlip.basicSalary + latestSlip.allowances).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-4">Deductions</p>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tax</span>
                        <span className="text-sm font-medium text-destructive">
                          -${(latestSlip.deductions * 0.7).toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Insurance</span>
                        <span className="text-sm font-medium text-destructive">
                          -${(latestSlip.deductions * 0.3).toFixed(0)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-foreground">Total Deductions</span>
                        <span className="text-sm font-bold text-destructive">
                          -${latestSlip.deductions.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Net Pay */}
                  <div className="flex flex-col justify-center items-center p-6 bg-primary/5 rounded-xl border border-primary/10">
                    <p className="text-sm text-muted-foreground">Net Salary</p>
                    <p className="text-3xl font-bold text-primary mt-2">
                      ${latestSlip.netSalary.toLocaleString()}
                    </p>
                    <Badge className="mt-3 status-approved">
                      Paid on {format(parseISO(latestSlip.paidOn!), 'MMM d')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment History */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Payment History</CardTitle>
            <CardDescription>Your salary slips from previous months</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Period</TableHead>
                  <TableHead>Gross</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salarySlips.map((slip) => (
                  <TableRow key={slip.id} className="hover:bg-secondary/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{slip.month} {slip.year}</p>
                          {slip.paidOn && (
                            <p className="text-xs text-muted-foreground">
                              Paid {format(parseISO(slip.paidOn), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      ${(slip.basicSalary + slip.allowances).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-destructive">
                      -${slip.deductions.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      ${slip.netSalary.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={slip.status === 'paid' ? 'status-approved' : 'status-pending'}>
                        {slip.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(slip)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
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
