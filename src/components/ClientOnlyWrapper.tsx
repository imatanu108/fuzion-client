"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '@/store/store'; // Import both store and persistor

const ClientOnlyWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      {/* PersistGate delays rendering until rehydration is complete */}
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default ClientOnlyWrapper;
