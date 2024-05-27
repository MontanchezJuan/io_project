import { Button, Heading } from "@chakra-ui/react";
import { GraphvizComponent } from "../GraphvizComponent";
import { useStepByStep } from "../../hooks/useStepByStep";

export const StepThree = () => {
  const { dataTransfer, dataTransport, setNextStep, setStep } = useStepByStep();

  const handleNext = () => {
    setNextStep("step3");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Heading>Red inicial</Heading>

      <GraphvizComponent
        data={dataTransfer.supply.length > 0 ? dataTransfer : dataTransport}
      />

      <div className="flex justify-between w-full">
        <Button colorScheme="whiteAlpha" onClick={() => setStep(1)}>
          Anterior
        </Button>

        <Button colorScheme="whiteAlpha" onClick={handleNext}>
          Siguiente
        </Button>
      </div>
    </div>
  );
};
