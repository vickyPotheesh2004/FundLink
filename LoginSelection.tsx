import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Rocket, TrendingUp, Building2, Lightbulb } from 'lucide-react';
import { FloatingLogos } from './FloatingLogo';
import type { UserRole } from '../App';

interface LoginSelectionProps {
  onLogin: (role: UserRole, userData: any) => void;
}

export function LoginSelection({ onLogin }: LoginSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    company: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in real app this would hit an API
    const userData = {
      id: Math.random().toString(36).substring(2, 9),
      name: formData.name || (selectedRole === 'startup' ? 'John Founder' : 'Jane Investor'),
      email: formData.email,
      company: formData.company || (selectedRole === 'startup' ? 'My Startup' : 'Investment Firm'),
      role: selectedRole
    };

    onLogin(selectedRole, userData);
  };

  if (selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center sky-gradient relative overflow-hidden">
        <FloatingLogos />
        
        {/* Background Stars/Dots */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-20"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's'
              }}
            />
          ))}
        </div>

        <Card className="w-full max-w-md glass-card glass-card-hover">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
              {selectedRole === 'startup' ? (
                <Rocket className="w-6 h-6 text-white" />
              ) : (
                <TrendingUp className="w-6 h-6 text-white" />
              )}
            </div>
            <CardTitle className="text-white">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <p className="text-blue-100">
              {selectedRole === 'startup' 
                ? 'Connect with investors for your startup' 
                : 'Discover promising startups to fund'
              }
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-blue-100">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-blue-100">
                      {selectedRole === 'startup' ? 'Startup Name' : 'Company/Fund Name'}
                    </Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-100">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-100">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white border-none">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-blue-200 hover:text-white transition-colors"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up"
                  }
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedRole(null)}
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Back to Role Selection
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center sky-gradient relative overflow-hidden">
      <FloatingLogos />
      
      {/* Background Stars/Dots */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-30 floating-animation"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 6 + 's'
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl floating-animation">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-6xl bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              FundLink
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            A secure community platform connecting startup founders with investors. 
            Choose your path to get started.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Startup Section */}
          <Card className="group glass-card glass-card-hover cursor-pointer border-2 border-white/10 hover:border-blue-400/50">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">For Startups</CardTitle>
              <p className="text-blue-100">
                Share your innovative ideas with verified investors
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-100">Create detailed project profiles</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-100">Connect with relevant investors</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-100">Filter by investment focus</span>
                </div>
              </div>
              <Button 
                onClick={() => setSelectedRole('startup')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none shadow-lg"
              >
                Continue as Startup
              </Button>
            </CardContent>
          </Card>

          {/* Investor Section */}
          <Card className="group glass-card glass-card-hover cursor-pointer border-2 border-white/10 hover:border-green-400/50">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">For Investors</CardTitle>
              <p className="text-blue-100">
                Discover promising startups seeking funding
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-green-400" />
                  <span className="text-blue-100">Browse innovative startup ideas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-green-400" />
                  <span className="text-blue-100">Filter by industry and stage</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-blue-100">Send investment inquiries</span>
                </div>
              </div>
              <Button 
                onClick={() => setSelectedRole('investor')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none shadow-lg"
              >
                Continue as Investor
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}