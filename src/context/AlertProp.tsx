import React, { createContext, useContext, useState } from "react";

interface AlertContextType {
  alertMessage: string;
  setAlert: React.Dispatch<React.SetStateAction<string>>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface ValueProviderProps {
  children: React.ReactNode;
}

export const AlertProvider: React.FC<ValueProviderProps> = ({ children }) => {
  const [alertMessage, setAlert] = useState<string>("");

  return (
    <AlertContext.Provider value={{ alertMessage, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

// 2. Hook para consumir o contexto
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within a ValueProvider");
  }

  return context;
};
