import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type RoleType = 'employee' | 'admin';

export default function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    password: '',
    role: 'employee' as RoleType,
  });

  const passwordStrength = getPasswordStrength(formData.password);

  function getPasswordStrength(password: string): { score: number; label: string; color: string } {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-destructive' };
    if (score <= 3) return { score, label: 'Fair', color: 'bg-status-pending' };
    if (score <= 4) return { score, label: 'Good', color: 'bg-status-leave' };
    return { score, label: 'Strong', color: 'bg-status-approved' };
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await signup(formData.employeeId, formData.email, formData.password, formData.role);
      if (success) {
        toast.success('Account created successfully!');
        navigate(formData.role === 'admin' ? '/admin/dashboard' : '/dashboard');
      } else {
        toast.error('Failed to create account');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-up">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-primary-foreground font-bold text-xl">D</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Dayflow</h2>
              <p className="text-xs text-muted-foreground">Human Resource Management</p>
            </div>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Create your account</h1>
            <p className="mt-2 text-muted-foreground">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">I am a</Label>
              <div className="grid grid-cols-2 gap-3">
                {(['employee', 'admin'] as RoleType[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                      formData.role === role
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/30'
                    )}
                  >
                    <span className={cn(
                      'text-sm font-semibold',
                      formData.role === role ? 'text-primary' : 'text-foreground'
                    )}>
                      {role === 'employee' ? 'Employee' : 'HR / Admin'}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {role === 'employee' ? 'Access personal dashboard' : 'Manage all employees'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Employee ID */}
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-sm font-medium">Employee ID</Label>
              <Input
                id="employeeId"
                placeholder="e.g., EMP001"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="h-12"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {formData.password && (
                <div className="space-y-2 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          'h-1 flex-1 rounded-full transition-colors',
                          i <= passwordStrength.score ? passwordStrength.color : 'bg-muted'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password strength: <span className="font-medium">{passwordStrength.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Terms */}
          <p className="text-xs text-muted-foreground text-center">
            By signing up, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-sidebar">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-20">
          <div className="space-y-8 max-w-lg">
            <h2 className="text-3xl xl:text-4xl font-bold text-sidebar-primary-foreground leading-tight">
              Every workday,<br />perfectly aligned.
            </h2>
            <p className="text-lg text-sidebar-foreground/80">
              Streamline your HR operations with Dayflow. Manage attendance, leave requests, payroll, and more—all in one place.
            </p>

            {/* Features */}
            <div className="space-y-4 pt-4">
              {[
                'Track attendance in real-time',
                'Manage leave requests effortlessly',
                'Automated payroll processing',
                'Comprehensive analytics dashboard',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-sidebar-primary-foreground/20 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-sidebar-primary-foreground" />
                  </div>
                  <span className="text-sidebar-foreground/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sidebar-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-sidebar-primary-foreground/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
