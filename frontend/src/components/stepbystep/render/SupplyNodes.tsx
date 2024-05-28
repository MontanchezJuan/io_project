import { useEffect, useState } from "react";

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
import { SupplyNode } from "../../../interface/common";
import { ToT } from "../../../interface/context/stepbystep.interface";

export const SupplyNodes = () => {
  const {
    createTransition,
    dataTransfer,
    dataTransport,
    deleteTransition,
    setNodeName,
    setQuantity,
    step1,
  } = useStepByStep();

  const TYPE: ToT = step1.method || "Transbordo";

  const [data, setData] = useState<SupplyNode[]>([]);

  useEffect(() => {
    if (dataTransfer.supply.length > 0) {
      setData(dataTransfer.supply);
    } else if (dataTransport.supply.length > 0) {
      setData(dataTransport.supply);
    }
  }, [dataTransfer, dataTransport]);

  const handleNodeNameChange = (
    oldName: string,
    name: string,
    index: number
  ) => {
    const newValue = name || `O${index}`;

    setNodeName(oldName, newValue, TYPE);
  };

  const handleQuantityChange = (name: string, newQuantity: number) => {
    setQuantity(name, newQuantity, TYPE);
  };

  const handleTransitionChange = (
    supplyName: string,
    transitionKey: string,
    newQuantity: number
  ) => {
    createTransition(TYPE, supplyName, transitionKey, newQuantity);
  };

  const handleDeleteTransition = (
    supply: SupplyNode,
    transitionKey: string,
    transitionIndex: number
  ) => {
    Swal.fire(
      "Alerta",
      `Estás seguro que deseas eliminar la transicion de ${supply.name} a ${transitionKey}`,
      "question"
    ).then((result) => {
      if (result.isConfirmed) {
        const transitionToDelete = supply.transitions?.find(
          (t) => Object.keys(t)[0] === transitionKey
        );

        if (transitionToDelete) {
          deleteTransition(supply.name, transitionIndex);
        }
      }
    });
  };

  return (
    <Accordion allowMultiple>
      {data.map((supply, index) => (
        <AccordionItem key={index}>
          <h2>
            <AccordionButton>
              <div className="flex justify-around w-full">
                Nombre nodo:{" "}
                {<span className="text-tertiary">{supply.name}</span>}
                Capacidad:{" "}
                {
                  <span className="text-tertiary">
                    {supply.supply_quantity}
                  </span>
                }
              </div>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel className="flex flex-col gap-4" pb={4}>
            <div className="flex justify-around items-center">
              Nombre:
              <div>
                <Input
                  value={supply.name}
                  onChange={(e) =>
                    handleNodeNameChange(supply.name, e.target.value, index)
                  }
                />
              </div>
            </div>

            <div className="flex justify-around items-center">
              Capacidad:
              <div>
                <Input
                  value={supply.supply_quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      supply.name,
                      parseFloat(e.target.value)
                    )
                  }
                  type="number"
                />
              </div>
            </div>

            {supply.transitions &&
              supply.transitions.map((transition, transitionIndex) => {
                const transitionKey = Object.keys(transition)[0];
                const transitionValue = transition[transitionKey];
                return (
                  <div
                    className="flex justify-around items-center"
                    key={transitionIndex}
                  >
                    <p>{supply.name}</p>

                    <ArrowForwardIcon />

                    <div className="flex items-center gap-4">
                      Costo:
                      <Input
                        placeholder="Costo"
                        value={transitionValue}
                        onChange={(e) =>
                          handleTransitionChange(
                            supply.name,
                            transitionKey,
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </div>

                    <ArrowForwardIcon />

                    <p>{transitionKey}</p>

                    <Tooltip
                      label={`No tener en cuenta el transporte de ${supply.name} a ${transitionKey}`}
                    >
                      <DeleteIcon
                        className="cursor-pointer hover:text-red-600"
                        onClick={() =>
                          handleDeleteTransition(
                            supply,
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
