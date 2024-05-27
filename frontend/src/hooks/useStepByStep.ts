import { useContext } from "react";
import StepbyStepContext from "../context/StepByStepContext";
import { StepByStepContextType } from "../interface/context/stepbystep.interface";

export const useStepByStep = (): StepByStepContextType => {
  const context = useContext(StepbyStepContext);
  if (!context) {
    throw new Error(
      "useStepByStep debe ser usado dentro de un StepByStepProvider"
    );
  }
  return context;
};
