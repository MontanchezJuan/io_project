import { Button, useDisclosure } from "@chakra-ui/react";

import { useStepbyStep } from "../../context/StepByStepContext";

import { useHistoryModal } from "../../context/HistoryModalContext";

import { HistoryNodeModal } from "./HistoryNodeModal";
import { SupplyNodes } from "./render/SupplyNodes";
import { TransshipmentNodes } from "./render/TransshipmentNodes";
import { DemandNodes } from "./render/DemandNodes";

export const StepTwo = () => {
  const { getTotalDemandQuantity, getTotalSuplyQuantity, dataTransfer } = useStepbyStep();

  const { setTypeModal } = useHistoryModal();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const Title = (type: "Supply" | "Demand" | "Transshipment", word: string, total: number) => {
    return (
      <div className="flex justify-between items-center">
        <p className="text-[24px] font-bold">
          {type !== "Transshipment" ? `${word} total: ${total}` : `${word}`}

        </p>

        <Button
          size="xs"
          onClick={() => {
            setTypeModal(type);
            onOpen();
          }}
        >
          Añadir transición de {word}
        </Button>
      </div>
    );
  };

  return (
    <>
      <HistoryNodeModal onClose={onClose} isOpen={isOpen} />

      <div className="flex flex-col w-full gap-4">
        {Title("Supply", "Oferta", getTotalSuplyQuantity())}

        <SupplyNodes />

        {dataTransfer && dataTransfer.transshipment.length > 0 && (
          <>
            {Title("Transshipment", "Transbordo", 0)}

            <TransshipmentNodes />
          </>
        )}

        {Title("Demand", "Demanda", getTotalDemandQuantity())}

        <DemandNodes />

        <div className="flex justify-between">
          <Button colorScheme="whiteAlpha">Anterior</Button>

          <Button type="submit" colorScheme="whiteAlpha">
            Siguiente
          </Button>
        </div>
      </div>
    </>
  );
};
