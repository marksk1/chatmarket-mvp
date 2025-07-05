
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Trash2, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import ViewListingModal from '@/components/ViewListingModal';
import EditListingModal from '@/components/EditListingModal';
import { useApp } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

const MyListings = () => {
  const { listings, deleteListing, setIsLoggedIn } = useApp();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  React.useEffect(() => {
    setIsLoggedIn(true);
  }, [setIsLoggedIn]);

  const handleDelete = (id: string) => {
    deleteListing(id);
    toast({
      title: "Listing deleted",
      description: "Your listing has been removed.",
    });
  };

  const handleView = (listing: any) => {
    setSelectedListing(listing);
    setViewModalOpen(true);
  };

  const handleEdit = (listing: any) => {
    setSelectedListing(listing);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updatedData: any) => {
    // In a real app, this would update the listing in the database
    toast({
      title: "Listing updated",
      description: "Your changes have been saved.",
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

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
              <div className="text-2xl font-bold text-gray-900">{listings.filter(l => l.status === 'active').length}</div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-900">{listings.filter(l => l.status === 'sold').length}</div>
              <div className="text-sm text-gray-600">Sold Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">
                ${listings.filter(l => l.status === 'sold').reduce((sum, l) => sum + l.price, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Earnings</div>
            </CardContent>
          </Card>
        </div>

        {/* Listings Grid */}
        {listings.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      listing.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {listing.status === 'active' ? 'Active' : 'Sold'}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                  <p className="text-lg font-bold text-green-600 mb-2">${listing.price}</p>
                  <p className="text-sm text-gray-600 mb-3">Listed {formatDate(listing.createdAt)}</p>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleView(listing)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEdit(listing)}
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(listing.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewListingModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        listing={selectedListing}
      />
      
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
