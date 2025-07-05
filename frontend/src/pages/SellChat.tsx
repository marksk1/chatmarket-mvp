
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatInterface from '@/components/ChatInterface';
import DraftListingModal from '@/components/DraftListingModal';
import { useApp } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

const SellChat = () => {
  const navigate = useNavigate();
  const { clearChat } = useApp();
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const chatTitle = "Vintage Americana Sneakers";

  const handleBack = () => {
    clearChat();
    navigate('/');
  };

  const handleSaveListing = () => {
    setIsDraftModalOpen(false);
    toast({
      title: "Listing saved!",
      description: "Your listing has been saved to drafts.",
    });
  };

  const handleRemoveListing = () => {
    setIsDraftModalOpen(false);
    toast({
      title: "Listing removed",
      description: "Your draft listing has been deleted.",
    });
  };

  const handleModifyViaChat = () => {
    setIsDraftModalOpen(false);
    toast({
      title: "Returning to chat",
      description: "Continue modifying your listing via chat.",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-green-600" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Sell Chat</span>
                  <span className="text-sm text-gray-400">›</span>
                  <span className="text-sm font-medium text-gray-900">{chatTitle}</span>
                </div>
                <p className="text-xs text-gray-500">Chat with AI to create your listing</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1">
        <ChatInterface 
          type="sell" 
          onViewDraftListing={() => setIsDraftModalOpen(true)}
        />
      </div>

      {/* Draft Listing Modal */}
      <DraftListingModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        onSave={handleSaveListing}
        onRemove={handleRemoveListing}
        onModifyViaChat={handleModifyViaChat}
      />
    </div>
  );
};

export default SellChat;
