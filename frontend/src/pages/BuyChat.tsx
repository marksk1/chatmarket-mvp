
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatInterface from '@/components/ChatInterface';
import { useApp } from '@/context/AppContext';

const BuyChat = () => {
  const navigate = useNavigate();
  const { clearChat } = useApp();

  const handleBack = () => {
    clearChat();
    navigate(-1);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Find Items</h1>
            <p className="text-sm text-gray-500">Chat with AI to discover great deals</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1">
        <ChatInterface type="buy" />
      </div>
    </div>
  );
};

export default BuyChat;
