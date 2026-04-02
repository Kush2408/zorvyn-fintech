import { LayoutDashboard, ArrowLeftRight, BarChart3, Settings } from 'lucide-react';
import { NavLink } from '@/components/NavLink';

const items = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Transactions', url: '/transactions', icon: ArrowLeftRight },
  { title: 'Insights', url: '/insights', icon: BarChart3 },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === '/'}
            className="flex flex-col items-center gap-1 px-3 py-1.5 text-muted-foreground transition-colors text-xs"
            activeClassName="text-primary"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
