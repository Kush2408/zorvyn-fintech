import { Moon, Sun, Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useRole } from '@/contexts/RoleContext';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { role } = useRole();
  const { isSyncing } = useApi();

  return (
    <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="hidden md:flex" />
        <h1 className="text-lg font-semibold md:hidden" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Zorvyn Finance
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {isSyncing && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            <span>Syncing...</span>
          </div>
        )}
        <Badge
          variant={role === 'admin' ? 'default' : 'secondary'}
          className={role === 'admin' ? 'bg-primary text-primary-foreground' : ''}
        >
          {role === 'admin' ? 'Admin' : 'Viewer'}
        </Badge>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
