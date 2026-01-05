import { Plus, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

const FloatingActionButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleScan = () => {
    toast.success('Scanner ready!', {
      description: 'Position your mail document to scan.',
    });
    setIsExpanded(false);
  };

  const handleAdd = () => {
    toast.info('Add mail manually', {
      description: 'You can add mail details manually.',
    });
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 right-6 flex flex-col items-end gap-3 z-40">
      {/* Expanded Actions */}
      {isExpanded && (
        <>
          <button
            onClick={handleScan}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card shadow-card text-sm font-medium animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            <Scan className="w-4 h-4 text-primary" />
            Scan Mail
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card shadow-card text-sm font-medium animate-fade-up"
          >
            <Plus className="w-4 h-4 text-primary" />
            Add Manually
          </button>
        </>
      )}

      {/* Main FAB */}
      <Button
        variant="fab"
        size="fab"
        onClick={() => setIsExpanded(!isExpanded)}
        className={isExpanded ? 'rotate-45' : ''}
      >
        <Plus className="w-6 h-6 transition-transform duration-200" />
      </Button>
    </div>
  );
};

export default FloatingActionButton;
