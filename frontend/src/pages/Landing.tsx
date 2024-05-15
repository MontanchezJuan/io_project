import { useState } from "react";

import {
  Button,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Tag,
} from "@chakra-ui/react";
import Graphviz from "graphviz-react";

export const Landing = () => {
  const [method, setMethod] = useState<string>("");

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="flex flex-col gap-4">
        <FormLabel>
          Método:{" "}
          {method && method === "Transporte" ? (
            <span className="text-secondary">{method}</span>
          ) : (
            <span className="text-primary">{method}</span>
          )}
        </FormLabel>
        <Select
          onChange={(e) => setMethod(e.target.value)}
          placeholder="Seleccione un método"
        >
          <option value="Transporte">Transporte</option>
          <option value="Transbordo">Transbordo</option>
        </Select>
      </div>

      <div className="flex justify-center w-full">
        {method && method === "Transporte" ? (
          <div className="w-1/2 h-full rounded-2xl bg-primary/[.8] text-white p-8">
            <div className="flex flex-col justify-center items-center gap-4">
              <FormLabel>Número de nodos de oferta</FormLabel>
              <NumberInput defaultValue={1} min={1}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>Número de nodos de demanda</FormLabel>
              <NumberInput defaultValue={1} min={1}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <Button colorScheme="whiteAlpha">Continuar</Button>
            </div>
          </div>
        ) : method === "Transbordo" ? (
          <div className="w-1/2 h-full rounded-2xl bg-primary/[.8] text-white p-8">
            <div className="flex flex-col justify-center items-center gap-4">
              <FormLabel>Número de nodos de oferta</FormLabel>
              <NumberInput defaultValue={1} min={1}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>Número de nodos de demanda</FormLabel>
              <NumberInput defaultValue={1} min={1}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <FormLabel>Número de nodos de transbordo</FormLabel>
              <NumberInput defaultValue={1} min={1}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <Button colorScheme="whiteAlpha">Continuar</Button>
            </div>
          </div>
        ) : (
          <Tag colorScheme="red">Seleccione un metodo hpta!!!</Tag>
        )}
      </div>

      <div className="flex justify-center w-full p-8 ">
        <Graphviz
          dot={`
          digraph {
            size="20,10"; // Ajusta el tamaño del grafo (ancho, alto)
            splines=polylines; // Líneas rectas
            rankdir=LR; // Orientación de izquierda a derecha
            node [shape=circle, width=20, fontsize=100]; // Nodos con forma de registro
            nodesep=2; // Espacio entre nodos
            ranksep=9; // Espacio entre filas
            ratio=auto; // Relación de aspecto
            

            //ofertas
            a [label="a"];
            b [label="b"];
            c [label="c"];
            d [label="d"];
            e [label="e"];
            g [label="g"];
            h [label="h"];

            //transbordos
            f [label="f"];
            k [label="k"];
            v [label="v"];
            n [label="n"];

            //demandas
            q [label="q", xlabel="30", xlp=rjust];
            w [label="w"];
            r [label="r"];
            t [label="t"];
            z [label="z"];
            x [label="x"];
            y [label="y"];
            u [label="u"];
            i [label="i"];
            o [label="o"];

            // Conexiones
            // oferta -> transbordo
            { a, b, c, d, e, g, h } -> f [xlabel="1"][penwidth=2];
            { a, b, c, d, e, g, h } -> k [taillabel="1"][penwidth=2];
            { a, b, c, d, e, g, h } -> v [taillabel="1"][penwidth=2];
            { a, b, c, d, e, g, h } -> n [taillabel="1"][penwidth=2];

            // transbordo -> demanda
            v -> {q, w, r, t, z, x, y, u, i, o} [headlabel="1"][penwidth=2];
            n -> {q, w, r, t, z, x, y, u, i, o} [headlabel="1"][penwidth=2];
            f -> {q, w, r, t, z, x, y, u, i, o} [headlabel="1"][penwidth=2];
            k -> {q, w, r, t, z, x, y, u, i, o} [headlabel="1"][penwidth=2];
            rank=same { a, b, c, d, e, g, h }
            rank=same { f, k, v, n }
            rank=same { q, w, r, t, z, x, y, u, i, o }
          }
        `}
        />
      </div>
    </div>
  );
};
