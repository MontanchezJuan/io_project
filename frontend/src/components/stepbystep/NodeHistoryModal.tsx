import { useMemo } from "react";

import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik } from "formik";

import { useHistoryModal } from "../../context/HistoryModalContext";
import { useStepByStep } from "../../hooks/useStepByStep";
import { ToT } from "../../interface/context/stepbystep.interface";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NodeHistoryModal = ({ onClose, isOpen }: Props) => {
  const {
    createTransition,
    dataTransfer,
    dataTransport,
    getMissingValues,
    step1,
  } = useStepByStep();

  const { typeModal } = useHistoryModal();

  const TYPE: ToT = step1.method || "Transbordo";

  interface PropsItemModel {
    word: string;
  }

  const selectData = useMemo(() => {
    switch (typeModal) {
      case "Demand":
        return TYPE === "Transbordo"
          ? dataTransfer.demand.map((demand, index) => (
              <option key={index} value={demand.name}>
                {demand.name}
              </option>
            ))
          : dataTransport.demand.map((demand, index) => (
              <option key={index} value={demand.name}>
                {demand.name}
              </option>
            ));
      case "Supply":
        return TYPE === "Transbordo"
          ? dataTransfer.supply.map((supply, index) => (
              <option key={index} value={supply.name}>
                {supply.name}
              </option>
            ))
          : dataTransport.supply.map((supply, index) => (
              <option key={index} value={supply.name}>
                {supply.name}
              </option>
            ));
      case "Transshipment":
        return dataTransfer.transshipment.map((transshipment, index) => (
          <option key={index} value={transshipment.name}>
            {transshipment.name}
          </option>
        ));

      default:
        return [];
    }
  }, [typeModal, TYPE, dataTransfer, dataTransport]);

  const ItemModal = ({ word }: PropsItemModel) => {
    return (
      <Modal onClose={onClose} size="xl" isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Añadir transición de {word}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col items-center gap-4">
            {TYPE === "Transbordo" && (
              <Formik
                initialValues={{ fromNode: "", toNode: "" }}
                onSubmit={(values, actions) => {
                  handleAddNode(values.fromNode, values.toNode);
                  actions.setSubmitting(false);
                }}
              >
                <Form className="flex justify-around items-center w-full">
                  <Field name="fromNode">
                    {({ field }: FieldProps) => (
                      <div>
                        <Select placeholder={`Nodo de ${word}`} {...field}>
                          {selectData}
                        </Select>
                      </div>
                    )}
                  </Field>

                  <ArrowForwardIcon />

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

                  <Button
                    color="#fff"
                    bgColor="#472183"
                    _hover={{ backgroundColor: "#475183" }}
                    type="submit"
                  >
                    Añadir
                  </Button>
                </Form>
              </Formik>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const handleAddNode = (
    fromNode: string,
    toNode: string,
    weight: number = 0
  ) => {
    createTransition(TYPE, fromNode, toNode, weight);
  };

  switch (typeModal) {
    case "Demand":
      return <ItemModal word="demanda" />;

    case "Supply":
      return <ItemModal word="oferta" />;
    case "Transshipment":
      return <ItemModal word="transbordo" />;

    default:
      break;
  }
};
