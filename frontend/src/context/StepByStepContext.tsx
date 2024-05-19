import { ReactNode, createContext, useContext, useState } from "react";

import { DemandNode, Node, SupplyNode } from "../interface/common";
import { Step1 } from "../components/stepbystep/StepOne";
import { Transbordo } from "../interface/transbordo";
import { Transporte } from "../interface/transporte";

interface StepByStepContextType {
  activeStep: number;
  currentStep: number;
  createAllTransition: (type: ToT) => void;
  createNodes: (number: number, word: NodeType, type: ToT) => void;
  createTransition: (
    type: ToT,
    fromNode: string,
    toNode: string,
    weight: number
  ) => void;
  dataTransfer: Transbordo;
  dataTransport: Transporte;
  deleteTransition: (
    type: ToT,
    nodeName: string,
    transitionNodeName: string
  ) => void;
  resetNodes: (type: ToT) => void;
  setNodeName: (nodeName: string, newNodeName: string, type: ToT) => void;
  setQuantity: (nodeName: string, quantity: number, type: ToT) => void;
  setStep: (newStep: number) => void;
  setStep1: (newStep1: Step1) => void;
  step1: Step1;
}

const StepbyStepContext = createContext<StepByStepContextType | undefined>(
  undefined
);

interface InitialState {
  activeStep: number;
  currentStep: number;
  step1: Step1;
  dataTransport: Transporte;
  dataTransfer: Transbordo;
}

const InitialStep: InitialState = {
  activeStep: 1,
  currentStep: 0,
  step1: {
    method: "",
    supplyNodes: 0,
    demandNodes: 0,
    transshipmentNodes: 0,
  },
  dataTransfer: { supply: [], demand: [], transshipment: [] },
  dataTransport: { supply: [], demand: [] },
};

const getInitialState = (): InitialState => {
  if (!localStorage.getItem("step")) return InitialStep;

  const savedStep = JSON.parse(localStorage.getItem("step")!);
  return savedStep || InitialStep;
};

type NodeType = "O" | "D" | "T";
export type ToT = "Transporte" | "Transbordo";
export type DST = "Supply" | "Demand" | "Transshipment";

