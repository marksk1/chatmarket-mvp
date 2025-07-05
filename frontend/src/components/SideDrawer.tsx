
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Home, ShoppingBag, DollarSign, Info, Bell, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideDrawer = ({ isOpen, onClose }: SideDrawerProps) => {
  const { isLoggedIn, setIsLoggedIn } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    onClose();
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CM</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Chat Market</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Home className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Home</span>
                </Link>
                <Link
                  to="/buy/chat"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Buy</span>
                </Link>
                <Link
                  to="/sell/chat"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Sell</span>
                </Link>
                <Link
                  to="/info"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Info className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">How It Works</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Dashboard</span>
                </Link>
                <Link
                  to="/listings"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">My Listings</span>
                </Link>
                <Link
                  to="/sell/chat"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Start Selling</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Log Out</span>
                </button>
              </>
            )}
          </nav>

          {/* Footer */}
          {!isLoggedIn && (
            <div className="p-4 border-t border-gray-200 space-y-3">
              <Button

                onClick={() => {
                  navigate('/signup');
                  setIsLoggedIn(true);
                  onClose();
                }}
                className="w-full"
              >
                Sign Up
              </Button>
              <Button

                onClick={() => {
                  navigate('/login');
                  setIsLoggedIn(true);
                  onClose();
                }}
                variant="outline"
                className="w-full"
              >
                Log In
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
