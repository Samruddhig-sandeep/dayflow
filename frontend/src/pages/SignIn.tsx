import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type RoleType = 'employee' | 'admin';

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'employee' as RoleType,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password, formData.role);
      if (success) {
        toast.success('Welcome back!');
        navigate(formData.role === 'admin' ? '/admin/dashboard' : '/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-sidebar">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-20">
          <div className="space-y-8 max-w-lg">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-sidebar-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
                <span className="text-sidebar-primary-foreground font-bold text-2xl">D</span>
              </div>
            </div>

            <h2 className="text-3xl xl:text-4xl font-bold text-sidebar-primary-foreground leading-tight">
              Welcome back to<br />Dayflow HRMS
            </h2>
            <p className="text-lg text-sidebar-foreground/80">
              Your complete human resource management solution. Sign in to access your dashboard.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { value: '500+', label: 'Companies' },
                { value: '50K+', label: 'Employees' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl font-bold text-sidebar-primary-foreground">{stat.value}</p>
                  <p className="text-sm text-sidebar-foreground/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sidebar-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-sidebar-primary-foreground/10 rounded-full blur-2xl" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-up">
          {/* Logo - mobile only */}
          <div className="flex lg:hidden items-center gap-3 mb-4">
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Sign in to your account</h1>
            <p className="mt-2 text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sign in as</Label>
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
                      {role === 'employee' ? 'Personal dashboard' : 'Admin dashboard'}
                    </p>
                  </button>
                ))}
              </div>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="bg-secondary/50 rounded-xl p-4 border border-border">
            <p className="text-sm font-medium text-foreground mb-2">Demo Credentials</p>
            <p className="text-xs text-muted-foreground">
              Use any email and password to sign in. Select your role above to access different dashboards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
