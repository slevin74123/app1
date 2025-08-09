'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithFacebook: () => Promise<{ error: AuthError | null }>;
  signInWithInstagram: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Pentru dezvoltare - permite accesul fără autentificare când Supabase nu este disponibil
  const [supabaseAvailable, setSupabaseAvailable] = useState(true);

  useEffect(() => {
    // Get initial session with error handling
    const getInitialSession = async () => {
      try {
        console.log('🔍 Attempting to connect to Supabase...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Supabase auth error:', error);
          setSupabaseAvailable(false);
        } else {
          console.log('✅ Supabase connection successful');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('❌ Failed to connect to Supabase:', error);
        setSupabaseAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes with error handling
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 Auth state changed:', event);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );
      subscription = authSubscription;
    } catch (error) {
      console.error('❌ Failed to set up auth listener:', error);
      setSupabaseAvailable(false);
      setLoading(false);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Pentru dezvoltare - creează un user mock când Supabase nu este disponibil
  useEffect(() => {
    if (!supabaseAvailable && !user) {
      console.log('🛠️ Creating mock user for development...');
      const mockUser = {
        id: 'dev-user-id',
        email: 'dev@example.com',
        user_metadata: { name: 'Developer User' },
        app_metadata: { provider: 'email' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role: 'authenticated',
        email_confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        phone: null,
        confirmed_at: new Date().toISOString(),
        confirmation_sent_at: new Date().toISOString(),
        recovery_sent_at: undefined,
        email_change_confirm_new_email: null,
        email_change_sent_at: null,
        phone_change: null,
        phone_change_sent_at: null,
        reauthentication_sent_at: null,
        banned_until: null,
        is_anonymous: false,
        is_sso_user: false,
        identities: [],
        factors: []
      } as unknown as User;
      
      setUser(mockUser);
      setSession({
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockUser
      } as Session);
    }
  }, [supabaseAvailable, user]);

  const signInWithGoogle = async () => {
    if (!supabaseAvailable) {
      console.log('🛠️ Mock Google sign-in for development');
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      return { error };
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      return { error: error as AuthError };
    }
  };

  const signInWithFacebook = async () => {
    if (!supabaseAvailable) {
      console.log('🛠️ Mock Facebook sign-in for development');
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      return { error };
    } catch (error) {
      console.error('❌ Facebook sign-in error:', error);
      return { error: error as AuthError };
    }
  };

  const signInWithInstagram = async () => {
    if (!supabaseAvailable) {
      console.log('🛠️ Mock Instagram sign-in for development');
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          scopes: 'instagram_basic,instagram_content_publish'
        }
      });
      return { error };
    } catch (error) {
      console.error('❌ Instagram sign-in error:', error);
      return { error: error as AuthError };
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!supabaseAvailable) {
      console.log('🛠️ Mock email sign-up for development');
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      return { error };
    } catch (error) {
      console.error('❌ Email sign-up error:', error);
      return { error: error as AuthError };
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabaseAvailable) {
      console.log('🛠️ Mock email sign-in for development');
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { error };
    } catch (error) {
      console.error('❌ Email sign-in error:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    if (!supabaseAvailable) {
      console.log('🛠️ Mock sign-out for development');
      setUser(null);
      setSession(null);
      return;
    }
    
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('❌ Sign-out error:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithInstagram,
    signOut,
    signUpWithEmail,
    signInWithEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 