import { Button } from "@chakra-ui/react";
import { useStepbyStep } from "../../context/StepByStepContext";

export const StepFive = () => {
  const { dataTransfer, dataTransport, step4, setStep } = useStepbyStep();
  return (
    <>
      <div>{JSON.stringify(dataTransfer, null, 2)}</div>
      <div>{JSON.stringify(dataTransport, null, 2)}</div>
      <div>{JSON.stringify(step4, null, 2)}</div>

      <div className="flex justify-between w-full">
        <Button colorScheme="whiteAlpha" onClick={() => setStep(3)}>
          Anterior
        </Button>

        <Button colorScheme="whiteAlpha">Siguiente</Button>
      </div>
    </>
  );
};
