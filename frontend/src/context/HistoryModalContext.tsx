import React, { createContext, useContext, useState } from "react";
import { SupplyNode, DemandNode, Node } from "../interface/common";
import { DST } from "./StepByStepContext";

interface HistoryModalContextType {
  historyDemand: DemandNode[];
  setHistoryDemand: React.Dispatch<React.SetStateAction<DemandNode[]>>;
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
  const [historyDemand, setHistoryDemand] = useState<DemandNode[]>([]);
  const [historySupply, setHistorySupply] = useState<SupplyNode[]>([]);
  const [historyTransshipment, setHistoryTransshipment] = useState<Node[]>([]);
  const [typeModal, setTypeModal] = useState<DST>("Demand");

  return (
    <HistoryModalContext.Provider
      value={{
        historyDemand,
        setHistoryDemand,
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
