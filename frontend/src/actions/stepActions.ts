import { Dispatch, SetStateAction } from "react";
import {
  DST,
  InitialState,
  NodeType,
  StepConfig,
  StepData,
  StepType,
  ToT,
} from "../interface/context/stepbystep.interface";
import { DemandNode, Node, SupplyNode } from "../interface/common";
import { DataResponseTransbordo, Transbordo } from "../interface/transbordo";
import { DataResponseTransporte, Transporte } from "../interface/transporte";
import { Step4 } from "../components/stepbystep/StepFour";
import { Step1 } from "../components/stepbystep/StepOne";

export const createAllTransition =
  (setStepGlobal: Dispatch<SetStateAction<InitialState>>) => (type: ToT) => {
    setStepGlobal((prev) => {
      if (prev) {
        const updateAllTransitions = <T extends Node | SupplyNode | DemandNode>(
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

        if (type === "Transbordo") {
          const newTransfer: Transbordo = { ...prev.dataTransfer };

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
          const newTransport: Transporte = { ...prev.dataTransport };
          newTransport.supply = updateAllTransitions(
            newTransport.supply,
            newTransport.demand
          );

          return {
            ...prev,
            dataTransport: newTransport,
          };
        }
      } else {
        return prev;
      }
    });
  };

export const createNodes =
  (setStepGlobal: Dispatch<SetStateAction<InitialState>>) =>
  (number: number, word: NodeType, type: ToT) => {
    switch (word) {
      case "D":
        setStepGlobal((prev) => {
          if (prev) {
            const arrayNodes: DemandNode[] = [];

            for (let index = 0; index < number; index++) {
              arrayNodes.push({
                demand_quantity: 0,
                name: `${word}${index}`,
                transitions: [],
              });
            }

            if (type === "Transbordo") {
              return {
                ...prev,
                dataTransfer: { ...prev.dataTransfer, demand: arrayNodes },
              };
            }

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
          if (prev) {
            const arrayNodes: SupplyNode[] = [];

            for (let index = 0; index < number; index++) {
              arrayNodes.push({
                name: `${word}${index}`,
                supply_quantity: 0,
                transitions: [],
              });
            }

            if (type === "Transbordo") {
              return {
                ...prev,
                dataTransfer: { ...prev.dataTransfer, supply: arrayNodes },
              };
            }

            return {
              ...prev,
              dataTransport: { ...prev.dataTransport, supply: arrayNodes },
            };
          } else {
            return prev;
          }
        });
        break;

      case "T":
        setStepGlobal((prev) => {
          if (prev && type === "Transbordo") {
            const arrayNodes: Node[] = [];

            for (let index = 0; index < number; index++) {
              arrayNodes.push({ name: `${word}${index}`, transitions: [] });
            }

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
  };

export const createTransition =
  (setStepGlobal: Dispatch<SetStateAction<InitialState>>) =>
  (type: ToT, fromNode: string, toNode: string, capacity: number) => {
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

    setStepGlobal((prev) => {
      if (prev) {
        if (type === "Transbordo") {
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
        }

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
  };

export const deleteTransition =
  (setStepGlobal: Dispatch<SetStateAction<InitialState>>) =>
  (nodeName: string, transitionIndex: number) => {
    const removeTransitionByIndex = <T extends Node | SupplyNode | DemandNode>(
      nodes: T[],
      nodeName: string,
      index: number
    ): T[] => {
      return nodes.map((node) => {
        if (node.name === nodeName) {
          const updatedTransitions = (node.transitions || []).filter(
            (_, i) => i !== index
          );
          return { ...node, transitions: updatedTransitions };
        }
        return node;
      });
    };

    setStepGlobal((prev) => {
      if (prev) {
        if (prev.step1.method === "Transbordo") {
          const newTransfer = { ...prev.dataTransfer };

          newTransfer.supply = removeTransitionByIndex(
            newTransfer.supply,
            nodeName,
            transitionIndex
          );
          newTransfer.demand = removeTransitionByIndex(
            newTransfer.demand,
            nodeName,
            transitionIndex
          );
          newTransfer.transshipment = removeTransitionByIndex(
            newTransfer.transshipment,
            nodeName,
            transitionIndex
          );

          return {
            ...prev,
            dataTransfer: newTransfer,
          };
        } else {
          const newTransport = { ...prev.dataTransport };

          newTransport.supply = removeTransitionByIndex(
            newTransport.supply,
            nodeName,
            transitionIndex
          );
          newTransport.demand = removeTransitionByIndex(
            newTransport.demand,
            nodeName,
            transitionIndex
          );

          return {
            ...prev,
            dataTransport: newTransport,
          };
        }
      }
      return prev;
    });
  };

export const getMissingValues =
  (stepGlobal: InitialState) =>
  (type: DST, method: ToT, currentNode: string) => {
    let relevantNodes: (Node | SupplyNode | DemandNode)[] = [];
    let allNodes: (Node | SupplyNode | DemandNode)[] = [];

    if (method === "Transbordo") {
      switch (type) {
        case "Supply":
          relevantNodes = stepGlobal.dataTransfer.supply;
          allNodes = [
            ...stepGlobal.dataTransfer.demand,
            ...stepGlobal.dataTransfer.supply,
          ];
          break;
        case "Demand":
          relevantNodes = stepGlobal.dataTransfer.demand;
          allNodes = [
            ...stepGlobal.dataTransfer.demand,
            ...stepGlobal.dataTransfer.supply,
            ...stepGlobal.dataTransfer.transshipment,
          ];
          break;
        case "Transshipment":
          relevantNodes = stepGlobal.dataTransfer.transshipment;
          allNodes = [
            ...stepGlobal.dataTransfer.supply,
            ...stepGlobal.dataTransfer.transshipment,
          ];
          break;
      }
    } else {
      switch (type) {
        case "Supply":
          relevantNodes = stepGlobal.dataTransport.supply;
          allNodes = [
            ...stepGlobal.dataTransport.demand,
            ...stepGlobal.dataTransport.supply,
          ];
          break;
        case "Demand":
          relevantNodes = stepGlobal.dataTransport.demand;
          allNodes = [
            ...stepGlobal.dataTransport.demand,
            ...stepGlobal.dataTransport.supply,
          ];
          break;
      }
    }

    const transitionNames = new Set<string>();
    relevantNodes.forEach((node) => {
      if (node.name === currentNode) {
        node.transitions?.forEach((transition) => {
          Object.keys(transition).forEach((key) => {
            transitionNames.add(key);
          });
        });
      }
    });

    const missingNames = allNodes
      .map((node) => node.name)
      .filter((name) => !transitionNames.has(name) && currentNode !== name);

    return missingNames;
  };

export const getTotalDemandQuantity = (stepGlobal: InitialState) => () => {
  const demandNodes =
    stepGlobal.dataTransport.demand.length > 0
      ? stepGlobal.dataTransport.demand
      : stepGlobal.dataTransfer.demand;

  return demandNodes.reduce(
    (total, node) => total + (node.demand_quantity || 0),
    0
  );
};

export const getTotalSupplyQuantity = (stepGlobal: InitialState) => () => {
  const suplyNodes =
    stepGlobal.dataTransport.supply.length > 0
      ? stepGlobal.dataTransport.supply
      : stepGlobal.dataTransfer.supply;

  return suplyNodes.reduce(
    (total, node) => total + (node.supply_quantity || 0),
    0
  );
};

export const problemJSON =
  (setStepGlobal: Dispatch<SetStateAction<InitialState>>) =>
  (
    json: Transbordo | Transporte,
    method: ToT,
    demand: number,
    supply: number,
    transshipment?: number
  ) => {
    setStepGlobal((prev) => {
      if (prev) {
        if ("transshipment" in json) {
          return {
            ...prev,
            activeStep: 3,
            currentStep: 2,
            dataTransfer: json,
            dataTransport: { supply: [], demand: [] },
            step1: {
              method: method,
              demandNodes: demand,
              supplyNodes: supply,
              transshipmentNodes: transshipment,
            },
          };
        }

        return {
          ...prev,
          activeStep: 3,
          currentStep: 2,
          dataTransfer: { supply: [], demand: [], transshipment: [] },
          dataTransport: json,
          step1: {
            method: method,
            demandNodes: demand,
            supplyNodes: supply,
          },
        };
      } else {
        return prev;
      }
    });
  };

export const resetNodes =
  (setStepGlobal: Dispatch<SetStateAction<InitialState>>) => (type: ToT) => {
    setStepGlobal((prev) => {
      if (prev) {
        if (type === "Transbordo") {
          return {
            ...prev,
            dataTransfer: { supply: [], demand: [], transshipment: [] },
          };
        }

        return {
          ...prev,
          dataTransport: { supply: [], demand: [] },
        };
      } else {
        return prev;
      }
    });
  };

export const setNodeName =
  (setStepGlobal: Dispatch<SetStateAction<InitialState>>) =>
  (nodeName: string, newNodeName: string, type: ToT) => {
    setStepGlobal((prev) => {
      if (prev) {
        const getAllNamesTransfer = () => {
          const transferNodes = [
            ...prev.dataTransfer.supply,
            ...prev.dataTransfer.demand,
            ...prev.dataTransfer.transshipment,
          ];
          return transferNodes.map((node) => node.name);
        };

        const getAllNamesTransport = () => {
          const transportNodes = [
            ...prev.dataTransport.supply,
            ...prev.dataTransport.demand,
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
        }
      } else {
        return prev;
      }
    });
  };

export const setQuantity =
  (setStepGlobal: Dispatch<SetStateAction<InitialState>>) =>
  (nodeName: string, quantity: number, type: ToT) => {
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

    setStepGlobal((prev) => {
      if (prev) {
        if (type === "Transbordo") {
          const newTransfer = { ...prev.dataTransfer };

          newTransfer.supply = updateNodeQuantity(newTransfer.supply, nodeName);
          newTransfer.demand = updateNodeQuantity(newTransfer.demand, nodeName);

          return {
            ...prev,
            dataTransfer: newTransfer,
          };
        } else {
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
        }
      } else {
        return prev;
      }
    });
  };

export const setResponseTransbordo =
  (setStepGlobal: Dispatch<SetStateAction<InitialState>>) =>
  (newResponseTransbordo: DataResponseTransbordo) => {
    setStepGlobal((prev) => {
      if (prev) {
        return {
          ...prev,
          responseTransbordo: newResponseTransbordo,
          responseTransporte: {
            assignments: 0,
            objective: 0,
            problem: { supply: [], demand: [] },
            model: {
              constraints: [],
              objective: "",
              parameters: [],
              variables: [],
            },
          },
        };
      } else {
        return prev;
      }
    });
  };

export const setResponseTransporte =
  (setStepGlobal: Dispatch<SetStateAction<InitialState>>) =>
  (newResponseTransporte: DataResponseTransporte) => {
    setStepGlobal((prev) => {
      if (prev) {
        return {
          ...prev,
          responseTransporte: newResponseTransporte,
          responseTransbordo: {
            assignments: 0,
            objective: 0,
            problem: { supply: [], demand: [], transshipment: [] },
            model: {
              constraints: [],
              objective: "",
              parameters: [],
              variables: [],
            },
          },
        };
      } else {
        return prev;
      }
    });
  };

export const setNextStep =
  (setStepGlobal: Dispatch<SetStateAction<InitialState>>) =>
  (stepType: StepType, newStepData?: StepData) => {
    let stepConfig: StepConfig;

    switch (stepType) {
      case "step1":
        if (!newStepData) return;
        stepConfig = { currentStep: 1, activeStep: 2, stepData: newStepData };
        break;
      case "step2":
        stepConfig = { currentStep: 2, activeStep: 3 };
        break;
      case "step3":
        stepConfig = { currentStep: 3, activeStep: 4 };
        break;
      case "step4":
        if (!newStepData) return;
        stepConfig = { currentStep: 4, activeStep: 6, stepData: newStepData };
        break;
      default:
        return;
    }

    setStepGlobal((prev) => {
      if (prev) {
        return {
          ...prev,
          currentStep: stepConfig.currentStep,
          activeStep: stepConfig.activeStep,
          ...(stepType === "step1" && {
            step1: stepConfig.stepData as Step1,
          }),
          ...(stepType === "step4" && {
            step4: stepConfig.stepData as Step4,
          }),
        };
      } else {
        return prev;
      }
    });
  };

export const setStep =
  (setStepGlobal: Dispatch<SetStateAction<InitialState>>) =>
  (newStep: number) => {
    setStepGlobal((prev) => {
      if (prev) {
        return {
          ...prev,
          currentStep: newStep,
        };
      } else {
        return prev;
      }
    });
  };
