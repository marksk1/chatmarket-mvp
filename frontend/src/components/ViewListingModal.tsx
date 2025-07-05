
import React from 'react';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface ViewListingModalProps {
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
}

const ViewListingModal = ({ isOpen, onClose, listing }: ViewListingModalProps) => {
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

  if (!listing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Listing</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Images Gallery */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Photos</h3>
            <div className="grid grid-cols-2 gap-4">
              {listing.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${listing.title} ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Title</h3>
            <p className="text-lg font-semibold">{listing.title}</p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Price</h3>
            <p className="text-2xl font-bold text-green-600">${listing.price}</p>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Condition</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {listing.condition}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Description</h3>
            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Status</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              listing.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {listing.status === 'active' ? 'Active' : 'Sold'}
            </span>
          </div>

          {/* Collection & Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Collection</h3>
              <p className="text-gray-600">Available for pickup</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Delivery</h3>
              <p className="text-gray-600">Local delivery available</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {listing.status === 'active' && (
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewListingModal;
