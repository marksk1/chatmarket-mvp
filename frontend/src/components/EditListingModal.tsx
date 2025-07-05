
import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface EditListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: string;
    title: string;
    price: number;
    condition: string;
    description: string;
    images: string[];
    createdAt: Date;
    status: 'active' | 'sold';
  } | null;
  onSave: (updatedData: any) => void;
}

const EditListingModal = ({ isOpen, onClose, listing, onSave }: EditListingModalProps) => {
  const [formData, setFormData] = useState({
    title: listing?.title || 'Vintage Americana Sneakers',
    price: listing?.price?.toString() || '25',
    condition: listing?.condition || 'Used - Good',
    description: listing?.description || 'Classic vintage sneakers in good condition with minimal wear.',
    collection: 'Yes',
    location: 'London, UK',
    delivery: 'Yes'
  });

  const handleSave = () => {
    onSave({
      ...formData,
      price: parseFloat(formData.price)
    });
    toast({
      title: "Changes saved!",
      description: "Your listing has been updated successfully.",
    });
    onClose();
  };

  if (!listing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Images Preview */}
          <div className="space-y-2">
            <Label>Photos</Label>
            <div className="grid grid-cols-2 gap-4">
              {listing.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${listing.title} ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Vintage Americana Sneakers"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              placeholder="25"
            />
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
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
              placeholder="Classic vintage sneakers in good condition..."
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
              placeholder="London, UK"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditListingModal;
