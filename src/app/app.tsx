"use client";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import VirtualMakeupModal from "@/components/VirtualMakeupModal";
import { store } from "@/redux/store";
import React, { createContext, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import GlobalMakeupTransfer from "@/components/GlobalMakeupTransfer";

interface AppState {
  showCart: boolean;
  showVirtualMakeup: boolean;
  showGlobalTransfer: boolean;
}

interface AppContextType {
  showCart: boolean;
  showVirtualMakeup: boolean;
  setShowCart: (show: boolean) => void;
  setShowVirtualMakeup: (show: boolean) => void;
  showGlobalTransfer: boolean;
  setShowGlobalTransfer: (show: boolean) => void;
}

export const AppContext = createContext<AppContextType>({
  showCart: false,
  showVirtualMakeup: false,
  setShowCart: () => {},
  setShowVirtualMakeup: () => {},
  showGlobalTransfer: false,
  setShowGlobalTransfer: () => {},
});

const App = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>({
    showCart: false,
    showVirtualMakeup: false,
    showGlobalTransfer: false
  });

  const setShowCart = (show: boolean) => {
    setState(prev => ({ ...prev, showCart: show }));
  };

  const setShowVirtualMakeup = (show: boolean) => {
    setState(prev => ({ ...prev, showVirtualMakeup: show }));
  };

  const setShowGlobalTransfer = (show: boolean) => {
    setState(prev => ({ ...prev, showGlobalTransfer: show }));
  };

  const contextValue: AppContextType = {
    ...state,
    setShowCart,
    setShowVirtualMakeup,
    setShowGlobalTransfer
  };

  return (
    <Provider store={store}>
      <AppContext.Provider value={contextValue}>
        <NavBar setShowCart={setShowCart} />
        {state.showCart && <Cart setShowCart={setShowCart} />}
        {children}
        <VirtualMakeupModal 
          isOpen={state.showVirtualMakeup} 
          onClose={() => setShowVirtualMakeup(false)} 
        />
        <GlobalMakeupTransfer
          isOpen={state.showGlobalTransfer}
          onClose={() => setShowGlobalTransfer(false)}
        />
        <Toaster position="bottom-center" />
        <Footer />
      </AppContext.Provider>
    </Provider>
  );
};

export default App;
