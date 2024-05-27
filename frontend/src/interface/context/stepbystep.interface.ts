import { Step4 } from "../../components/stepbystep/StepFour";
import { Step1 } from "../../components/stepbystep/StepOne";
import { DataResponseTransbordo, Transbordo } from "../transbordo";
import { DataResponseTransporte, Transporte } from "../transporte";

export type NodeType = "O" | "D" | "T";
export type ToT = "Transporte" | "Transbordo";
export type DST = "Supply" | "Demand" | "Transshipment";
export type StepType = "step1" | "step2" | "step3" | "step4";
export type StepData = Step1 | Step4;
export interface StepConfig {
  currentStep: number;
  activeStep: number;
  stepData?: StepData;
}
export interface InitialState {
  activeStep: number;
  currentStep: number;
  dataTransfer: Transbordo;
  dataTransport: Transporte;
  responseTransbordo: DataResponseTransbordo;
  responseTransporte: DataResponseTransporte;
  step1: Step1;
  step4: Step4;
}

export interface StepByStepContextType {
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
  deleteTransition: (nodeName: string, transitionIndex: number) => void;
  getMissingValues: (type: DST, method: ToT, currentNode: string) => string[];
  getTotalDemandQuantity: () => number;
  getTotalSupplyQuantity: () => number;
  problemJSON: (
    json: Transporte | Transbordo,
    method: ToT,
    demand: number,
    supply: number,
    transshipment?: number
  ) => void;
  resetNodes: (type: ToT) => void;
  responseTransbordo: DataResponseTransbordo;
  responseTransporte: DataResponseTransporte;
  setNodeName: (nodeName: string, newNodeName: string, type: ToT) => void;
  setQuantity: (nodeName: string, quantity: number, type: ToT) => void;
  setResponseTransbordo: (
    newResponseTransbordo: DataResponseTransbordo
  ) => void;
  setResponseTransporte: (
    newResponseTransporte: DataResponseTransporte
  ) => void;
  setNextStep: (stepType: StepType, newStepData?: StepData) => void;
  setStep: (newStep: number) => void;
  step1: Step1;
  step4: Step4;
}
