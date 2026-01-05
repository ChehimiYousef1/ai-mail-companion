import { useState } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import ActionCard from '@/components/actions/ActionCard';
import { mockActions } from '@/data/mockData';
import { ActionItem } from '@/types/mail';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

type FilterStatus = 'all' | 'urgent' | 'pending' | 'completed';

const Actions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [actions, setActions] = useState<ActionItem[]>(mockActions);

  const filteredActions = actions.filter((action) => {
    const matchesSearch =
      action.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.mailSender.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filter === 'all' || action.status === filter;

    return matchesSearch && matchesFilter;
  });

  const handleComplete = (id: string) => {
    setActions((prev) =>
      prev.map((action) =>
        action.id === id ? { ...action, status: 'completed' as const } : action
      )
    );
    toast.success('Action completed!', {
      description: 'Great job staying on top of your mail.',
    });
  };

  const filters: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
  ];

  const urgentCount = actions.filter((a) => a.status === 'urgent').length;
  const pendingCount = actions.filter((a) => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* Stats */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 mail-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-destructive/10">
                <Sparkles className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{urgentCount}</p>
                <p className="text-xs text-muted-foreground">Urgent</p>
              </div>
            </div>
          </div>
          <div className="flex-1 mail-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {filters.map(({ value, label }) => (
            <Button
              key={value}
              variant={filter === value ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setFilter(value)}
              className="shrink-0"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Action List */}
        <div className="space-y-3">
          {filteredActions.map((action, index) => (
            <div
              key={action.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ActionCard
                action={action}
                onComplete={() => handleComplete(action.id)}
                onClick={() => {}}
              />
            </div>
          ))}

          {filteredActions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No actions found</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Actions;
