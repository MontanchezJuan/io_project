import { Formik, Field, FieldProps, Form } from "formik";

import { Button, Checkbox, Heading, Input } from "@chakra-ui/react";

import { useStepbyStep } from "../../context/StepByStepContext";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export interface Step4 {
  assignment?: boolean;
  numberOfAssignments?: number;
}

export const StepFour = () => {
  const {
    getTotalDemandQuantity,
    getTotalSuplyQuantity,
    setStep,
    setStep4,
    step1,
  } = useStepbyStep();

  const [supply, setSupply] = useState(getTotalSuplyQuantity());
  const [demand, setDemand] = useState(getTotalDemandQuantity());
  const [maxNumber, setMaxNumber] = useState<number>(1);

  useEffect(() => {
    setSupply(getTotalSuplyQuantity());
    setDemand(getTotalDemandQuantity());
    setMaxNumber(supply > demand ? step1.supplyNodes : step1.demandNodes);
  }, []);

  const initialValues: Step4 = {
    assignment: false,
    numberOfAssignments: maxNumber,
  };

  const handleSubmit = (values: Step4) => {
    Swal.fire("The Internet?", "That thing is still around?", "question").then(
      (result) => {
        if (result.isConfirmed) {
          setStep4(values);
        }
      }
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        console.log(values);
        handleSubmit(values);
        actions.setSubmitting(false);
      }}
    >
      <Form className="flex flex-col items-center w-full gap-4">
        <Heading>Todo listo para resolver</Heading>

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
                  <p>{`Ya que, oferta total = ${supply} ${
                    supply > demand ? ">" : "<"
                  } demanda total = ${demand}`}</p>
                  <p>{`Número máximo de asignaciones para ${
                    supply > demand ? "oferta" : "demanda"
                  } = ${maxNumber}`}</p>

                  <div>
                    <Input max={maxNumber} min={1} type="number" {...field} />
                  </div>
                </>
              )}
            </>
          )}
        </Field>

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
