import { Button, useDisclosure } from "@chakra-ui/react";

import Swal from "sweetalert2";

import { useStepByStep } from "../../hooks/useStepByStep";
import { useHistoryModal } from "../../context/HistoryModalContext";

import { NodeHistoryModal } from "./NodeHistoryModal";
import { DemandNodes } from "./render/DemandNodes";
import { SupplyNodes } from "./render/SupplyNodes";
import { TransshipmentNodes } from "./render/TransshipmentNodes";
import { CopyButton } from "../CopyButton";

export const StepTwo = () => {
  const {
    dataTransfer,
    dataTransport,
    getTotalDemandQuantity,
    getTotalSupplyQuantity,
    setStep,
    setNextStep,
  } = useStepByStep();

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
        setNextStep("step2");
      }
    });
  };

  return (
    <>
      {isOpen && <NodeHistoryModal onClose={onClose} isOpen={isOpen} />}

      <div className="flex flex-col w-full gap-4">
        {Title("Supply", "Oferta", getTotalSupplyQuantity())}

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

          <CopyButton
            textToCopy={
              dataTransfer.supply.length > 0
                ? JSON.stringify(dataTransfer, null, 2)
                : JSON.stringify(dataTransport, null, 2)
            }
            isWhiteAlpha
          />

          <Button colorScheme="whiteAlpha" onClick={handleNext}>
            Ver gráfico
          </Button>
        </div>
      </div>
    </>
  );
};
