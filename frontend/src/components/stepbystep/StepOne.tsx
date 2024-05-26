import { Formik, Field, FieldProps, Form } from "formik";

import { FormLabel, Select, Tag, Input, Button } from "@chakra-ui/react";

import { ToT, useStepbyStep } from "../../context/StepByStepContext";
import Swal from "sweetalert2";

export interface Step1 {
  method: ToT | "";
  supplyNodes: number;
  demandNodes: number;
  transshipmentNodes?: number;
}

export const StepOne = () => {
  const { createNodes, step1, setStep1, resetNodes, createAllTransition } =
    useStepbyStep();

  const initialValues: Step1 = {
    method: "",
    supplyNodes: 1,
    demandNodes: 1,
    transshipmentNodes: 1,
  };

  const handleSubmit = (values: Step1) => {
    if (values.method === "Transbordo") {
      Swal.fire(
        "Estás seguro?",
        `Se generarán ${values.supplyNodes} nodos de ofertas, ${values.transshipmentNodes} nodos de transbordo y ${values.demandNodes} nodos de demanda`,
        "question"
      ).then((result) => {
        if (result.isConfirmed) {
          createNodes(values.supplyNodes, "O", "Transbordo");
          createNodes(values.demandNodes, "D", "Transbordo");
          createNodes(values.transshipmentNodes!, "T", "Transbordo");
          resetNodes("Transporte");
          createAllTransition("Transbordo");
          setStep1(values);
        }
      });
    } else {
      Swal.fire(
        "Estás seguro?",
        `Se generarán ${values.supplyNodes} nodos de ofertas y ${values.demandNodes} nodos de demanda`,
        "question"
      ).then((result) => {
        if (result.isConfirmed) {
          createNodes(values.supplyNodes, "O", "Transporte");
          createNodes(values.demandNodes, "D", "Transporte");
          resetNodes("Transbordo");
          createAllTransition("Transporte");
          setStep1(values);
        }
      });
    }
  };

  return (
    <Formik
      initialValues={step1.method ? step1 : initialValues}
      onSubmit={(values, actions) => {
        console.log({ values, actions });
        handleSubmit(values);
        actions.setSubmitting(false);
      }}
    >
      <Form className="flex flex-col gap-2 w-full items-center">
        <div className="flex flex-col gap-2 w-1/2">
          <Field name="method">
            {({ field, form }: FieldProps) => (
              <>
                <FormLabel>Método: {form.values.method}</FormLabel>
                <Select placeholder="Seleccione un método" {...field}>
                  <option className="text-black" value="Transporte">
                    Transporte
                  </option>
                  <option className="text-black" value="Transbordo">
                    Transbordo
                  </option>
                </Select>
              </>
            )}
          </Field>
        </div>

        <Field>
          {({ form }: FieldProps) => (
            <>
              {!form.values.method && (
                <Tag colorScheme="red">Seleccione un método</Tag>
              )}
            </>
          )}
        </Field>

        <div className="flex justify-center w-full">
          <Field>
            {({ form }: FieldProps) => (
              <>
                {form.values.method === "Transporte" && (
                  <div className="w-full h-full rounded-2xl text-white p-8">
                    <div className="flex flex-col justify-center items-center gap-4">
                      <Field name="supplyNodes">
                        {({ field }: FieldProps) => (
                          <>
                            <FormLabel>Número de nodos de oferta</FormLabel>
                            <Input min={1} type="number" {...field} />
                          </>
                        )}
                      </Field>

                      <Field name="demandNodes">
                        {({ field }: FieldProps) => (
                          <>
                            <FormLabel>Número de nodos de demanda</FormLabel>
                            <Input min={1} type="number" {...field} />
                          </>
                        )}
                      </Field>

                      <Button type="submit" colorScheme="whiteAlpha">
                        Continuar
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Field>

          <Field>
            {({ form }: FieldProps) => (
              <>
                {form.values.method === "Transbordo" && (
                  <div className="w-full h-full rounded-2xl text-white p-8">
                    <div className="flex flex-col justify-center items-center gap-4">
                      <Field name="supplyNodes">
                        {({ field }: FieldProps) => (
                          <>
                            <FormLabel>Número de nodos de oferta</FormLabel>
                            <Input min={1} type="number" {...field} />
                          </>
                        )}
                      </Field>

                      <Field name="transshipmentNodes">
                        {({ field }: FieldProps) => (
                          <>
                            <FormLabel>Número de nodos de transbordo</FormLabel>
                            <Input min={1} type="number" {...field} />
                          </>
                        )}
                      </Field>

                      <Field name="demandNodes">
                        {({ field }: FieldProps) => (
                          <>
                            <FormLabel>Número de nodos de demanda</FormLabel>
                            <Input min={1} type="number" {...field} />
                          </>
                        )}
                      </Field>

                      <Button type="submit" colorScheme="whiteAlpha">
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Field>
        </div>
      </Form>
    </Formik>
  );
};
