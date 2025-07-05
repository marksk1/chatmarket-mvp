
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useApp } from '@/context/AppContext';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { MessageCircle, ShoppingBag, Zap, Shield } from 'lucide-react';

const Landing = () => {
  const { setIsLoggedIn, isLoggedIn } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section with Aurora Background */}
      <AuroraBackground className="relative">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-6 items-center justify-center px-4 text-center"
        >
          <h1 className="mx-auto max-w-4xl text-4xl md:text-7xl font-bold dark:text-white text-slate-900 tracking-tight">
            Buying and selling{' '}
            <span className="text-blue-600 dark:text-blue-400">
              is as easy as chat
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-700 dark:text-slate-300 font-light">
            Skip the hassle of traditional marketplaces. Just chat with our AI to list your items or find exactly what you're looking for. It's like having a personal shopping assistant that never sleeps.
          </p>

          {!isLoggedIn ? (
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/sell/chat">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full">
                  Start Selling
                </Button>
              </Link>
              <Link to="/buy/chat">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-full border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
                  Chat to Find Deals
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/sell/chat">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Start Selling
                </Button>
              </Link>
              <Link to="/buy/chat">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-full flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Start Buying
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-full border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
                  My Dashboard
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </AuroraBackground>

      {/* Features Section */}
      <div className="bg-slate-50 dark:bg-slate-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Faster & Easier</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Everything you need to buy and sell
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <span className="text-white font-bold">AI</span>
                  </div>
                  Smart Listings
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-300">
                  Our AI helps you create perfect listings by asking the right questions and suggesting optimal prices.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  Chat Interface
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-300">
                  No complex forms or confusing interfaces. Just chat naturally to buy or sell anything.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  Instant Results
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-300">
                  Get your listings live in minutes, not hours. Find what you need with lightning-fast search.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  Secure & Safe
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-300">
                  Built-in verification and secure payment processing keep your transactions safe.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Mobile CTA Bar - Only show when not logged in */}
      {!isLoggedIn && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 md:hidden z-30">
          <div className="flex space-x-3">
            <Button
              onClick={() => {
                navigate('/signup');
                setIsLoggedIn(true);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-full"
            >
              Sign Up
            </Button>
            <Button

              onClick={() => {
                navigate('/login');
                setIsLoggedIn(true);
              }}
              variant="outline"
              className="flex-1 rounded-full border-slate-300 dark:border-slate-600"
            >
              Log In
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
