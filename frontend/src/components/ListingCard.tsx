import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

interface ListingCardProps {
  listing: Listing;
  onCardClick: (listing: Listing) => void;
  onOptionsClick: (listing: Listing) => void;
}

const ListingCard = ({ listing, onCardClick, onOptionsClick }: ListingCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOptionsClick(listing);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => onCardClick(listing)}
    >
      <div className="aspect-w-16 aspect-h-9 relative">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            listing.status === 'active' 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {listing.status === 'active' ? 'Active' : 'Sold'}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
            onClick={handleOptionsClick}
          >
            <MoreVertical className="w-4 h-4 text-gray-700" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{listing.title}</h3>
        <p className="text-lg font-bold text-green-600 mb-2">${listing.price}</p>
        <p className="text-sm text-gray-600 mb-1">{listing.condition}</p>
        <p className="text-sm text-gray-500">Listed {formatDate(listing.createdAt)}</p>
      </CardContent>
    </Card>
  );
};

export default ListingCard;