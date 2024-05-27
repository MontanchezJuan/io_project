import { createContext } from "react";

import { StepByStepContextType } from "../interface/context/stepbystep.interface";

const StepbyStepContext = createContext<StepByStepContextType | undefined>(
  undefined
);

export default StepbyStepContext;
