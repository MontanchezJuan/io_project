import { useEffect, useState } from "react";

import { Button, Heading } from "@chakra-ui/react";

import { GraphvizComponent } from "../GraphvizComponent";
import { useStepByStep } from "../../hooks/useStepByStep";
import { DataResponseTransbordo } from "../../interface/transbordo";
import { DataResponseTransporte } from "../../interface/transporte";

export const StepFive = () => {
  const {
    dataTransfer,
    dataTransport,
    responseTransbordo,
    responseTransporte,
    setStep,
    step4,
  } = useStepByStep();

  const [data, setData] = useState<
    DataResponseTransbordo | DataResponseTransporte
  >({
    assignments: 0,
    objective: 0,
    problem: { supply: [], demand: [], transshipment: [] },
    model: { constraints: [], objective: "", parameters: [], variables: [] },
  });

  useEffect(() => {
    if (responseTransbordo.problem.demand.length > 0) {
      setData(responseTransbordo);
    } else if (responseTransporte) {
      setData(responseTransporte);
    }
  }, [dataTransfer, dataTransport, responseTransbordo, responseTransporte]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Heading>Red inicial</Heading>

      {step4.assignment && (
        <p>Asignaciones seleccionadas: {step4.numberOfAssignments}</p>
      )}

      <GraphvizComponent
        data={dataTransfer.supply.length > 0 ? dataTransfer : dataTransport}
      />

      <Heading className="text-tertiary">Solución</Heading>

      {data && (
        <Heading>
          Función objetivo:{" "}
          <span className="text-tertiary">{data.objective}</span>
        </Heading>
      )}

      {step4.assignment && data && (
        <p>
          {data.assignments !== step4.numberOfAssignments
            ? `Asignaciones minimas: ${data.assignments}`
            : `Asignaciones: ${data.assignments}`}
        </p>
      )}

      <GraphvizComponent data={data.problem} />

      <div className="flex justify-between w-full">
        <Button colorScheme="whiteAlpha" onClick={() => setStep(3)}>
          Anterior
        </Button>

        <Button colorScheme="whiteAlpha" onClick={() => setStep(5)}>
          Ver modelo matemático
        </Button>
      </div>
    </div>
  );
};
