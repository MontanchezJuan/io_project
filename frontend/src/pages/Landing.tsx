import Graphviz from "graphviz-react";

import { StepbyStep } from "../components/stepbystep/StepbyStep";

export const Landing = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <p>Para solucionar el problema primero llene una lista de pasos</p>

      <StepbyStep />

      <div className="flex justify-center w-full p-8">
        {/* <Graphviz
          dot={`
    digraph {
      // Common attributes
      node [style="filled" height=2 width=2 fontsize=80];
      graph [center=1 rankdir=LR];
      nodesep=0.5; // Adjust the node separation for clarity
      ranksep=50;

      // Nodes with xlabel
      a [xlabel="30"];
      b [xlabel="30"];
      c [xlabel="30"];
      d [xlabel="30"];
      e; g; h; f; k; n; v; q; w; r; t; z; x; y; u; i; o;

      // Offert nodes
      {a; b; c; d; e; g; h} -> f [label="100" fontsize=40];
      {a; b; c; d; e; g; h} -> k [label="200" fontsize=40];
      {a; b; c; d; e; g; h} -> n [label="400" fontsize=40];
      {a; b; c; d; e; g; h} -> v [label="300" fontsize=40];

      // Transport nodes
      f -> {q; w; r; t; z; x; y; u; i; o} [label="100" fontsize=40];
      k -> {q; w; r; t; z; x; y; u; i; o} [label="200" fontsize=40];
      v -> {q; w; r; t; z; x; y; u; i; o} [label="300" fontsize=40];
      n -> {q; w; r; t; z; x; y; u; i; o} [label="400" fontsize=40];

      // Rank settings
      {rank=same; a; b; c; d; e; g; h;}
      {rank=same; f; k; n; v;}
      {rank=same; q; w; r; t; z; x; y; u; i; o;}
    }
  `}
          options={{
            fit: true,
            height: 600,
            width: 1240,
            scale: 1,
            // zoom: true,
          }}
        /> */}
      </div>
    </div>
  );
};
