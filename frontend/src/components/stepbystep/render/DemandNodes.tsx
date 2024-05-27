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

import { ToT } from "../../../interface/context/stepbystep.interface";
import { useStepByStep } from "../../../hooks/useStepByStep";
import { DemandNode } from "../../../interface/common";

export const DemandNodes = () => {
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

  const [data, setData] = useState<DemandNode[]>([]);

  useEffect(() => {
    if (dataTransfer.demand.length > 0) {
      setData(dataTransfer.demand);
    } else {
      setData(dataTransport.demand);
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
    demand: DemandNode,
    transitionKey: string,
    transitionIndex: number
  ) => {
    Swal.fire(
      "Alerta",
      `Estás seguro que deseas eliminar la transicion de ${demand.name} a ${transitionKey}`,
      "question"
    ).then((result) => {
      if (result.isConfirmed) {
        deleteTransition(demand.name, transitionIndex);
      }
    });
  };

  return (
    <Accordion allowMultiple>
      {data.map((demand, index) => (
        <AccordionItem key={index}>
          <h2>
            <AccordionButton>
              <div className="flex justify-around w-full">
                <>
                  Nombre nodo:{" "}
                  {<span className="text-tertiary">{demand.name}</span>}
                  Capacidad:{" "}
                  {
                    <span className="text-tertiary">
                      {demand.demand_quantity}
                    </span>
                  }
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
                  value={demand.name}
                  onChange={(e) =>
                    handleNodeNameChange(demand.name, e.target.value, index)
                  }
                />
              </div>
            </div>

            <div className="flex justify-around items-center">
              Capacidad:
              <div>
                <Input
                  value={demand.demand_quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      demand.name,
                      parseFloat(e.target.value)
                    )
                  }
                  type="number"
                />
              </div>
            </div>

            {demand.transitions &&
              demand.transitions.map((transition, transitionIndex) => {
                const transitionKey = Object.keys(transition)[0];
                const transitionValue = transition[transitionKey];
                return (
                  <div
                    className="flex justify-around items-center"
                    key={transitionIndex}
                  >
                    <p>{demand.name}</p>
                    <ArrowForwardIcon />
                    <div className="flex items-center gap-4">
                      Costo:
                      <Input
                        placeholder="Costo"
                        defaultValue={transitionValue}
                        onChange={(e) =>
                          handleTransitionChange(
                            demand.name,
                            transitionKey,
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </div>
                    <ArrowForwardIcon />
                    <p>{transitionKey}</p>
                    <Tooltip
                      label={`No tener en cuenta el transporte de ${demand.name} a ${transition.name}`}
                    >
                      <DeleteIcon
                        className="cursor-pointer hover:text-red-600"
                        onClick={() =>
                          handleDeleteTransition(
                            demand,
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
