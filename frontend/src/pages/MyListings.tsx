import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import ListingCard from '@/components/ListingCard';
import ListingOptionsDrawer from '@/components/ListingOptionsDrawer';
import EditListingModal from '@/components/EditListingModal';
import { useApp } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

const MyListings = () => {
  const navigate = useNavigate();
  const { listings, deleteListing, setIsLoggedIn } = useApp();
  const [optionsDrawerOpen, setOptionsDrawerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  React.useEffect(() => {
    setIsLoggedIn(true);
  }, [setIsLoggedIn]);

  // Mock sold listings for demonstration
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

  const activeListings = listings.filter(l => l.status === 'active');
  const soldListings = mockSoldListings;

  const handleCardClick = (listing: any) => {
    // Navigate to chat for this listing
    navigate(`/chat/${listing.id}`);
  };

  const handleOptionsClick = (listing: any) => {
    setSelectedListing(listing);
    setOptionsDrawerOpen(true);
  };

  const handleChatAboutListing = () => {
    if (selectedListing) {
      navigate(`/chat/${selectedListing.id}`);
    }
  };

  const handleShareListing = () => {
    if (selectedListing) {
      // Copy listing URL to clipboard
      const url = `${window.location.origin}/listing/${selectedListing.id}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Listing link has been copied to your clipboard.",
      });
    }
  };

  const handleEditListing = () => {
    setEditModalOpen(true);
  };

  const handleDeleteListing = () => {
    if (selectedListing) {
      deleteListing(selectedListing.id);
      toast({
        title: "Listing deleted",
        description: "Your listing has been removed.",
      });
    }
  };

  const handleSaveEdit = (updatedData: any) => {
    toast({
      title: "Listing updated",
      description: "Your changes have been saved.",
    });
  };

  const totalListings = activeListings.length + soldListings.length;
  const totalEarnings = soldListings.reduce((sum, l) => sum + l.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-1">Manage your active and sold items</p>
          </div>
          <Link to="/sell/chat">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Listing
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{activeListings.length}</div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{soldListings.length}</div>
              <div className="text-sm text-gray-600">Sold Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                ${totalEarnings}
              </div>
              <div className="text-sm text-gray-600">Total Earnings</div>
            </CardContent>
          </Card>
        </div>

        {/* Listings Tabs */}
        {totalListings === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">Create your first listing to start selling</p>
            <Link to="/sell/chat">
              <Button>Start Selling</Button>
            </Link>
          </div>
        ) : (
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="active" className="text-base">
                Active Listings ({activeListings.length})
              </TabsTrigger>
              <TabsTrigger value="sold" className="text-base">
                Sold Items ({soldListings.length})
              </TabsTrigger>
            </TabsList>

            {/* Active Listings */}
            <TabsContent value="active" className="space-y-6">
              {activeListings.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active listings</h3>
                  <p className="text-gray-600 mb-6">Create a new listing to start selling</p>
                  <Link to="/sell/chat">
                    <Button>Create Listing</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onCardClick={handleCardClick}
                      onOptionsClick={handleOptionsClick}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Sold Listings */}
            <TabsContent value="sold" className="space-y-6">
              {soldListings.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sold items yet</h3>
                  <p className="text-gray-600">Your sold items will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {soldListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onCardClick={handleCardClick}
                      onOptionsClick={handleOptionsClick}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Options Drawer */}
      <ListingOptionsDrawer
        isOpen={optionsDrawerOpen}
        onClose={() => setOptionsDrawerOpen(false)}
        onChatAboutListing={handleChatAboutListing}
        onShareListing={handleShareListing}
        onEditListing={handleEditListing}
        onDeleteListing={handleDeleteListing}
        listingTitle={selectedListing?.title || ''}
      />

      {/* Edit Modal */}
      <EditListingModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        listing={selectedListing}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default MyListings;