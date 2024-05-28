import { useEffect, useState } from "react";
import { Formik, Field, FieldProps, Form } from "formik";

import { Button, Checkbox, Heading, Input, Select } from "@chakra-ui/react";
import Swal from "sweetalert2";

import { useStepByStep } from "../../hooks/useStepByStep";
import {
  transportationProblemApi,
  transshipmentProblemApi,
} from "../../api/problem_api";
import { DataTransbordo } from "../../interface/transbordo";
import { DataTransporte } from "../../interface/transporte";

export interface Step4 {
  assignment?: boolean;
  numberOfAssignments?: number;
}

export const StepFour = () => {
  const {
    dataTransfer,
    dataTransport,
    getTotalDemandQuantity,
    getTotalSupplyQuantity,
    setResponseTransbordo,
    setResponseTransporte,
    setStep,
    setNextStep,
    step1,
    step4,
  } = useStepByStep();

  const [supply, setSupply] = useState(getTotalSupplyQuantity());
  const [demand, setDemand] = useState(getTotalDemandQuantity());
  const [maxNumber, setMaxNumber] = useState<number>(1);
  const [initialValues, setInitialValues] = useState<Step4>(
    step4 || {
      assignment: false,
      numberOfAssignments: maxNumber,
    }
  );

  useEffect(() => {
    setSupply(getTotalSupplyQuantity());
    setDemand(getTotalDemandQuantity());
    setMaxNumber(supply > demand ? step1.supplyNodes : step1.demandNodes);
    setInitialValues(
      step4 || {
        assignment: false,
        numberOfAssignments: maxNumber,
      }
    );
  }, [supply, demand, step1, step4]);

  const handleSubmit = (values: Step4) => {
    Swal.fire(
      "Alerta",
      "Estás seguro que los pasos anteriores se ingresaron correctamente?",
      "question"
    ).then((result) => {
      if (result.isConfirmed) {
        if (dataTransfer.supply.length > 0) {
          if (!values.numberOfAssignments) return;
          const data: DataTransbordo = {
            problem: dataTransfer,
            assignments:
              values.assignment === true ? values.numberOfAssignments : 0,
          };

          transshipmentProblemApi(data)
            .then((response) => {
              Swal.fire("", "", "success").then(() => {
                setResponseTransbordo(response.data);
                setNextStep("step4", values);
              });
            })
            .catch((error) => {
              console.log(error.response.data.error);
              Swal.fire(
                "Error",
                error.response.data.message +
                  ": " +
                  error.response.data.error || error,
                "error"
              );
            });
        } else {
          if (!values.numberOfAssignments) return;
          const data: DataTransporte = {
            problem: dataTransport,
            assignments:
              values.assignment === true ? values.numberOfAssignments : 0,
          };

          transportationProblemApi(data)
            .then((response) => {
              Swal.fire("", "", "success").then(() => {
                setResponseTransporte(response.data);
                setNextStep("step4", values);
              });
            })
            .catch((error) => {
              console.log(error.response.data.error);
              Swal.fire(
                "Error",
                error.response.data.message +
                  ": " +
                  error.response.data.error || error,
                "error"
              );
            });
        }
      }
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        handleSubmit(values);
        actions.setSubmitting(false);
      }}
    >
      <Form className="flex flex-col items-center w-full gap-4">
        <Heading>¡Todo listo para resolver!</Heading>

        {supply !== demand && (
          <>
            <Field name="assignment">
              {({ field }: FieldProps) => (
                <Checkbox {...field}>Resolver con asignación</Checkbox>
              )}
            </Field>

            <Field name="numberOfAssignments">
              {({ field, form }: FieldProps) => (
                <>
                  {form.values.assignment && (
                    <>
                      <p>
                        Teniendo en cuenta que{" "}
                        {supply > demand ? (
                          <>
                            <span className="text-tertiary">
                              oferta total: {supply}
                            </span>
                            {" > "}
                            demanda total: {demand}
                          </>
                        ) : (
                          <>
                            <span className="text-tertiary">
                              demanda total: {demand}
                            </span>
                            {" > "}
                            oferta total: {supply}
                          </>
                        )}
                      </p>

                      <p>
                        Número máximo de asignaciones para{" "}
                        {supply > demand ? (
                          <span className="text-tertiary">oferta</span>
                        ) : (
                          <span className="text-tertiary">demanda</span>
                        )}
                        {" = "}
                        {maxNumber}
                      </p>

                      <div>
                        <Input
                          max={maxNumber}
                          min={1}
                          type="number"
                          {...field}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </Field>
          </>
        )}

        {/* Aquí es el select dinamico si oferta > demanda -> ahi sale para escoger [ oferta, transbordo ] */}
        <Select>
          <option></option>
        </Select>

        {/* Inputs dinamicos para el valor que seleccione en el caso anterior, tomar como ejemplo en el archivo NodeHistoryModal el componente
                  <Field name="toNode">
                    {({ field, form }: FieldProps) => (
                      <div>
                        <Select placeholder="Nodo" {...field}>
                          {getMissingValues(
                            typeModal,
                            TYPE,
                            form.values.fromNode
                          ).map((value, index) => (
                            <option key={index} value={value}>
                              {value}
                            </option>
                          ))}
                        </Select>
                      </div>
                    )}
                  </Field>
                  linea 110
        */}
        <div>
          <Input />
        </div>

        <div className="flex justify-between w-full">
          <Button colorScheme="whiteAlpha" onClick={() => setStep(2)}>
            Anterior
          </Button>

          <Button colorScheme="whiteAlpha" type="submit">
            Resolver
          </Button>
        </div>
      </Form>
    </Formik>
  );
};
