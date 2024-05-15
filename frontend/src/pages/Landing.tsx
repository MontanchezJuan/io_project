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
            node [style="filled" height=0.25];
            graph [center=1 rankdir=LR];
            nodesep=1
            {a, b, c, d, e, g, h} -> f [label="1"];
            {a, b, c, d, e, g, h} -> k [label="1"];
            {a, b, c, d, e, g, h} -> v [label="1"];
            {a, b, c, d, e, g, h} -> n [label="1"];
            v -> {q, w, r, t, z, x, y, u, i, o} [label="1"];
            n -> {q, w, r, t, z, x, y, u, i, o} [label="1"];
            f -> {q, w, r, t, z, x, y, u, i, o} [label="1"];
            k -> {q, w, r, t, z, x, y, u, i, o} [label="1"];
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
