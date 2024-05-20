import { Button, Heading } from "@chakra-ui/react";
import Swal from "sweetalert2";
import { GraphvizComponent } from "../GraphvizComponent";
import { useStepbyStep } from "../../context/StepByStepContext";

export const StepThree = () => {
  const { setStep3, setStep } = useStepbyStep();

  const handleNext = () => {
    Swal.fire("Alerta", "", "question").then((result) => {
      if (result.isConfirmed) {
        setStep3();
      }
    });
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <Heading>Gráfico</Heading>

      <GraphvizComponent />

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
