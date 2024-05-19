export interface Node {
  name: string;
  transitions?: { [key: string]: number }[];
}

export interface SupplyNode {
  supply_quantity: number;
  name: string;
  transitions?: { [key: string]: number }[];
}

export interface DemandNode {
  demand_quantity: number;
  name: string;
  transitions?: { [key: string]: number }[];
}
