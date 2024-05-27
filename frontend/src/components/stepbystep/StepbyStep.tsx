import {
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import { useStepByStep } from "../../hooks/useStepByStep";
import { HistoryModalProvider } from "../../context/HistoryModalContext";

import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";
import { StepFour } from "./StepFour";
import { StepFive } from "./StepFive";
import { StepSix } from "./StepSix";

export const StepbyStep = () => {
  const { currentStep, activeStep, setStep } = useStepByStep();

  return (
    <div
      className={`${
        currentStep === 2 ? "w-6/7" : currentStep === 4 ? "w-6/7" : "w-2/3"
      } h-full rounded-2xl bg-primary text-white p-8 mb-12`}
    >
      <Tabs
        position="relative"
        variant="unstyled"
        index={currentStep}
        onChange={(index) => setStep(index)}
        isLazy
      >
        <TabList>
          <Tab>Paso 1</Tab>
          <Tab isDisabled={activeStep < 2}>Paso 2</Tab>
          <Tab isDisabled={activeStep < 3}>Paso 3</Tab>
          <Tab isDisabled={activeStep < 4}>Paso 4</Tab>
          <Tab isDisabled={activeStep < 5}>Paso 5</Tab>
          <Tab isDisabled={activeStep < 6}>Paso 6</Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />
        <TabPanels>
          <TabPanel>
            <StepOne />
          </TabPanel>
          <TabPanel>
            <HistoryModalProvider>
              <StepTwo />
            </HistoryModalProvider>
          </TabPanel>
          <TabPanel>
            <StepThree />
          </TabPanel>
          <TabPanel>
            <StepFour />
          </TabPanel>
          <TabPanel>
            <StepFive />
          </TabPanel>
          <TabPanel>
            <StepSix />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};
