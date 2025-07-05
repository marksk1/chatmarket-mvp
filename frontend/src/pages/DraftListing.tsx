
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

const DraftListing = () => {
  const navigate = useNavigate();
  const { currentDraft, addListing, clearChat } = useApp();

  if (!currentDraft) {
    navigate('/sell/chat');
    return null;
  }

  const handleApprove = () => {
    const listing = { ...currentDraft, status: 'active' as const };
    addListing(listing);
    clearChat();
    toast({
      title: "Listing approved!",
      description: "Your item is now live on Chat Market.",
    });
    navigate('/listings');
  };

  const handleModify = () => {
    navigate('/sell/chat');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/sell/chat')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Review Your Listing</h1>
            <p className="text-sm text-gray-500">Check everything looks good before going live</p>
          </div>
        </div>
      </div>

      {/* Draft Preview */}
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentDraft.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Images */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Photos</h3>
              <div className="grid grid-cols-2 gap-4">
                {currentDraft.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${currentDraft.title} ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Price</h3>
              <p className="text-2xl font-bold text-green-600">${currentDraft.price}</p>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Condition</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {currentDraft.condition}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Description</h3>
              <p className="text-gray-700 leading-relaxed">{currentDraft.description}</p>
            </div>

            {/* Location & Delivery */}
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
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleApprove}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <Check className="w-5 h-5 mr-2" />
            Approve & List Item
          </Button>
          <Button 
            onClick={handleModify}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <Edit3 className="w-5 h-5 mr-2" />
            Modify via Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DraftListing;
