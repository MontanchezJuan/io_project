import { useEffect, useState } from "react";

import Graphviz from "graphviz-react";

import { DemandNode, Node, SupplyNode } from "../interface/common";
import { Transbordo } from "../interface/transbordo";
import { Transporte } from "../interface/transporte";

interface Props {
  data: Transbordo | Transporte;
}

export const GraphvizComponent = ({ data }: Props) => {
  const [transiciones, setTransiciones] = useState<string>(`digraph {\n
    node [style="filled" height=2 width=2 fontsize=100];\n
    graph [center=1 rankdir=LR];\n
    nodesep=2.5;\n
    ranksep=40;\n
    }`);

  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    getTransiciones();
    setWidth((window.innerWidth * 3) / 4);
    setHeight((window.innerHeight * 3) / 4);
  }, [data]);

  const getTransiciones = () => {
    let dot = `digraph {
    node [style="filled" height=2 width=2 fontsize=100];\n
    graph [center=1 rankdir=LR];\n
    nodesep=2.5;\n
    ranksep=40;\n
    ${getQuantity()}
    ${getSupplyNodes()}
    ${getTransshipmentNodes()}
    ${getDemandNodes()}
    ${getRank()}
    `;

    dot += "\n}";

    setTransiciones(dot);
  };

  const getQuantity = () => {
    let quantity = ``;
    let allNodes: (SupplyNode | DemandNode)[] = [];

    allNodes = [...data.demand, ...data.supply];

    allNodes.forEach((node) => {
      if ("supply_quantity" in node) {
        quantity += `${node.name} [xlabel="${node.supply_quantity}"];\n`;
      } else if ("demand_quantity" in node) {
        quantity += `${node.name} [xlabel="${node.demand_quantity}"];\n`;
      }
    });

    return quantity;
  };

  const getDemandNodes = () => {
    let nodes: string = ``;
    let allNodes: (SupplyNode | DemandNode)[] = [];

    allNodes = [...data.demand];

    allNodes.forEach((node) => {
      node.transitions?.forEach((transition) => {
        const transitionKey = Object.keys(transition)[0];
        const transitionValue = transition[transitionKey];

        nodes += `${node.name} -> ${transitionKey} [label="${transitionValue}" fontsize=60];\n`;
      });
    });

    return nodes;
  };

  const getSupplyNodes = () => {
    let nodes: string = ``;
    let allNodes: (SupplyNode | DemandNode)[] = [];

    allNodes = [...data.supply];

    allNodes.forEach((node) => {
      node.transitions?.forEach((transition) => {
        const transitionKey = Object.keys(transition)[0];
        const transitionValue = transition[transitionKey];

        nodes += `${node.name} -> ${transitionKey} [label="${transitionValue}" fontsize=60];\n`;
      });
    });

    return nodes;
  };

  const getTransshipmentNodes = () => {
    if ("transshipment" in data) {
      let nodes: string = ``;
      let allNodes: Node[] = [];

      allNodes = [...data.transshipment];

      allNodes.forEach((node) => {
        node.transitions?.forEach((transition) => {
          const transitionKey = Object.keys(transition)[0];
          const transitionValue = transition[transitionKey];

          nodes += `${node.name} -> ${transitionKey} [label="${transitionValue}" fontsize=60];\n`;
        });
      });

      return nodes;
    }
    return "";
  };

  const getRank = () => {
    let rank: string = ``;

    rank += "{rank=min; ";
    data.supply.forEach((node) => {
      rank += ` ${node.name};`;
    });
    rank += "}";
    if ("transshipment" in data) {
      rank += "{rank=same; ";
      data.transshipment.forEach((node) => {
        rank += ` ${node.name};`;
      });
      rank += "}";
    }
    rank += "{rank=max; ";
    data.demand.forEach((node) => {
      rank += ` ${node.name};`;
    });
    rank += "}";

    return rank;
  };

  return (
    <>
      <Graphviz
        dot={transiciones}
        options={{
          fit: true,
          height: height,
          width: width,
          scale: 1,
        }}
      />
    </>
  );
};
