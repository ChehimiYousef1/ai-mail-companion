import { useState, useRef, useEffect } from 'react';
import { Mail, ChatMessage } from '@/types/mail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Send,
  Mic,
  Sparkles,
  Bell,
  Share2,
  CreditCard,
  FileText,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  mail: Mail;
  onClose: () => void;
}

const suggestedActions = [
  { label: 'Summarize', icon: FileText },
  { label: 'Add Reminder', icon: Bell },
  { label: 'Forward', icon: Share2 },
  { label: 'Pay', icon: CreditCard },
];

const ChatPanel = ({ mail, onClose }: ChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-generate summary on mount
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      const summary = generateSummary(mail);
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: summary,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [mail]);

  const generateSummary = (mail: Mail): string => {
    const summaries: Record<string, string> = {
      '1': `📊 **Bank Statement Summary**\n\nYour January statement shows a balance of **$4,523.67** with 3 pending transactions totaling $234.50.\n\nWould you like me to set a reminder to review this, or should I help you analyze your spending patterns?`,
      '2': `💧 **Water Bill Summary**\n\nAmount due: **$67.45**\nDue date: **January 15, 2025**\nUsage: 4,200 gallons (135/day average)\n\nThis is slightly higher than last month. Would you like me to pay this bill or set a payment reminder?`,
      '3': `📦 **Delivery Confirmed**\n\nYour Amazon order has been delivered!\n\n• Wireless Bluetooth Headphones\n• USB-C Charging Cable (2-pack)\n\nLeft at: Front door at 2:34 PM\n\nEverything looks good! Need me to do anything else with this?`,
      '4': `🏥 **Appointment Reminder**\n\nUpcoming visit with **Dr. Sarah Johnson**\n\n📅 January 8, 2025 at 10:30 AM\n📍 456 Medical Center Blvd, Suite 200\n\nRemember to arrive 15 minutes early. Want me to add this to your calendar?`,
      '5': `🎬 **Entertainment Update**\n\nNetflix has new content for you! Highlights include Stranger Things Season 5 and Wednesday Season 2.\n\nThis is just a promotional email - no action needed.`,
      '6': `📋 **Tax Documents Ready**\n\nYour 2024 tax documents are available:\n\n✅ Form W-2: Ready\n✅ Form 1099-INT: Ready\n⏳ Form 1099-DIV: Processing\n\n📅 Filing deadline: April 15, 2025\n\nWant me to remind you when all documents are ready?`,
    };

    return summaries[mail.id] || `Here's what I found in this mail from ${mail.sender}:\n\n${mail.preview}\n\nHow can I help you with this?`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Got it! I've noted that down. Is there anything else you'd like me to help with?",
        "I've added that to your action items. You'll get a reminder before the due date.",
        "Done! I've forwarded this to the right person. They should receive it shortly.",
        "Perfect! I can help you with that. Let me pull up the relevant information.",
      ];

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleAction = (action: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: action,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const actionResponses: Record<string, string> = {
        Summarize: "I've already provided a summary above! Let me know if you need more details on any specific part.",
        'Add Reminder': `✅ **Reminder Set!**\n\nI'll remind you about this mail from ${mail.sender} tomorrow morning. You can also find it in your Action Center.`,
        Forward: "Who would you like me to forward this to? Just give me an email address or contact name.",
        Pay: "I can help you pay this. Would you like to use your saved payment method, or set up a new one?",
      };

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: actionResponses[action] || "I'm on it! Let me help you with that.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-slide-in">
      {/* Header */}
      <header className="glass-header px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-sm truncate">{mail.sender}</h2>
          <p className="text-xs text-muted-foreground truncate">{mail.subject}</p>
        </div>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              'flex animate-fade-up',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={cn(
                'max-w-[85%] text-sm',
                message.role === 'user' ? 'user-bubble' : 'ai-bubble'
              )}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-up">
            <div className="ai-bubble flex items-center gap-1.5 px-4 py-3">
              <div className="typing-dot" style={{ animationDelay: '0ms' }} />
              <div className="typing-dot" style={{ animationDelay: '150ms' }} />
              <div className="typing-dot" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Actions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {suggestedActions.map(({ label, icon: Icon }) => (
          <Button
            key={label}
            variant="secondary"
            size="sm"
            onClick={() => handleAction(label)}
            className="shrink-0 gap-1.5"
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border/50 bg-background">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask MailMate anything..."
              className="pr-10 bg-secondary/50 border-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <Mic className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
          <Button onClick={handleSend} size="icon" disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
