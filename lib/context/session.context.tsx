'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSession } from '../api/session';
import { useToast } from '@/hooks/use-toast';

type SessionContextType = {
  sessionId: string | null;
  validateSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);

  const validateSession = async () => {
    try {
      const res = await fetchSession();
      if (res?.sessionId) {
        setSessionId(res.sessionId);
        console.log('Session validated.');
      } else {
        console.log('No sessionId found.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Session Initialization Failed',
      });
      console.log('Error initializing session:', error);
    }
  };

  useEffect(() => {
    validateSession();
  }, []);

  return (
    <SessionContext.Provider value={{ sessionId, validateSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};
