
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import SideDrawer from './SideDrawer';

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();


  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CM</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">Chat Market</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isLoggedIn ? (
              <>
                <Link to="/buy/chat" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Buy
                </Link>
                <Link to="/sell/chat" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Sell
                </Link>
                <Link to="/info" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  How It Works
                </Link>
                <Button
                  onClick={() => {
                    navigate('/login');
                    setIsLoggedIn(true)
                  }}
                  variant="outline"
                  size="sm"
                  className="mr-2 rounded-full border-slate-300 dark:border-slate-600"
                >
                  Log In
                </Button>
                <Button
                  onClick={() => {
                    navigate('/signup');
                    setIsLoggedIn(true)
                  }} size="sm"
                  className="bg-blue-600 hover:bg-blue-700 rounded-full"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/listings" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  My Listings
                </Link>
                <Link to="/buy/chat" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Buy
                </Link>
                <Link to="/sell/chat" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Sell
                </Link>
                <div className="flex items-center space-x-3">
                  <button className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </button>
                  <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-slate-600 dark:text-slate-300"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
