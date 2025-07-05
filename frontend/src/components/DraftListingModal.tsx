
import React, { useState } from 'react';
import { X, Edit3, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface DraftListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onRemove: () => void;
  onModifyViaChat: () => void;
}

const DraftListingModal = ({ isOpen, onClose, onSave, onRemove, onModifyViaChat }: DraftListingModalProps) => {
  const [formData, setFormData] = useState({
    title: 'Vintage Americana Sneakers',
    price: '£25',
    condition: 'Used - Good',
    description: 'Classic vintage sneakers in good condition with minimal wear.',
    collection: 'Yes',
    location: 'London, UK',
    delivery: 'Yes'
  });

  const handleSave = () => {
    toast({
      title: "Listing saved!",
      description: "Your draft listing has been saved locally.",
    });
    onSave();
  };

  const handleRemove = () => {
    toast({
      title: "Listing removed",
      description: "Your draft listing has been deleted.",
    });
    onRemove();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Draft Listing</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Images Preview */}
          <div className="space-y-2">
            <Label>Photos</Label>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"
                alt="Sneakers 1"
                className="w-full h-32 object-cover rounded-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400"
                alt="Sneakers 2"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Used - Excellent">Used - Excellent</SelectItem>
                <SelectItem value="Used - Good">Used - Good</SelectItem>
                <SelectItem value="Used - Fair">Used - Fair</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          {/* Collection & Delivery */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Collection</Label>
              <Select value={formData.collection} onValueChange={(value) => setFormData({...formData, collection: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Delivery</Label>
              <Select value={formData.delivery} onValueChange={(value) => setFormData({...formData, delivery: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
            Save
          </Button>
          <Button onClick={handleRemove} variant="destructive" className="flex-1">
            <Trash2 className="w-4 h-4 mr-2" />
            Remove Listing
          </Button>
          <Button onClick={onModifyViaChat} variant="outline" className="flex-1">
            <MessageSquare className="w-4 h-4 mr-2" />
            Modify via Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DraftListingModal;
