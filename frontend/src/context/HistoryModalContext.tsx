import React, { createContext, useContext, useState } from "react";
import { SupplyNode, Node } from "../interface/common";
import { DST } from "../interface/context/stepbystep.interface";

interface HistoryModalContextType {
  historySupply: SupplyNode[];
  setHistorySupply: React.Dispatch<React.SetStateAction<SupplyNode[]>>;
  historyTransshipment: Node[];
  setHistoryTransshipment: React.Dispatch<React.SetStateAction<Node[]>>;
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
  const [historySupply, setHistorySupply] = useState<SupplyNode[]>([]);
  const [historyTransshipment, setHistoryTransshipment] = useState<Node[]>([]);
  const [typeModal, setTypeModal] = useState<DST>("Demand");

  return (
    <HistoryModalContext.Provider
      value={{
        historySupply,
        setHistorySupply,
        historyTransshipment,
        setHistoryTransshipment,
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
