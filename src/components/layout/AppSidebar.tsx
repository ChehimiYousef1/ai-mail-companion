import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  Plus, 
  Inbox, 
  Zap, 
  Settings, 
  CreditCard,
  MoreHorizontal,
  Trash2,
  Edit3,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Conversation {
  id: string;
  title: string;
  date: string;
}

const mockConversations: Conversation[] = [
  { id: '1', title: 'Summarize utility bills', date: 'Today' },
  { id: '2', title: 'Insurance renewal reminder', date: 'Today' },
  { id: '3', title: 'Tax documents overview', date: 'Yesterday' },
  { id: '4', title: 'Bank statement analysis', date: 'Yesterday' },
  { id: '5', title: 'Medical bills summary', date: 'Previous 7 Days' },
  { id: '6', title: 'Subscription renewals', date: 'Previous 7 Days' },
];

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AppSidebar = ({ isOpen, onToggle }: AppSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations] = useState<Conversation[]>(mockConversations);

  const groupedConversations = conversations.reduce((acc, conv) => {
    if (!acc[conv.date]) {
      acc[conv.date] = [];
    }
    acc[conv.date].push(conv);
    return acc;
  }, {} as Record<string, Conversation[]>);

  const navItems = [
    { icon: Inbox, label: 'Inbox', path: '/inbox' },
    { icon: Zap, label: 'Actions', path: '/actions' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: CreditCard, label: 'Subscription', path: '/subscription' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-0 md:w-0",
        "md:relative"
      )}>
        <div className={cn(
          "flex flex-col h-full overflow-hidden",
          isOpen ? "opacity-100" : "opacity-0"
        )}>
          {/* Header */}
          <div className="p-3 flex items-center justify-between border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="font-display font-semibold">Inboxly</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={onToggle}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <Button 
              onClick={() => navigate('/')}
              className="w-full justify-start gap-2 rounded-xl"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {Object.entries(groupedConversations).map(([date, convs]) => (
              <div key={date} className="mb-4">
                <p className="px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {date}
                </p>
                <div className="space-y-0.5">
                  {convs.map((conv) => (
                    <div
                      key={conv.id}
                      className="group flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors"
                    >
                      <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-sidebar-foreground truncate flex-1">
                        {conv.title}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem>
                            <Edit3 className="h-3 w-3 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Items */}
          <div className="border-t border-sidebar-border p-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  location.pathname === item.path
                    ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
