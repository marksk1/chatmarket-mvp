
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Zap, Shield, DollarSign } from 'lucide-react';

const Info = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How Chat Market Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how our AI-powered marketplace makes buying and selling as easy as having a conversation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Start a Conversation</h3>
              <p className="text-gray-600">
                Simply chat with our AI about what you want to sell or buy. No complex forms or confusing interfaces.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. AI Does the Work</h3>
              <p className="text-gray-600">
                Our AI asks the right questions, suggests optimal pricing, and creates professional listings automatically.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Safe & Secure</h3>
              <p className="text-gray-600">
                Built-in verification, secure messaging, and protected payments ensure every transaction is safe.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Get Paid Fast</h3>
              <p className="text-gray-600">
                Quick payments, instant notifications, and seamless transactions make selling effortless.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Chat Market?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10x</div>
              <div className="text-gray-600">Faster listing creation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">User satisfaction rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">AI assistant availability</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
