import { Button, useDisclosure } from "@chakra-ui/react";

import { useStepbyStep } from "../../context/StepByStepContext";

import { useHistoryModal } from "../../context/HistoryModalContext";

import { HistoryNodeModal } from "./HistoryNodeModal";
import { SupplyNodes } from "./render/SupplyNodes";
import { TransshipmentNodes } from "./render/TransshipmentNodes";
import { DemandNodes } from "./render/DemandNodes";
import Swal from "sweetalert2";

export const StepTwo = () => {
  const {
    dataTransfer,
    getTotalDemandQuantity,
    getTotalSuplyQuantity,
    setStep,
    setStep2,
  } = useStepbyStep();

  const { setTypeModal } = useHistoryModal();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const Title = (
    type: "Supply" | "Demand" | "Transshipment",
    word: string,
    total: number
  ) => {
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

  const handleNext = () => {
    Swal.fire(
      "Alerta",
      "Ten en cuenta los valores que hayan quedado en 0",
      "question"
    ).then((result) => {
      if (result.isConfirmed) {
        setStep2();
      }
    });
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
          <Button colorScheme="whiteAlpha" onClick={() => setStep(0)}>
            Anterior
          </Button>

          <Button colorScheme="whiteAlpha" onClick={handleNext}>
            Siguiente
          </Button>
        </div>
      </div>
    </>
  );
};
