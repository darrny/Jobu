'use client';

import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Dashboard from './dashboard/page';
import { FaGoogle } from 'react-icons/fa';
import { Briefcase, Calendar, CheckCircle2, BarChart3 } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { toast } = useToast();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        toast({
          title: "Successfully signed in",
          description: "Welcome to Jobu!"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Sign in failed",
        description: "There was a problem signing in with Google",
        variant: "destructive"
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-orange-600">Jobu</h1>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="max-w-3xl mx-auto text-center space-y-8 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Track Your Job Applications
              <span className="text-orange-600"> Effortlessly</span>
            </h2>
            <p className="text-xl text-gray-600">
              Keep all your job applications organized in one place and never miss an important deadline.
            </p>
            <Button
              size="lg"
              onClick={handleLogin}
              disabled={isSigningIn}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSigningIn ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FaGoogle className="h-4 w-4" />
                  <span>Sign in with Google</span>
                </div>
              )}
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Application Tracking</h3>
              <p className="text-gray-600">Keep track of all your job applications in one organized dashboard.</p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Event Management</h3>
              <p className="text-gray-600">Never miss an interview or assessment with our event tracking system.</p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Status Updates</h3>
              <p className="text-gray-600">Update and track the status of each application as you progress.</p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Analytics</h3>
              <p className="text-gray-600">Get insights into your application success rate and activity.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}