import { DemandNode, Node, SupplyNode } from "./common";

export interface Transbordo {
  supply: SupplyNode[];
  demand: DemandNode[];
  transshipment: Node[];
}
