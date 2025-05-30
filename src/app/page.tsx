'use client';

import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';
import { isInAppBrowser } from '@/utils/browser';
import Dashboard from './dashboard/page';
import WarningDialog from '@/components/homepage/WarningDialog';
import HeroSection from '@/components/homepage/HeroSection';
import SignInButton from '@/components/homepage/SignInButton';
import FeatureGrid from '@/components/homepage/FeatureGrid';
import LoadingSpinner from '@/shared/LoadingSpinner';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const { toast } = useToast();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    console.log("Warning state:", showWarning);
  }, [showWarning]);

  useEffect(() => {
    setShowWarning(isInAppBrowser());
  }, []);

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

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <WarningDialog open={showWarning} onClose={() => setShowWarning(false)} />

      {!user ? (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
          {/* Header */}
          <header className="border-b bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-orange-600">Jobu</h1>
            </div>
          </header>

          <div className="container mx-auto px-4 py-12">
            <HeroSection>
              <SignInButton isSigningIn={isSigningIn} onClick={handleLogin} />
            </HeroSection>

            <FeatureGrid />
          </div>
        </div>
      ) : (
        <Dashboard />
      )}
    </>
  );
}