import { useState } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bot, Bell, Link2, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type AIPersonality = 'friendly' | 'professional' | 'witty';

const Settings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [personality, setPersonality] = useState<AIPersonality>('friendly');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  const personalities: { value: AIPersonality; label: string; description: string; sample: string }[] = [
    {
      value: 'friendly',
      label: 'Friendly',
      description: 'Warm and approachable',
      sample: "Hey there! 👋 I've got your mail sorted. Ready when you are!",
    },
    {
      value: 'professional',
      label: 'Professional',
      description: 'Clear and efficient',
      sample: 'Your mail has been organized. 3 items require attention.',
    },
    {
      value: 'witty',
      label: 'Witty',
      description: 'Fun and playful',
      sample: "Another day, another stack of mail! Let's tackle it together 🚀",
    },
  ];

  const connectedApps = [
    { name: 'Google Calendar', connected: true },
    { name: 'Slack', connected: false },
    { name: 'Google Drive', connected: false },
  ];

  const handleConnect = (app: string) => {
    toast.info(`Connecting to ${app}...`, {
      description: 'This feature will be available soon.',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-6">
        {/* AI Personality */}
        <section className="mail-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">AI Personality</h3>
              <p className="text-xs text-muted-foreground">Choose how MailMate speaks to you</p>
            </div>
          </div>

          <div className="space-y-3">
            {personalities.map(({ value, label, description, sample }) => (
              <button
                key={value}
                onClick={() => {
                  setPersonality(value);
                  toast.success(`AI personality set to ${label}!`);
                }}
                className={cn(
                  'w-full text-left p-3 rounded-xl border-2 transition-all duration-200',
                  personality === value
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent bg-secondary/50 hover:bg-secondary'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{label}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </div>
                <p className="text-xs text-muted-foreground italic">"{sample}"</p>
              </button>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="mail-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-accent/20">
              <Bell className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-xs text-muted-foreground">Manage how you receive updates</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push" className="flex flex-col gap-0.5">
                <span>Push Notifications</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Get instant alerts on your device
                </span>
              </Label>
              <Switch
                id="push"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="email" className="flex flex-col gap-0.5">
                <span>Email Digest</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Daily summary of important mail
                </span>
              </Label>
              <Switch
                id="email"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </div>
        </section>

        {/* Connected Apps */}
        <section className="mail-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-success/10">
              <Link2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">Connected Apps</h3>
              <p className="text-xs text-muted-foreground">Integrate with your favorite tools</p>
            </div>
          </div>

          <div className="space-y-2">
            {connectedApps.map((app) => (
              <div
                key={app.name}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
              >
                <span className="text-sm font-medium">{app.name}</span>
                {app.connected ? (
                  <span className="text-xs text-success font-medium">Connected</span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConnect(app.name)}
                  >
                    Connect
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="mail-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Inboxly</h3>
              <p className="text-xs text-muted-foreground">Version 1.0.0 MVP</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Settings;
