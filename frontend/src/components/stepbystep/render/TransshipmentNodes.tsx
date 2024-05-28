import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import { ArrowForwardIcon, DeleteIcon } from "@chakra-ui/icons";

import Swal from "sweetalert2";

import { useStepByStep } from "../../../hooks/useStepByStep";
import { Node } from "../../../interface/common";
import { ToT } from "../../../interface/context/stepbystep.interface";

export const TransshipmentNodes = () => {
  const {
    createTransition,
    dataTransfer,
    deleteTransition,
    setNodeName,
    step1,
  } = useStepByStep();

  const TYPE: ToT = step1.method || "Transbordo";

  const handleNodeNameChange = (
    oldName: string,
    name: string,
    index: number
  ) => {
    const newValue = name || `T${index}`;

    setNodeName(oldName, newValue, TYPE);
  };

  const handleTransitionChange = (
    supplyName: string,
    transitionKey: string,
    newQuantity: number
  ) => {
    createTransition(TYPE, supplyName, transitionKey, newQuantity);
  };

  const handleDeleteTransition = (
    transshipment: Node,
    transitionKey: string,
    transitionIndex: number
  ) => {
    Swal.fire(
      "Alerta",
      `Estás seguro que deseas eliminar la transicion de ${transshipment.name} a ${transitionKey}`,
      "question"
    ).then((result) => {
      if (result.isConfirmed) {
        const transitionToDelete = transshipment.transitions?.find(
          (t) => Object.keys(t)[0] === transitionKey
        );

        if (transitionToDelete) {
          deleteTransition(transshipment.name, transitionIndex);
        }
      }
    });
  };

  return (
    <Accordion allowMultiple>
      {dataTransfer.transshipment.map((transshipment, index) => (
        <AccordionItem key={index}>
          <h2>
            <AccordionButton>
              <div className="flex justify-around w-full">
                <>
                  Nombre nodo:{" "}
                  {<span className="text-tertiary">{transshipment.name}</span>}
                </>
              </div>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel className="flex flex-col gap-4" pb={4}>
            <div className="flex justify-around items-center">
              Nombre:
              <div>
                <Input
                  value={transshipment.name}
                  onChange={(e) =>
                    handleNodeNameChange(
                      transshipment.name,
                      e.target.value,
                      index
                    )
                  }
                />
              </div>
            </div>

            {transshipment.transitions &&
              transshipment.transitions.map((transition, transitionIndex) => {
                const transitionKey = Object.keys(transition)[0];
                const transitionValue = transition[transitionKey];
                return (
                  <div
                    className="flex justify-around items-center"
                    key={transitionIndex}
                  >
                    <p>{transshipment.name}</p>
                    <ArrowForwardIcon />
                    <div className="flex items-center gap-4">
                      Costo:
                      <Input
                        placeholder="Costo"
                        value={transitionValue}
                        onChange={(e) =>
                          handleTransitionChange(
                            transshipment.name,
                            transitionKey,
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </div>
                    <ArrowForwardIcon />
                    <p>{transitionKey}</p>
                    <Tooltip
                      label={`No tener en cuenta el transporte de ${transshipment.name} a ${transition.name}`}
                    >
                      <DeleteIcon
                        className="cursor-pointer hover:text-red-600"
                        onClick={() =>
                          handleDeleteTransition(
                            transshipment,
                            transitionKey,
                            transitionIndex
                          )
                        }
                      />
                    </Tooltip>
                  </div>
                );
              })}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
