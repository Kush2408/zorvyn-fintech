import React, { createContext, useContext, useState, useCallback } from 'react';

interface ApiContextType {
  inFlight: number;
  isSyncing: boolean;
  trackCall: <T>(fn: () => Promise<T>) => Promise<T>;
}

const ApiContext = createContext<ApiContextType>({
  inFlight: 0,
  isSyncing: false,
  trackCall: async (fn) => fn(),
});

export const useApi = () => useContext(ApiContext);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inFlight, setInFlight] = useState(0);

  const trackCall = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setInFlight(c => c + 1);
    try {
      return await fn();
    } finally {
      setInFlight(c => c - 1);
    }
  }, []);

  return (
    <ApiContext.Provider value={{ inFlight, isSyncing: inFlight > 0, trackCall }}>
      {children}
    </ApiContext.Provider>
  );
};
