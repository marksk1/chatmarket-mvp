
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const Pricing = () => {
  const { setIsLoggedIn } = useApp();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for casual sellers',
      features: [
        'Up to 5 active listings',
        'Basic AI assistance',
        'Standard support',
        'Mobile app access'
      ]
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'For serious sellers',
      features: [
        'Unlimited listings',
        'Advanced AI features',
        'Priority support',
        'Analytics dashboard',
        'Featured listings',
        'Bulk operations'
      ],
      popular: true
    },
    {
      name: 'Business',
      price: '$29.99',
      period: '/month',
      description: 'For power users',
      features: [
        'Everything in Pro',
        'White-label solution',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced analytics',
        'API access'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your selling needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => setIsLoggedIn(true)}
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.name === 'Free' ? 'Get Started' : 'Start Free Trial'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">What happens when I exceed my listing limit?</h3>
              <p className="text-gray-600">You'll be prompted to upgrade to continue listing items. Existing listings remain active.</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.</p>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h3>
              <p className="text-gray-600">No setup fees. All plans include everything you need to start selling immediately.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
