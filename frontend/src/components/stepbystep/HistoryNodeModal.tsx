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

import { ToT, useStepbyStep } from "../../context/StepByStepContext";
import { useHistoryModal } from "../../context/HistoryModalContext";
import { Node, SupplyNode } from "../../interface/common";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryNodeModal = ({ onClose, isOpen }: Props) => {
  const {
    createTransition,
    dataTransfer,
    dataTransport,
    getMissingValues,
    step1,
  } = useStepbyStep();

  const {
    historySupply,
    historyTransshipment,
    setHistorySupply,
    setHistoryTransshipment,
    typeModal,
  } = useHistoryModal();

  const TYPE: ToT = step1.method || "Transbordo";

  interface PropsItemModel {
    word: string;
    children: React.ReactNode;
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

  const ItemModal = ({ word, children }: PropsItemModel) => {
    return (
      <Modal onClose={onClose} size="xl" isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Añadir transición de {word}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col items-center gap-4">
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

            {children}
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
    switch (typeModal) {
      case "Supply":
        setHistorySupply((prev) => {
          if (prev) {
            return prev
              .map((node) => {
                if (node.name === fromNode) {
                  const updatedTransitions = (node.transitions || []).filter(
                    (transition) =>
                      !Object.prototype.hasOwnProperty.call(transition, toNode)
                  );
                  if (updatedTransitions.length > 0) {
                    return { ...node, transitions: updatedTransitions };
                  }
                  return null;
                }
                return node;
              })
              .filter((node): node is SupplyNode => node !== null);
          } else {
            return prev;
          }
        });
        break;
      case "Transshipment":
        setHistoryTransshipment((prev) => {
          if (prev) {
            return prev
              .map((node) => {
                if (node.name === fromNode) {
                  const updatedTransitions = (node.transitions || []).filter(
                    (transition) =>
                      !Object.prototype.hasOwnProperty.call(transition, toNode)
                  );
                  if (updatedTransitions.length > 0) {
                    return { ...node, transitions: updatedTransitions };
                  }
                  return null;
                }
                return node;
              })
              .filter((node): node is Node => node !== null);
          } else {
            return prev;
          }
        });
        break;

      default:
        break;
    }
    createTransition(TYPE, fromNode, toNode, weight);
  };

  switch (typeModal) {
    case "Demand":
      return (
        <ItemModal word="demanda">
          <></>
        </ItemModal>
      );

    case "Supply":
      return (
        <ItemModal word="oferta">
          {historySupply.length > 0 && (
            <div className="flex flex-col items-center gap-1 w-full">
              {historySupply.map((supply, index) => (
                <div
                  className="flex flex-col items-center gap-1 w-full"
                  key={index}
                >
                  <p>{supply.name}</p>

                  {supply.transitions?.map((t, i) => {
                    const transitionKey = Object.keys(t)[0];
                    const transitionValue = t[transitionKey];
                    return (
                      <div
                        className="flex justify-around items-center w-full"
                        key={i}
                      >
                        <p>{supply.name}</p>

                        <ArrowForwardIcon />

                        <p>{transitionValue}</p>

                        <ArrowForwardIcon />

                        <p>{transitionKey}</p>

                        <Button
                          color="#fff"
                          bgColor="#472183"
                          _hover={{ backgroundColor: "#475183" }}
                          onClick={() =>
                            handleAddNode(
                              supply.name,
                              transitionKey,
                              transitionValue
                            )
                          }
                        >
                          Restaurar
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </ItemModal>
      );
    case "Transshipment":
      return (
        <ItemModal word="transbordo">
          {historyTransshipment.length > 0 && (
            <div className="flex flex-col items-center gap-1 w-full">
              {historyTransshipment.map((transshipment, index) => (
                <div
                  className="flex flex-col items-center gap-1 w-full"
                  key={index}
                >
                  <p>{transshipment.name}</p>

                  {transshipment.transitions?.map((t, i) => {
                    const transitionKey = Object.keys(t)[0];
                    const transitionValue = t[transitionKey];
                    return (
                      <div
                        className="flex justify-around items-center w-full"
                        key={i}
                      >
                        <p>{transshipment.name}</p>

                        <ArrowForwardIcon />

                        <p>{transitionValue}</p>

                        <ArrowForwardIcon />

                        <p>{transitionKey}</p>

                        <Button
                          color="#fff"
                          bgColor="#472183"
                          _hover={{ backgroundColor: "#475183" }}
                          onClick={() =>
                            handleAddNode(
                              transshipment.name,
                              transitionKey,
                              transitionValue
                            )
                          }
                        >
                          Restaurar
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </ItemModal>
      );

    default:
      break;
  }
};
