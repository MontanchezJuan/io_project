import { useEffect, useState } from "react";

import Graphviz from "graphviz-react";

import { ToT, useStepbyStep } from "../context/StepByStepContext";
import { DemandNode, Node, SupplyNode } from "../interface/common";

export const GraphvizComponent = () => {
  const [transiciones, setTransiciones] = useState<string>(`digraph {\n
    node [style="filled" height=2 width=2 fontsize=80];\n
    graph [center=1 rankdir=LR];\n
    nodesep=0.5;\n
    ranksep=50;\n
    }`);

  const { dataTransfer, dataTransport, step1 } = useStepbyStep();

  const TYPE: ToT = step1.method || "Transbordo";

  useEffect(() => {
    getTransiciones();
  }, []);

  const getTransiciones = () => {
    if (!dataTransfer || !dataTransport) return;

    let dot = `digraph {
    node [style="filled" height=2 width=2 fontsize=80];\n
    graph [center=1 rankdir=LR];\n
    nodesep=0.5;\n
    ranksep=50;\n
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

    if (TYPE === "Transbordo") {
      allNodes = [...dataTransfer.demand, ...dataTransfer.supply];
    } else {
      allNodes = [...dataTransport.demand, ...dataTransport.supply];
    }

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

    if (TYPE === "Transbordo") {
      allNodes = [...dataTransfer.demand];
    } else {
      allNodes = [...dataTransport.demand];
    }

    allNodes.forEach((node) => {
      node.transitions?.forEach((transition) => {
        const transitionKey = Object.keys(transition)[0];
        const transitionValue = transition[transitionKey];

        nodes += `${node.name} -> ${transitionKey} [label="${transitionValue}" fontsize=40];\n`;
      });
    });

    return nodes;
  };

  const getSupplyNodes = () => {
    let nodes: string = ``;
    let allNodes: (SupplyNode | DemandNode)[] = [];

    if (TYPE === "Transbordo") {
      allNodes = [...dataTransfer.supply];
    } else {
      allNodes = [...dataTransport.supply];
    }

    allNodes.forEach((node) => {
      node.transitions?.forEach((transition) => {
        const transitionKey = Object.keys(transition)[0];
        const transitionValue = transition[transitionKey];

        nodes += `${node.name} -> ${transitionKey} [label="${transitionValue}" fontsize=40];\n`;
      });
    });

    return nodes;
  };

  const getTransshipmentNodes = () => {
    if (dataTransfer.transshipment.length < 0) return "";

    let nodes: string = ``;
    let allNodes: Node[] = [];

    allNodes = [...dataTransfer.transshipment];

    allNodes.forEach((node) => {
      node.transitions?.forEach((transition) => {
        const transitionKey = Object.keys(transition)[0];
        const transitionValue = transition[transitionKey];

        nodes += `${node.name} -> ${transitionKey} [label="${transitionValue}" fontsize=40];\n`;
      });
    });

    return nodes;
  };

  const getRank = () => {
    let rank: string = ``;

    if (TYPE === "Transbordo") {
      rank += "{rank=min; ";
      dataTransfer.supply.forEach((node) => {
        rank += ` ${node.name};`;
      });
      rank += "}";
      rank += "{rank=same; ";
      dataTransfer.transshipment.forEach((node) => {
        rank += ` ${node.name};`;
      });
      rank += "}";
      rank += "{rank=max; ";
      dataTransfer.demand.forEach((node) => {
        rank += ` ${node.name};`;
      });
      rank += "}";
    } else {
      rank += "{rank=min; ";
      dataTransport.supply.forEach((node) => {
        rank += ` ${node.name};`;
      });
      rank += "}";
      rank += "{rank=max; ";
      dataTransport.demand.forEach((node) => {
        rank += ` ${node.name};`;
      });
      rank += "}";
    }

    return rank;
  };

  return (
    <>
      <Graphviz
        dot={transiciones}
        options={{
          fit: true,
          height: 700,
          width: 1240,
          scale: 1,
          // zoom: true,
        }}
      />
    </>
  );
};
