
import React, { useState } from 'react';
import { X, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BuyChatOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatTitle: string;
}

const BuyChatOptionsModal = ({ isOpen, onClose, chatTitle }: BuyChatOptionsModalProps) => {
  const [title, setTitle] = useState(chatTitle);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <span>Buy Chat Options</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Vintage Americana Shoes"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="monitor">Market Monitor</Label>
            <Select defaultValue="active">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notifications">Notifications</Label>
            <Select defaultValue="max-1x">
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="max-1x">Max 1x Daily</SelectItem>
                <SelectItem value="max-3x">Max 3x Daily</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex items-center space-x-2">
              <Input placeholder="0 €" className="flex-1" />
              <span className="text-gray-500">to</span>
              <Input placeholder="70 €" className="flex-1" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyChatOptionsModal;
