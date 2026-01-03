import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  FileText,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const infoItems = [
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: Phone, label: 'Phone', value: user?.phone, editable: true },
    { icon: MapPin, label: 'Address', value: user?.address, editable: true },
    { icon: Building2, label: 'Department', value: user?.department },
    { icon: Briefcase, label: 'Position', value: user?.position },
    { icon: Calendar, label: 'Join Date', value: user?.joinDate ? format(parseISO(user.joinDate), 'MMMM d, yyyy') : '' },
  ];

  const documents = [
    { name: 'Employment Contract', type: 'PDF', size: '2.4 MB', date: '2022-03-15' },
    { name: 'ID Verification', type: 'PDF', size: '1.1 MB', date: '2022-03-15' },
    { name: 'Tax Documents', type: 'PDF', size: '856 KB', date: '2025-01-02' },
    { name: 'Training Certificate', type: 'PDF', size: '1.8 MB', date: '2024-06-20' },
  ];

  return (
    <DashboardLayout
      title="My Profile"
      subtitle="View and manage your personal information"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary to-primary/60" />
          <CardContent className="relative pb-6">
            <div className="absolute -top-12 left-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-card shadow-lg">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {user?.firstName[0]}{user?.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="pt-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-muted-foreground">{user?.position}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="status-approved">Active</Badge>
                  <Badge variant="secondary">{user?.employeeId}</Badge>
                </div>
              </div>
              <Button
                variant={isEditing ? 'outline' : 'default'}
                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="bg-card border shadow-sm">
            <TabsTrigger value="personal">Personal Details</TabsTrigger>
            <TabsTrigger value="job">Job Details</TabsTrigger>
            <TabsTrigger value="salary">Salary</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
                <CardDescription>Your basic personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {infoItems.slice(0, 3).map((item, i) => (
                      <div key={i} className={cn(
                        'flex items-start gap-4 p-4 rounded-xl bg-secondary/30',
                        item.label === 'Address' && 'md:col-span-2'
                      )}>
                        <div className="p-2.5 rounded-lg bg-primary/10">
                          <item.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          <p className="font-medium text-foreground truncate">{item.value}</p>
                        </div>
                        {item.editable && (
                          <Badge variant="outline" className="text-xs">Editable</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="job" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Job Information</CardTitle>
                <CardDescription>Your employment details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {infoItems.slice(3).map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30">
                      <div className="p-2.5 rounded-lg bg-primary/10">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-medium text-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="salary" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Salary Structure</CardTitle>
                <CardDescription>Your compensation details (read-only)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                    <DollarSign className="h-8 w-8 text-primary mb-3" />
                    <p className="text-sm text-muted-foreground">Annual Salary</p>
                    <p className="text-2xl font-bold text-foreground">${user?.salary?.toLocaleString()}</p>
                  </div>
                  <div className="p-6 rounded-xl bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Monthly Gross</p>
                    <p className="text-xl font-bold text-foreground">
                      ${((user?.salary || 0) / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="p-6 rounded-xl bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Pay Frequency</p>
                    <p className="text-xl font-bold text-foreground">Monthly</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  For salary-related inquiries, please contact the HR department.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Documents</CardTitle>
                <CardDescription>Your uploaded documents and files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-lg bg-destructive/10">
                          <FileText className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{doc.type} • {doc.size}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(doc.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
