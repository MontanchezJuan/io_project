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

import { DST, ToT, useStepbyStep } from "../../context/StepByStepContext";
import { useHistoryModal } from "../../context/HistoryModalContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryNodeModal = ({ onClose, isOpen }: Props) => {
  const { dataTransfer, dataTransport, step1 } = useStepbyStep();

  const { historyDemand, historySupply, historyTransshipment, typeModal } =
    useHistoryModal();

  const TYPE: ToT = step1.method || "Transbordo";

  interface PropsItemModel {
    type: DST;
    word: string;
    children: React.ReactNode;
  }

  const selectData = (type: DST) => {
    switch (type) {
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
        break;
    }
  };

  const ItemModal = ({ type, word, children }: PropsItemModel) => {
    return (
      <Modal onClose={onClose} size="xl" isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Añadir transición de {word}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col items-center gap-4">
            <div className="flex justify-around items-center w-full">
              <div>
                <Select placeholder={`Nodo de ${word}`}>
                  {selectData(type)}
                </Select>
              </div>

              <ArrowForwardIcon />

              <div>
                <Select placeholder="Nodo">
                  {dataTransfer.demand.map((demand, index) => (
                    <option key={index}>{demand.name}</option>
                  ))}
                </Select>
              </div>

              <Button
                color="#fff"
                bgColor="#472183"
                _hover={{ backgroundColor: "#475183" }}
              >
                Añadir
              </Button>
            </div>

            {children}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  switch (typeModal) {
    case "Demand":
      return (
        <ItemModal word="demanda" type="Demand">
          {historyDemand.length > 0 && (
            <div className="flex flex-col items-center gap-1 w-full">
              {historyDemand.map((demand, index) => (
                <div
                  className="flex flex-col items-center gap-1 w-full"
                  key={index}
                >
                  <p>{demand.name}</p>

                  {demand.transitions?.map((t, i) => {
                    const transitionKey = Object.keys(t)[0];
                    const transitionValue = t[transitionKey];
                    return (
                      <div
                        className="flex justify-around items-center w-full"
                        key={i}
                      >
                        <p>{demand.name}</p>

                        <ArrowForwardIcon />

                        <p>{transitionValue}</p>

                        <ArrowForwardIcon />

                        <p>{transitionKey}</p>

                        <Button
                          color="#fff"
                          bgColor="#472183"
                          _hover={{ backgroundColor: "#475183" }}
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

    case "Supply":
      return (
        <ItemModal word="oferta" type="Supply">
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
        <ItemModal word="transbordo" type="Transshipment">
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
