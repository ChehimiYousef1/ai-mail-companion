export type MailStatus = 'important' | 'action' | 'archived' | 'normal';

export interface Mail {
  id: string;
  sender: string;
  senderEmail: string;
  senderAvatar?: string;
  subject: string;
  preview: string;
  content: string;
  date: Date;
  status: MailStatus;
  isRead: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ActionItem {
  id: string;
  mailId: string;
  mailSubject: string;
  mailSender: string;
  action: string;
  status: 'pending' | 'completed' | 'urgent';
  dueDate?: Date;
}
