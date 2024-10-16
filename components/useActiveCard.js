// useActiveCard.js
"use client"
import { useState, createContext, useContext } from 'react';

const ActiveCardContext = createContext();

export const ActiveCardProvider = ({ children }) => {
  const [activeCard, setActiveCard] = useState(undefined);
  return (
    <ActiveCardContext.Provider value={{ activeCard, setActiveCard }}>
      {children}
    </ActiveCardContext.Provider>
  );
};

export const useActiveCard = () => {
  return useContext(ActiveCardContext);
};
