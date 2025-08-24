import React, { createContext, useState, useCallback, useContext } from 'react';
import type { ReactNode } from 'react';
import { PhoneShell } from '../components/PhoneShell';

interface PhoneShellContextType {
  openPhoneShell: (title: string, content: ReactNode) => void;
  closePhoneShell: () => void;
}

const PhoneShellContext = createContext<PhoneShellContextType | undefined>(undefined);

export const usePhoneShell = (): PhoneShellContextType => {
  const context = useContext(PhoneShellContext);
  if (!context) {
    throw new Error('usePhoneShell must be used within a PhoneShellProvider');
  }
  return context;
};

interface PhoneShellProviderProps {
  children: ReactNode;
}

export const PhoneShellProvider: React.FC<PhoneShellProviderProps> = ({ children }) => {
  const [shellConfig, setShellConfig] = useState<{
    visible: boolean;
    title: string;
    content: ReactNode;
  }>({
    visible: false,
    title: '',
    content: null,
  });

  const openPhoneShell = useCallback((title: string, content: ReactNode) => {
    setShellConfig({ visible: true, title, content });
  }, []);

  const closePhoneShell = useCallback(() => {
    setShellConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <PhoneShellContext.Provider value={{ openPhoneShell, closePhoneShell }}>
      {children}
      {shellConfig.visible && (
        <PhoneShell title={shellConfig.title} onClose={closePhoneShell}>
          {shellConfig.content}
        </PhoneShell>
      )}
    </PhoneShellContext.Provider>
  );
};
