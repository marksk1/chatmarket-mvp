
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Listing {
  id: string;
  title: string;
  price: number;
  images: string[];
  condition: string;
  description: string;
  status: 'active' | 'sold' | 'draft';
  createdAt: Date;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  images?: string[];
}

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  listings: Listing[];
  addListing: (listing: Listing) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  currentDraft: Listing | null;
  setCurrentDraft: (draft: Listing | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [listings, setListings] = useState<Listing[]>([
    {
      id: '1',
      title: 'iPhone 13 Pro Max',
      price: 850,
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
      condition: 'Excellent',
      description: 'Barely used iPhone 13 Pro Max in excellent condition. Comes with original box and charger.',
      status: 'active',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'MacBook Air M2',
      price: 1200,
      images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'],
      condition: 'Good',
      description: 'MacBook Air M2 with 256GB storage. Perfect for students and professionals.',
      status: 'active',
      createdAt: new Date('2024-01-10')
    }
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentDraft, setCurrentDraft] = useState<Listing | null>(null);

  const addListing = (listing: Listing) => {
    setListings(prev => [...prev, listing]);
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings(prev => prev.map(listing => 
      listing.id === id ? { ...listing, ...updates } : listing
    ));
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(listing => listing.id !== id));
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    listings,
    addListing,
    updateListing,
    deleteListing,
    chatMessages,
    addChatMessage,
    clearChat,
    currentDraft,
    setCurrentDraft,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
