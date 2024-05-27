import React, { ReactNode, useState } from "react";

import {
  createNodes,
  createTransition,
  deleteTransition,
  createAllTransition,
  setNodeName,
  setQuantity,
  getMissingValues,
  problemJSON,
  setResponseTransbordo,
  setResponseTransporte,
  setStep,
  setNextStep,
  getTotalDemandQuantity,
  getTotalSupplyQuantity,
  resetNodes,
} from "../actions/stepActions";
import { InitialState } from "../interface/context/stepbystep.interface";
import StepbyStepContext from "../context/StepByStepContext";

const InitialStep: InitialState = {
  activeStep: 1,
  currentStep: 0,
  dataTransfer: { supply: [], demand: [], transshipment: [] },
  dataTransport: { supply: [], demand: [] },
  responseTransbordo: {
    assignments: 0,
    objective: 0,
    problem: { supply: [], demand: [], transshipment: [] },
    model: { constraints: [], objective: "", parameters: [], variables: [] },
  },
  responseTransporte: {
    assignments: 0,
    objective: 0,
    problem: { supply: [], demand: [] },
    model: { constraints: [], objective: "", parameters: [], variables: [] },
  },
  step1: {
    method: "",
    supplyNodes: 0,
    demandNodes: 0,
    transshipmentNodes: 0,
  },
  step4: { assignment: false },
};

const getInitialState = (): InitialState => {
  if (!localStorage.getItem("step")) return InitialStep;

  const savedStep = JSON.parse(localStorage.getItem("step")!);
  return savedStep || InitialStep;
};

export const StepByStepProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stepGlobal, setStepGlobal] = useState<InitialState>(getInitialState);

  return (
    <StepbyStepContext.Provider
      value={{
        ...stepGlobal,
        createAllTransition: createAllTransition(setStepGlobal),
        createNodes: createNodes(setStepGlobal),
        createTransition: createTransition(setStepGlobal),
        deleteTransition: deleteTransition(setStepGlobal),
        getMissingValues: getMissingValues(stepGlobal),
        getTotalDemandQuantity: getTotalDemandQuantity(stepGlobal),
        getTotalSupplyQuantity: getTotalSupplyQuantity(stepGlobal),
        problemJSON: problemJSON(setStepGlobal),
        resetNodes: resetNodes(setStepGlobal),
        setNodeName: setNodeName(setStepGlobal),
        setQuantity: setQuantity(setStepGlobal),
        setResponseTransbordo: setResponseTransbordo(setStepGlobal),
        setResponseTransporte: setResponseTransporte(setStepGlobal),
        setStep: setStep(setStepGlobal),
        setNextStep: setNextStep(setStepGlobal),
      }}
    >
      {children}
    </StepbyStepContext.Provider>
  );
};
