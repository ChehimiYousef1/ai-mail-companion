import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppSidebar from './AppSidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebarToggle?: boolean;
}

const MainLayout = ({ children, showSidebarToggle = true }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toggle button when sidebar is closed */}
        {showSidebarToggle && !sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="fixed top-3 left-3 z-30 h-10 w-10 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <main className={cn(
          "flex-1 transition-all duration-300",
          !sidebarOpen && showSidebarToggle && "md:pl-0"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
