import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { useApp } from '@/context/AppContext';

const ChatListing = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { listings } = useApp();

  // Find the listing by ID (including mock sold listings)
  const mockSoldListings = [
    {
      id: 'sold-1',
      title: 'Vintage Leather Jacket',
      price: 120,
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
      condition: 'Good',
      description: 'Classic vintage leather jacket in great condition.',
      status: 'sold' as const,
      createdAt: new Date('2024-01-05')
    },
    {
      id: 'sold-2',
      title: 'Gaming Headset',
      price: 75,
      images: ['https://images.unsplash.com/photo-1599669454699-248893623440?w=400'],
      condition: 'Excellent',
      description: 'High-quality gaming headset with noise cancellation.',
      status: 'sold' as const,
      createdAt: new Date('2023-12-28')
    }
  ];

  const allListings = [...listings, ...mockSoldListings];
  const listing = allListings.find(l => l.id === listingId);

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h1>
          <Button onClick={() => navigate('/listings')}>
            Back to My Listings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate('/listings')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Chat about listing</h1>
              <p className="text-sm text-gray-600">{listing.title}</p>
            </div>
          </div>
        </div>

        {/* Listing Preview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full md:w-48 h-48 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{listing.title}</h2>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    listing.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.status === 'active' ? 'Active' : 'Sold'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-600 mb-2">${listing.price}</p>
                <p className="text-gray-600 mb-2">{listing.condition}</p>
                <p className="text-gray-700">{listing.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface Placeholder */}
        <Card>
          <CardContent className="p-8 text-center">
            <Bot className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chat about this listing
            </h3>
            <p className="text-gray-600 mb-6">
              Start a conversation about your listing. Get insights, manage inquiries, or update details.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
              <p className="text-sm text-gray-700 mb-2">
                <strong>AI Assistant:</strong> Hi! I can help you with this listing. What would you like to do?
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button size="sm" variant="outline">Update price</Button>
                <Button size="sm" variant="outline">Edit description</Button>
                <Button size="sm" variant="outline">Mark as sold</Button>
                <Button size="sm" variant="outline">Get insights</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatListing;