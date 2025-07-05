
import React, { useState } from 'react';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface ViewDraftListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewDraftListingModal = ({ isOpen, onClose }: ViewDraftListingModalProps) => {
  const [formData, setFormData] = useState({
    title: 'Vintage Americana Sneakers',
    price: '£25',
    condition: 'Used - Good',
    description: 'Classic vintage sneakers in good condition with minimal wear.',
    collection: 'Yes',
    location: 'London, UK',
    delivery: 'Yes'
  });

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: "Item has been added to your cart.",
    });
    onClose();
  };

  const handleContactSeller = () => {
    toast({
      title: "Contact Seller",
      description: "Opening chat with the seller.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Draft Listing</DialogTitle>
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
              placeholder="Vintage Americana Sneakers"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              placeholder="£25"
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
          <Button onClick={handleAddToCart} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button onClick={handleContactSeller} variant="outline" className="flex-1">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Seller
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDraftListingModal;
