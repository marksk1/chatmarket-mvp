
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/context/AppContext';

interface ChatInterfaceProps {
  type: 'buy' | 'sell';
  onComplete?: () => void;
  onViewDraftListing?: () => void;
}

const ChatInterface = ({ type, onComplete, onViewDraftListing }: ChatInterfaceProps) => {
  const { chatMessages, addChatMessage, setCurrentDraft } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showDraftButton, setShowDraftButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (chatMessages.length === 0) {
      // Initial AI message
      const initialMessage = type === 'sell' 
        ? "Hi! I'm here to help you sell your item. What would you like to sell today? You can describe it or even upload a photo!"
        : "Hi! I'm here to help you find what you're looking for. What are you trying to buy today?";
      
      setTimeout(() => {
        addChatMessage({
          id: Date.now().toString(),
          content: initialMessage,
          sender: 'ai',
          timestamp: new Date()
        });
      }, 500);
    }
  }, []);

  const simulateAIResponse = (userMessage: string, images?: string[]) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      let aiResponse = '';
      
      if (type === 'sell') {
        if (chatMessages.length === 1) {
          aiResponse = "Great! Can you tell me more about the condition of your item? Is it new, used, or refurbished?";
        } else if (chatMessages.length === 3) {
          aiResponse = "Perfect! What price are you thinking? I can help suggest a competitive price based on similar items.";
        } else if (chatMessages.length === 5) {
          aiResponse = "Excellent! I've gathered all the information needed. Your listing looks great and should attract buyers quickly!";
          
          // Show draft button after a delay
          setTimeout(() => {
            setShowDraftButton(true);
          }, 1000);
        } else {
          aiResponse = "I understand. Can you provide any additional details that might help buyers?";
        }
      } else {
        aiResponse = "I'm searching for items that match your description. Here are some great options I found nearby!";
      }
      
      addChatMessage({
        id: Date.now().toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      });
    }, 1500);
  };

  const handleSend = () => {
    if (inputValue.trim() || selectedImages.length > 0) {
      addChatMessage({
        id: Date.now().toString(),
        content: inputValue.trim() || 'Image uploaded',
        sender: 'user',
        timestamp: new Date(),
        images: selectedImages.length > 0 ? selectedImages : undefined
      });
      
      simulateAIResponse(inputValue, selectedImages);
      setInputValue('');
      setSelectedImages([]);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setSelectedImages(prev => [...prev, ...imageUrls]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const quickReplies = type === 'sell' ? [
    "It's in excellent condition",
    "It's gently used",
    "It has some wear",
    "It's brand new"
  ] : [
    "Show me electronics",
    "Looking for furniture",
    "Need clothing items",
    "Show me everything"
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.images && message.images.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {message.images.map((img, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden bg-white/10"
                        style={{ 
                          width: message.images!.length === 1 ? '200px' : '120px',
                          height: message.images!.length === 1 ? '150px' : '90px'
                        }}
                      >
                        <img
                          src={img}
                          alt={`Uploaded ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {/* Draft Listing Button */}
        {type === 'sell' && showDraftButton && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg max-w-xs lg:max-w-md">
              <p className="text-sm mb-3">Your listing is ready for review!</p>
              <Button 
                onClick={onViewDraftListing}
                className="bg-green-600 hover:bg-green-700 text-white text-sm"
                size="sm"
              >
                View Draft Listing
              </Button>
            </div>
          </div>
        )}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {chatMessages.length > 0 && chatMessages.length < 6 && !showDraftButton && (
        <div className="px-4 py-2 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputValue(reply);
                  setTimeout(() => handleSend(), 100);
                }}
                className="text-xs"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview */}
      {selectedImages.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            {selectedImages.map((img, index) => (
              <div key={index} className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-white shadow-sm border border-gray-200">
                  <img 
                    src={img} 
                    alt={`Preview ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Type your message...`}
            className="flex-1"
          />
          <Button onClick={handleSend} size="sm" className="px-4">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ChatInterface;
