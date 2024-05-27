import { Button, Heading, Tag } from "@chakra-ui/react";

import { useStepByStep } from "../../hooks/useStepByStep";

export const StepSix = () => {
  const { responseTransbordo, responseTransporte, setStep, step4 } =
    useStepByStep();

  const data =
    responseTransbordo.problem.demand.length > 0
      ? responseTransbordo
      : responseTransporte;

  return (
    <div className="flex flex-col items-center gap-4 text-tertiary">
      <Heading>Modelo Matemático</Heading>

      {data ? (
        <>
          <p>Función objetivo:</p>
          <p className="text-white">{data.model.objective}</p>

          <p>
            Resultado función objetivo:{" "}
            <span className="text-white">{data.objective}</span>
          </p>

          {step4.assignment &&
          data.assignments !== step4.numberOfAssignments ? (
            <p>
              Asignaciones minimas:{" "}
              <span className="text-white">{data.assignments}</span>
            </p>
          ) : (
            <p>
              Asignaciones:{" "}
              <span className="text-white">{data.assignments}</span>
            </p>
          )}

          <div className="flex flex-col items-center">
            <p>Restricciones:</p>
            {data.model.constraints.map((constraint) => (
              <p className="text-white">{constraint}</p>
            ))}
          </div>

          <div className="flex justify-around w-full">
            <div className="flex flex-col items-center">
              <p>Coeficientes de variables:</p>
              {data.model.parameters.map((parameter) => (
                <p className="text-white">{parameter}</p>
              ))}
            </div>

            <div className="flex flex-col items-center">
              <p>Variables de solución:</p>
              {data.model.variables.map((variable) => (
                <p className="text-white">{variable}</p>
              ))}
            </div>
          </div>
        </>
      ) : (
        <Tag>Ups! Ocurrió un error</Tag>
      )}

      <div className="flex justify-between w-full">
        <Button colorScheme="whiteAlpha" onClick={() => setStep(4)}>
          Anterior
        </Button>
      </div>
    </div>
  );
};
