import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Mic, Inbox, Zap, FileText, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const placeholders = [
  "Summarize my latest mail",
  "Any bills I need to pay?",
  "Show important letters this week",
  "Add reminders from my mail",
];

const quickActions = [
  { icon: Inbox, label: "View Inbox", description: "See all your mail", route: "/inbox" },
  { icon: Zap, label: "Pending Actions", description: "Tasks that need attention", route: "/actions" },
  { icon: FileText, label: "Summarize Mail", description: "AI-powered summaries", route: "/inbox" },
  { icon: Clock, label: "Deadlines", description: "Upcoming due dates", route: "/actions" },
];

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate('/inbox', { state: { query } });
    }
  };

  const handleActionClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        {/* AI Welcome Message */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl">👋</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Hi, I'm MailMate
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            I can read, organize, and take action on your mail.<br />
            What would you like to do today?
          </p>
        </div>

        {/* Chat Input - ChatGPT Style */}
        <form 
          onSubmit={handleSubmit}
          className={`w-full max-w-2xl mb-10 transition-all duration-300 ${
            isFocused ? 'scale-[1.02]' : ''
          }`}
        >
          <div className={`relative rounded-2xl border-2 bg-card shadow-lg transition-all duration-300 ${
            isFocused 
              ? 'border-primary shadow-xl shadow-primary/10' 
              : 'border-border hover:border-primary/50'
          }`}>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholders[placeholderIndex]}
              className="h-14 px-5 pr-24 text-base border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                className="h-10 w-10 text-muted-foreground hover:text-foreground"
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Button 
                type="submit" 
                size="icon"
                className="h-10 w-10 rounded-xl"
                disabled={!query.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mb-8">
          {quickActions.map((action, index) => (
            <button
              key={action.label}
              onClick={() => handleActionClick(action.route)}
              className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <action.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">{action.label}</h3>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </button>
          ))}
        </div>

        {/* AI Context Preview */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-up">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>I've reviewed <strong className="text-foreground">12 new letters</strong> and found <strong className="text-foreground">3 that need attention</strong>.</span>
        </div>
      </main>
    </div>
  );
};

export default Home;