export const StepbyStepProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stepGlobal, setStepGlobal] = useState<InitialState>(getInitialState);

  const resetNodes = (type: ToT) => {
    if (type === "Transbordo") {
      setStepGlobal((prev) => {
        if (prev) {
          return {
            ...prev,
            dataTransfer: { supply: [], demand: [], transshipment: [] },
          };
        } else {
          return prev;
        }
      });
    } else {
      setStepGlobal((prev) => {
        if (prev) {
          return {
            ...prev,
            dataTransport: { supply: [], demand: [] },
          };
        } else {
          return prev;
        }
      });
    }
  };

  const createNodes = (number: number, word: NodeType, type: ToT) => {
    if (type === "Transbordo") {
      switch (word) {
        case "D":
          setStepGlobal((prev) => {
            const arrayNodes: DemandNode[] = [];

            for (let index = 0; index < number; index++) {
              arrayNodes.push({
                demand_quantity: 0,
                name: `${word}${index}`,
                transitions: [],
              });
            }

            if (prev) {
              return {
                ...prev,
                dataTransfer: { ...prev.dataTransfer, demand: arrayNodes },
              };
            } else {
              return prev;
            }
          });
          break;

        case "O":
          setStepGlobal((prev) => {
            const arrayNodes: SupplyNode[] = [];

            for (let index = 0; index < number; index++) {
              arrayNodes.push({
                name: `${word}${index}`,
                supply_quantity: 0,
                transitions: [],
              });
            }

            if (prev) {
              return {
                ...prev,
                dataTransfer: { ...prev.dataTransfer, supply: arrayNodes },
              };
            } else {
              return prev;
            }
          });
          break;

        case "T":
          setStepGlobal((prev) => {
            const arrayNodes: Node[] = [];

            for (let index = 0; index < number; index++) {
              arrayNodes.push({ name: `${word}${index}`, transitions: [] });
            }
            if (prev) {
              return {
                ...prev,
                dataTransfer: {
                  ...prev.dataTransfer,
                  transshipment: arrayNodes,
                },
              };
            } else {
              return prev;
            }
          });
          break;

        default:
          break;
      }
    } else {
      switch (word) {
        case "D":
          setStepGlobal((prev) => {
            const arrayNodes: DemandNode[] = [];

            for (let index = 0; index < number; index++) {
              arrayNodes.push({
                demand_quantity: 0,
                name: `${word}${index}`,
                transitions: [],
              });
            }

            if (prev) {
              return {
                ...prev,
                dataTransport: { ...prev.dataTransport, demand: arrayNodes },
              };
            } else {
              return prev;
            }
          });
          break;

        case "O":
          setStepGlobal((prev) => {
            const arrayNodes: SupplyNode[] = [];

            for (let index = 0; index < number; index++) {
              arrayNodes.push({
                name: `${word}${index}`,
                supply_quantity: 0,
                transitions: [],
              });
            }

            if (prev) {
              return {
                ...prev,
                dataTransport: { ...prev.dataTransport, supply: arrayNodes },
              };
            } else {
              return prev;
            }
          });
          break;

        default:
          break;
      }
    }
  };

  const createTransition = (
    type: ToT,
    fromNode: string,
    toNode: string,
    capacity: number
  ) => {
    const updateNodeTransitions = <T extends Node | SupplyNode | DemandNode>(
      nodes: T[],
      nodeName: string
    ): T[] => {
      return nodes.map((node) => {
        if (node.name === nodeName) {
          const existingTransitionIndex = node.transitions?.findIndex(
            (transition) =>
              Object.prototype.hasOwnProperty.call(transition, toNode)
          );

          if (
            existingTransitionIndex !== undefined &&
            existingTransitionIndex >= 0
          ) {
            const updatedTransitions = [...(node.transitions || [])];
            updatedTransitions[existingTransitionIndex] = {
              [toNode]: capacity || 0,
            };
            return { ...node, transitions: updatedTransitions };
          } else {
            return {
              ...node,
              transitions: [
                ...(node.transitions || []),
                { [toNode]: capacity || 0 },
              ],
            };
          }
        }
        return node;
      });
    };

    if (type === "Transbordo") {
      setStepGlobal((prev) => {
        if (prev) {
          const newTransfer = { ...prev.dataTransfer };

          newTransfer.supply = updateNodeTransitions(
            newTransfer.supply,
            fromNode
          );
          newTransfer.demand = updateNodeTransitions(
            newTransfer.demand,
            fromNode
          );
          newTransfer.transshipment = updateNodeTransitions(
            newTransfer.transshipment,
            fromNode
          );

          return {
            ...prev,
            dataTransfer: newTransfer,
          };
        } else {
          return prev;
        }
      });
    } else {
      setStepGlobal((prev) => {
        if (prev) {
          const newTransport = { ...prev.dataTransport };

          newTransport.supply = updateNodeTransitions(
            newTransport.supply,
            fromNode
          );
          newTransport.demand = updateNodeTransitions(
            newTransport.demand,
            fromNode
          );

          return {
            ...prev,
            dataTransport: newTransport,
          };
        } else {
          return prev;
        }
      });
    }
  };

  const deleteTransition = (
    type: ToT,
    nodeName: string,
    transitionNodeName: string
  ) => {
    const removeTransition = <T extends Node | SupplyNode | DemandNode>(
      nodes: T[],
      nodeName: string,
      transitionNodeName: string
    ): T[] => {
      return nodes.map((node) => {
        if (node.name === nodeName) {
          const updatedTransitions = (node.transitions || []).filter(
            (transition) =>
              !Object.prototype.hasOwnProperty.call(
                transition,
                transitionNodeName
              )
          );
          return { ...node, transitions: updatedTransitions };
        }
        return node;
      });
    };

    if (type === "Transbordo") {
      setStepGlobal((prev) => {
        if (prev) {
          const newTransfer = { ...prev.dataTransfer };

          newTransfer.supply = removeTransition(
            newTransfer.supply,
            nodeName,
            transitionNodeName
          );
          newTransfer.demand = removeTransition(
            newTransfer.demand,
            nodeName,
            transitionNodeName
          );
          newTransfer.transshipment = removeTransition(
            newTransfer.transshipment,
            nodeName,
            transitionNodeName
          );

          return {
            ...prev,
            dataTransfer: newTransfer,
          };
        } else {
          return prev;
        }
      });
    } else {
      setStepGlobal((prev) => {
        if (prev) {
          const newTransport = { ...prev.dataTransport };

          newTransport.supply = removeTransition(
            newTransport.supply,
            nodeName,
            transitionNodeName
          );
          newTransport.demand = removeTransition(
            newTransport.demand,
            nodeName,
            transitionNodeName
          );

          return {
            ...prev,
            dataTransport: newTransport,
          };
        } else {
          return prev;
        }
      });
    }
  };

  const createAllTransition = (type: ToT) => {
    if (type === "Transbordo") {
      setStepGlobal((prev) => {
        if (prev) {
          const newTransfer: Transbordo = { ...prev.dataTransfer };

          const updateAllTransitions = <
            T extends Node | SupplyNode | DemandNode
          >(
            nodes: T[],
            toNodes: Node[] | SupplyNode[] | DemandNode[]
          ) => {
            return nodes.map((node) => ({
              ...node,
              transitions: [
                ...(node.transitions || []),
                ...toNodes.map((toNode) => ({ [toNode.name]: 0 })),
              ],
            }));
          };

          newTransfer.supply = updateAllTransitions(
            newTransfer.supply,
            newTransfer.transshipment
          );

          newTransfer.transshipment = updateAllTransitions(
            newTransfer.transshipment,
            newTransfer.demand
          );

          return {
            ...prev,
            dataTransfer: newTransfer,
          };
        } else {
          return prev;
        }
      });
    } else {
      setStepGlobal((prev) => {
        if (prev) {
          const newTransport: Transporte = { ...prev.dataTransport };

          const updateAllTransitions = <
            T extends Node | SupplyNode | DemandNode
          >(
            nodes: T[],
            toNodes: DemandNode[] | SupplyNode[]
          ) => {
            return nodes.map((node) => ({
              ...node,
              transitions: [
                ...(node.transitions || []),
                ...toNodes.map((toNode) => ({ [toNode.name]: 0 })),
              ],
            }));
          };

          newTransport.supply = updateAllTransitions(
            newTransport.supply,
            newTransport.demand
          );

          return {
            ...prev,
            dataTransport: newTransport,
          };
        } else {
          return prev;
        }
      });
    }
  };

  const setNodeName = (nodeName: string, newNodeName: string, type: ToT) => {
    const getAllNamesTransfer = () => {
      const transferNodes = [
        ...stepGlobal.dataTransfer.supply,
        ...stepGlobal.dataTransfer.demand,
        ...stepGlobal.dataTransfer.transshipment,
      ];
      return transferNodes.map((node) => node.name);
    };

    const getAllNamesTransport = () => {
      const transportNodes = [
        ...stepGlobal.dataTransport.supply,
        ...stepGlobal.dataTransport.demand,
      ];
      return transportNodes.map((node) => node.name);
    };

    const getUniqueNodeName = (name: string, allNames: string[]) => {
      let uniqueName = name;
      let counter = 1;
      while (allNames.includes(uniqueName)) {
        uniqueName = `${name}${counter}`;
        counter++;
      }
      return uniqueName;
    };

    const updateNodeNameAndTransitions = <
      T extends Node | SupplyNode | DemandNode
    >(
      nodes: T[],
      nodeName: string,
      newNodeName: string
    ) => {
      return nodes.map((node) => {
        const updatedNode = {
          ...node,
          transitions: (node.transitions || []).map((transition) => {
            const newTransition = { ...transition };
            if (transition[nodeName] !== undefined) {
              newTransition[newNodeName] = transition[nodeName];
              delete newTransition[nodeName];
            }
            return newTransition;
          }),
        };
        if (node.name === nodeName) {
          updatedNode.name = newNodeName;
        } else {
          updatedNode.transitions = (node.transitions || []).map(
            (transition) => {
              if (transition[nodeName] !== undefined) {
                const newTransition = { ...transition };
                newTransition[newNodeName] = transition[nodeName];
                delete newTransition[nodeName];
                return newTransition;
              }
              return transition;
            }
          );
        }
        return updatedNode;
      });
    };

    if (type === "Transbordo") {
      setStepGlobal((prev) => {
        if (prev) {
          const newTransfer = { ...prev.dataTransfer };

          const allNames = getAllNamesTransfer();
          const uniqueNewNodeName = getUniqueNodeName(newNodeName, allNames);

          newTransfer.supply = updateNodeNameAndTransitions(
            newTransfer.supply,
            nodeName,
            uniqueNewNodeName
          );
          newTransfer.demand = updateNodeNameAndTransitions(
            newTransfer.demand,
            nodeName,
            uniqueNewNodeName
          );
          newTransfer.transshipment = updateNodeNameAndTransitions(
            newTransfer.transshipment,
            nodeName,
            uniqueNewNodeName
          );

          return {
            ...prev,
            dataTransfer: newTransfer,
          };
        } else {
          return prev;
        }
      });
    } else {
      setStepGlobal((prev) => {
        if (prev) {
          const newTransport = { ...prev.dataTransport };

          const allNames = getAllNamesTransport();
          const uniqueNewNodeName = getUniqueNodeName(newNodeName, allNames);

          newTransport.supply = updateNodeNameAndTransitions(
            newTransport.supply,
            nodeName,
            uniqueNewNodeName
          );
          newTransport.demand = updateNodeNameAndTransitions(
            newTransport.demand,
            nodeName,
            uniqueNewNodeName
          );

          return {
            ...prev,
            dataTransport: newTransport,
          };
        } else {
          return prev;
        }
      });
    }
  };

  const setQuantity = (nodeName: string, quantity: number, type: ToT) => {
    const updateNodeQuantity = <T extends SupplyNode | DemandNode>(
      nodes: T[],
      nodeName: string
    ): T[] => {
      return nodes.map((node) => {
        if (node.name === nodeName) {
          if ("supply_quantity" in node) {
            return {
              ...node,
              supply_quantity: quantity,
            } as T;
          } else if ("demand_quantity" in node) {
            return {
              ...node,
              demand_quantity: quantity,
            } as T;
          }
        }
        return node;
      });
    };

    if (type === "Transbordo") {
      setStepGlobal((prev) => {
        if (prev) {
          const newTransfer = { ...prev.dataTransfer };

          newTransfer.supply = updateNodeQuantity(newTransfer.supply, nodeName);
          newTransfer.demand = updateNodeQuantity(newTransfer.demand, nodeName);

          return {
            ...prev,
            dataTransfer: newTransfer,
          };
        } else {
          return prev;
        }
      });
    } else {
      setStepGlobal((prev) => {
        if (prev) {
          const newTransport = { ...prev.dataTransport };

          newTransport.supply = updateNodeQuantity(
            newTransport.supply,
            nodeName
          );
          newTransport.demand = updateNodeQuantity(
            newTransport.demand,
            nodeName
          );

          return {
            ...prev,
            dataTransport: newTransport,
          };
        } else {
          return prev;
        }
      });
    }
  };

  const setStep = (newStep: number) => {
    setStepGlobal({ ...stepGlobal, currentStep: newStep });
  };

  const setStep1 = (newStep1: Step1) => {
    if (!newStep1) return;

    setStepGlobal((prev) => {
      if (prev) {
        return {
          ...prev,
          activeStep: 2,
          currentStep: 1,
          step1: newStep1,
        };
      } else {
        return prev;
      }
    });
  };

  return (
    <StepbyStepContext.Provider
      value={{
        ...stepGlobal,
        createAllTransition,
        createNodes,
        createTransition,
        deleteTransition,
        resetNodes,
        setNodeName,
        setQuantity,
        setStep,
        setStep1,
      }}
    >
      {children}
    </StepbyStepContext.Provider>
  );
};

export const useStepbyStep = (): StepByStepContextType => {
  const context = useContext(StepbyStepContext);
  if (!context) {
    throw new Error(
      "useStepbyStep debe ser usado dentro de un StepbyStepProvider"
    );
  }
  return context;
};
