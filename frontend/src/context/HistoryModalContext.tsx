import React, { createContext, useContext, useState } from "react";
import { DST } from "../interface/context/stepbystep.interface";

interface HistoryModalContextType {
  typeModal: DST;
  setTypeModal: React.Dispatch<React.SetStateAction<DST>>;
}

const HistoryModalContext = createContext<HistoryModalContextType | undefined>(
  undefined
);

interface Props {
  children: React.ReactNode;
}

export const HistoryModalProvider = ({ children }: Props) => {
  const [typeModal, setTypeModal] = useState<DST>("Demand");

  return (
    <HistoryModalContext.Provider
      value={{
        typeModal,
        setTypeModal,
      }}
    >
      {children}
    </HistoryModalContext.Provider>
  );
};

export const useHistoryModal = () => {
  const context = useContext(HistoryModalContext);
  if (context === undefined) {
    throw new Error(
      "useHistoryModal must be used within a HistoryModalProvider"
    );
  }
  return context;
};
