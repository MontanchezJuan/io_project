import {
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import { useStepbyStep } from "../../context/StepByStepContext";
import { HistoryModalProvider } from "../../context/HistoryModalContext";

import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";

export const StepbyStep = () => {
  const { currentStep, activeStep, setStep } = useStepbyStep();

  return (
    <div className="w-2/3 h-full rounded-2xl bg-primary text-white p-8">
      <Tabs
        position="relative"
        variant="unstyled"
        index={currentStep}
        onChange={(index) => setStep(index)}
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
            <p>three!</p>
          </TabPanel>
          <TabPanel>
            <p>four!</p>
          </TabPanel>
          <TabPanel>
            <p>five!</p>
          </TabPanel>
          <TabPanel>
            <p>six!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};
