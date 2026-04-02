import { useRole, Role } from '@/contexts/RoleContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, Palette, Database } from 'lucide-react';

export default function SettingsPage() {
  const { role, setRole } = useRole();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>

      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-medium">Role Management</h2>
        </div>
        <div className="space-y-2">
          <Label>Current Role</Label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin — Full access to add, edit, and delete</SelectItem>
              <SelectItem value="viewer">Viewer — Read-only access</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {role === 'admin'
              ? 'You can add, edit, and delete transactions.'
              : 'You have read-only access. Switch to Admin for full control.'}
          </p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Palette className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-medium">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Dark Mode</Label>
            <p className="text-xs text-muted-foreground">Toggle between dark and light themes</p>
          </div>
          <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
        </div>
      </div>

      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Database className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-medium">Data Storage</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          All transactions and preferences are stored in your browser's localStorage. Data persists across sessions but is local to this device.
        </p>
      </div>
    </div>
  );
}
