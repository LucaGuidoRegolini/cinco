import React, { createContext, useContext, useState } from "react";

interface GameTipsContextType {
  gameTips: Tips[][];
  setGameTips: React.Dispatch<React.SetStateAction<Tips[][]>>;
}

const GameTipsContext = createContext<GameTipsContextType | undefined>(undefined);

interface ValueProviderProps {
  children: React.ReactNode;
}

export type Tips = "wrong" | "almost" | "right" | "";

export const GameTipsProvider: React.FC<ValueProviderProps> = ({ children }) => {
  const [gameTips, setGameTips] = useState<Tips[][]>([]);

  return (
    <GameTipsContext.Provider value={{ gameTips, setGameTips }}>
      {children}
    </GameTipsContext.Provider>
  );
};

// 2. Hook para consumir o contexto
export const useGameTips = () => {
  const context = useContext(GameTipsContext);

  // Verifique se o contexto foi encontrado
  if (!context) {
    throw new Error("useGameTips must be used within a ValueProvider");
  }

  return context;
};
