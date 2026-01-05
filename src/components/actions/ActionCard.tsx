import { ActionItem } from '@/types/mail';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertTriangle, ChevronRight } from 'lucide-react';

interface ActionCardProps {
  action: ActionItem;
  onComplete: () => void;
  onClick: () => void;
}

const statusConfig = {
  pending: {
    icon: Clock,
    className: 'text-muted-foreground bg-muted',
    label: 'Pending',
  },
  urgent: {
    icon: AlertTriangle,
    className: 'text-destructive bg-destructive/10',
    label: 'Urgent',
  },
  completed: {
    icon: CheckCircle,
    className: 'text-success bg-success/10',
    label: 'Completed',
  },
};

const ActionCard = ({ action, onComplete, onClick }: ActionCardProps) => {
  const config = statusConfig[action.status];
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        'mail-card flex flex-col gap-3 group',
        action.status === 'completed' && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className={cn('p-2 rounded-xl', config.className)}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm mb-0.5">{action.action}</p>
          <p className="text-xs text-muted-foreground truncate">
            From: {action.mailSender}
          </p>
          {action.dueDate && (
            <p className="text-xs text-muted-foreground mt-1">
              Due {formatDistanceToNow(action.dueDate, { addSuffix: true })}
            </p>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Action Button */}
      {action.status !== 'completed' && (
        <Button
          variant="success"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          className="self-start"
        >
          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
          Mark Complete
        </Button>
      )}
    </div>
  );
};

export default ActionCard;
