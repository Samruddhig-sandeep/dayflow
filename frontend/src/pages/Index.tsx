import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Users, Clock, CalendarDays, Wallet, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  const features = [
    { icon: Users, title: 'Employee Management', desc: 'Manage all employee data in one place' },
    { icon: Clock, title: 'Attendance Tracking', desc: 'Real-time check-in/out with reports' },
    { icon: CalendarDays, title: 'Leave Management', desc: 'Streamlined leave request workflow' },
    { icon: Wallet, title: 'Payroll Processing', desc: 'Automated salary calculations' },
    { icon: BarChart3, title: 'Analytics', desc: 'Insights and detailed reports' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
            <span className="font-bold text-xl text-foreground">Dayflow</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            Every workday,<br />
            <span className="text-gradient">perfectly aligned.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Streamline your HR operations with Dayflow. Manage attendance, leave requests, payroll, and more—all in one powerful platform.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="xl" className="min-w-[200px]">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signin">
              <Button size="xl" variant="outline" className="min-w-[200px]">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Everything you need to manage HR
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl shadow-sm border border-border/50 card-hover text-center">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-3xl p-10 md:p-16 text-center" style={{ background: 'var(--gradient-hero)' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to transform your HR?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of companies using Dayflow to manage their workforce efficiently.
            </p>
            <Link to="/signup">
              <Button size="xl" variant="secondary" className="bg-card text-foreground hover:bg-card/90">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 Dayflow HRMS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
