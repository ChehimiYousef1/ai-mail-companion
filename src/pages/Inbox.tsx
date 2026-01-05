import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import MailCard from '@/components/mail/MailCard';
import ChatPanel from '@/components/mail/ChatPanel';
import FloatingActionButton from '@/components/fab/FloatingActionButton';
import { mockMails } from '@/data/mockData';
import { Mail } from '@/types/mail';

const Inbox = () => {
  const location = useLocation();
  const initialQuery = location.state?.query || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);

  const filteredMails = mockMails.filter(
    (mail) =>
      mail.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mail.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* Unread Count */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg">
            {filteredMails.filter((m) => !m.isRead).length} unread
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredMails.length} total
          </span>
        </div>

        {/* Mail List */}
        <div className="space-y-3">
          {filteredMails.map((mail, index) => (
            <MailCard
              key={mail.id}
              mail={mail}
              onClick={() => setSelectedMail(mail)}
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))}

          {filteredMails.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No mail found</p>
            </div>
          )}
        </div>
      </main>

      <FloatingActionButton />
      <BottomNav />

      {/* Chat Panel */}
      {selectedMail && (
        <ChatPanel mail={selectedMail} onClose={() => setSelectedMail(null)} />
      )}
    </div>
  );
};

export default Inbox;
