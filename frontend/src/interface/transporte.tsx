import { DemandNode, SupplyNode } from "./common";

export interface Transporte {
  supply: SupplyNode[];
  demand: DemandNode[];
}
