import { Mail, MailStatus } from '@/types/mail';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Archive, ChevronRight, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface MailCardProps {
  mail: Mail;
  onClick: () => void;
  style?: React.CSSProperties;
}

const statusConfig: Record<MailStatus, { label: string; className: string; icon: React.ReactNode }> = {
  important: {
    label: 'Important',
    className: 'status-important',
    icon: <AlertCircle className="w-3 h-3" />,
  },
  action: {
    label: 'Action Required',
    className: 'status-action',
    icon: <Clock className="w-3 h-3" />,
  },
  archived: {
    label: 'Archived',
    className: 'status-archived',
    icon: <Archive className="w-3 h-3" />,
  },
  normal: {
    label: '',
    className: '',
    icon: null,
  },
};

const MailCard = ({ mail, onClick, style }: MailCardProps) => {
  const { label, className, icon } = statusConfig[mail.status];
  const timeAgo = formatDistanceToNow(mail.date, { addSuffix: true });

  // Generate avatar initials and color
  const initials = mail.sender
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const avatarColors = [
    'from-primary/80 to-primary',
    'from-success/80 to-success',
    'from-accent/80 to-accent',
    'from-destructive/60 to-destructive',
  ];
  const avatarColor = avatarColors[mail.sender.length % avatarColors.length];

  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        'mail-card flex gap-4 items-start group',
        !mail.isRead && 'bg-primary/5 border-l-4 border-l-primary'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0',
          avatarColor
        )}
      >
        <span className="text-primary-foreground font-semibold text-sm">{initials}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className={cn('font-semibold text-sm', !mail.isRead && 'text-foreground')}>
            {mail.sender}
          </span>
          <span className="text-xs text-muted-foreground shrink-0">{timeAgo}</span>
        </div>

        <h3
          className={cn(
            'font-medium text-sm mb-1 truncate',
            mail.isRead ? 'text-muted-foreground' : 'text-foreground'
          )}
        >
          {mail.subject}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2">{mail.preview}</p>

        {/* Status Tag */}
        {mail.status !== 'normal' && (
          <div className="mt-2 flex items-center gap-2">
            <span className={cn('status-tag flex items-center gap-1', className)}>
              {icon}
              {label}
            </span>
          </div>
        )}
      </div>

      {/* Arrow */}
      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default MailCard;
