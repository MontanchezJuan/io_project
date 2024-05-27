import { useState } from "react";

import { QuestionIcon } from "@chakra-ui/icons";

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Textarea,
} from "@chakra-ui/react";

import exampleTransbordo from "../assets/exampleTransbordo.json";
import exampleTransporte from "../assets/exampleTransporte.json";
import { Transbordo } from "../interface/transbordo";
import { Transporte } from "../interface/transporte";
import { DemandNode, Node, SupplyNode } from "../interface/common";
import { useStepByStep } from "../hooks/useStepByStep";
import { ToT } from "../interface/context/stepbystep.interface";
import { CopyButton } from "./CopyButton";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalJSON = ({ isOpen, onClose }: Props) => {
  const { problemJSON } = useStepByStep();

  const initialJSON: Transbordo | Transporte = {
    demand: [],
    supply: [],
  };

  const [method, setMethod] = useState<ToT | "">("");
  const [json, setJson] = useState<Transbordo | Transporte>(initialJSON);
  const [textareaValue, setTextareaValue] = useState(
    JSON.stringify(initialJSON, null, 2)
  );

  const handleJSON = () => {
    if ("transshipment" in json) {
      const demand = json.demand.reduce((total) => (total += 1), 0);
      const supply = json.supply.reduce((total) => (total += 1), 0);
      const transshipment = json.transshipment.reduce(
        (total) => (total += 1),
        0
      );
      problemJSON(json, method as ToT, demand, supply, transshipment);
    } else {
      const demand = json.demand.reduce((total) => (total += 1), 0);
      const supply = json.supply.reduce((total) => (total += 1), 0);

      problemJSON(json, method as ToT, demand, supply);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMethod(e.target.value as ToT);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextareaValue(value);

    try {
      const parsedJson = JSON.parse(value);
      setJson(parsedJson);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisabled = (): boolean => {
    if (method === "") return true;
    if (JSON.stringify(json) === JSON.stringify(initialJSON)) return true;

    if (method === "Transbordo" && !isValidTransbordo(json)) return true;
    if (method === "Transporte" && !isValidTransporte(json)) return true;

    return false;
  };

  const isValidSupplyNode = (item: unknown): item is SupplyNode => {
    if (typeof item !== "object" || item === null) return false;
    const supplyNode = item as SupplyNode;
    return (
      typeof supplyNode.supply_quantity === "number" &&
      typeof supplyNode.name === "string" &&
      (supplyNode.transitions === undefined ||
        (Array.isArray(supplyNode.transitions) &&
          supplyNode.transitions.every(
            (transition) =>
              typeof transition === "object" &&
              Object.values(transition).every(
                (value) => typeof value === "number"
              )
          )))
    );
  };

  const isValidDemandNode = (item: unknown): item is DemandNode => {
    if (typeof item !== "object" || item === null) return false;
    const demandNode = item as DemandNode;
    return (
      typeof demandNode.demand_quantity === "number" &&
      typeof demandNode.name === "string" &&
      (demandNode.transitions === undefined ||
        (Array.isArray(demandNode.transitions) &&
          demandNode.transitions.every(
            (transition) =>
              typeof transition === "object" &&
              Object.values(transition).every(
                (value) => typeof value === "number"
              )
          )))
    );
  };

  const isValidNode = (item: unknown): item is Node => {
    if (typeof item !== "object" || item === null) return false;
    const node = item as Node;
    return (
      typeof node.name === "string" &&
      (node.transitions === undefined ||
        (Array.isArray(node.transitions) &&
          node.transitions.every(
            (transition) =>
              typeof transition === "object" &&
              Object.values(transition).every(
                (value) => typeof value === "number"
              )
          )))
    );
  };

  const isValidTransbordo = (obj: unknown): obj is Transbordo => {
    if (typeof obj !== "object" || obj === null) return false;
    const transbordo = obj as Transbordo;
    return (
      Array.isArray(transbordo.supply) &&
      Array.isArray(transbordo.demand) &&
      Array.isArray(transbordo.transshipment) &&
      transbordo.supply.every(isValidSupplyNode) &&
      transbordo.demand.every(isValidDemandNode) &&
      transbordo.transshipment.every(isValidNode)
    );
  };

  const isValidTransporte = (obj: unknown): obj is Transporte => {
    if (typeof obj !== "object" || obj === null) return false;
    const transporte = obj as Transporte;
    return (
      Array.isArray(transporte.supply) &&
      Array.isArray(transporte.demand) &&
      transporte.supply.every(isValidSupplyNode) &&
      transporte.demand.every(isValidDemandNode)
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Insertar JSON</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="flex flex-col items-center gap-4">
          <p>Aquí tienes algunos ejemplos:</p>

          <div className="flex gap-4">
            <POP type="Transbordo" />

            <POP type="Transporte" />
          </div>

          <Select placeholder="Seleccione un método" onChange={handleSelect}>
            <option className="text-black" value="Transporte">
              Transporte
            </option>
            <option className="text-black" value="Transbordo">
              Transbordo
            </option>
          </Select>

          <Textarea value={textareaValue} onChange={handleTextareaChange} />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Cancelar
          </Button>

          <Button
            color="#fff"
            bgColor="#472183"
            _hover={{ backgroundColor: "#475183" }}
            onClick={handleJSON}
            isDisabled={handleDisabled()}
          >
            Seleccionar JSON
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface POPProps {
  type: ToT;
}

const POP = ({ type }: POPProps) => {
  return (
    <Popover size="500" isLazy>
      <PopoverTrigger>
        <Button
          className="flex gap-2"
          color="#fff"
          bgColor="#472183"
          _hover={{ backgroundColor: "#475183" }}
        >
          <QuestionIcon /> {type}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader fontWeight="semibold">Ejemplo para {type}</PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <div className="flex justify-center w-full">
            <CopyButton
              json={
                type === "Transbordo" ? exampleTransbordo : exampleTransporte
              }
            />
          </div>

          {type === "Transbordo" ? (
            <pre>{JSON.stringify(exampleTransbordo, null, 1)}</pre>
          ) : (
            <pre>{JSON.stringify(exampleTransporte, null, 1)}</pre>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
