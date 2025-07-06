import React from 'react';
import { MessageCircle, Share2, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';

interface ListingOptionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onChatAboutListing: () => void;
  onShareListing: () => void;
  onEditListing: () => void;
  onDeleteListing: () => void;
  listingTitle: string;
}

const ListingOptionsDrawer = ({
  isOpen,
  onClose,
  onChatAboutListing,
  onShareListing,
  onEditListing,
  onDeleteListing,
  listingTitle,
}: ListingOptionsDrawerProps) => {
  const options = [
    {
      icon: MessageCircle,
      label: 'Chat about listing',
      action: onChatAboutListing,
      className: 'text-blue-600 hover:bg-blue-50',
    },
    {
      icon: Share2,
      label: 'Share listing',
      action: onShareListing,
      className: 'text-green-600 hover:bg-green-50',
    },
    {
      icon: Edit3,
      label: 'Edit listing',
      action: onEditListing,
      className: 'text-orange-600 hover:bg-orange-50',
    },
    {
      icon: Trash2,
      label: 'Delete listing',
      action: onDeleteListing,
      className: 'text-red-600 hover:bg-red-50',
    },
  ];

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader className="text-center pb-4">
          <DrawerTitle className="text-lg font-semibold text-gray-900">
            {listingTitle}
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 pb-6 space-y-2">
          {options.map((option, index) => {
            const Icon = option.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className={`w-full justify-start h-14 text-left ${option.className} transition-colors`}
                onClick={() => {
                  option.action();
                  onClose();
                }}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="text-base font-medium">{option.label}</span>
              </Button>
            );
          })}
        </div>
        
        <div className="px-4 pb-4">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ListingOptionsDrawer;