import { Formik, Field, FieldProps, Form } from "formik";

import {
  Button,
  FormLabel,
  Input,
  Select,
  Tag,
  useDisclosure,
} from "@chakra-ui/react";

import Swal from "sweetalert2";

import { ModalJSON } from "../ModalJSON";
import { AttachmentIcon } from "@chakra-ui/icons";
import { useStepByStep } from "../../hooks/useStepByStep";
import { ToT } from "../../interface/context/stepbystep.interface";

export interface Step1 {
  method: ToT | "";
  supplyNodes: number;
  demandNodes: number;
  transshipmentNodes?: number;
}

export const StepOne = () => {
  const { createNodes, step1, setNextStep, resetNodes, createAllTransition } =
    useStepByStep();

  const { isOpen, onOpen, onClose } = useDisclosure();

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
          setNextStep("step1", values);
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
          setNextStep("step1", values);
        }
      });
    }
  };

  return (
    <>
      <Formik
        initialValues={step1.method ? step1 : initialValues}
        onSubmit={(values, actions) => {
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
                              <FormLabel>
                                Número de nodos de transbordo
                              </FormLabel>
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
                          Crear nodos
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

      <div className="flex justify-center mt-6">
        <Button
          className="flex gap-2"
          colorScheme="whiteAlpha"
          onClick={onOpen}
        >
          <AttachmentIcon />
          Tengo un JSON
        </Button>
      </div>

      {isOpen && <ModalJSON isOpen={isOpen} onClose={onClose} />}
    </>
  );
};
