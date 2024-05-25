from pulp import LpProblem, LpMinimize, LpVariable, lpSum, LpStatus
from models.graph import Graph


class TransportationProblem:
    @staticmethod
    def solucion_transporte(graph: Graph, assignments: int):
        final_assignments = assignments
        problema = LpProblem("PROBLEMA_DE_TRANSPORTE", LpMinimize)
        big_m = 10000000

        # Definir variables
        xij = LpVariable.dicts("X", graph.get_cij(), lowBound=0, cat="Continuous")

        # Función Objetivo
        problema += (
            lpSum(
                [
                    graph.get_cij()[(i, j)] * xij[(i, j)]
                    for i, j in graph.get_cij().keys()
                ]
            ),
            "Funcion_objetivo",
        )

        if graph.get_total_oferta() > graph.get_total_demanda():
            # Restricción oferta
            for nodo_oferta in graph.get_conjunto_i():
                problema += (
                    lpSum(
                        [xij[(nodo_oferta, j)] for j in graph.get_salidas(nodo_oferta)]
                    )
                    <= graph.get_a_oferta()[nodo_oferta],
                    f"Oferta_{nodo_oferta}",
                )

            # Restricción demanda
            for nodo_demanda in graph.get_conjunto_k():
                problema += (
                    lpSum(
                        [
                            xij[(i, nodo_demanda)]
                            for i in graph.get_entradas(nodo_demanda)
                        ]
                    )
                    == graph.get_b_demanda()[nodo_demanda],
                    f"Demanda_{nodo_demanda}",
                )

            # Asignacion
            if assignments > 0:
                yi = LpVariable.dicts(
                    "Yi", graph.get_conjunto_i(), lowBound=0, upBound=1, cat="Binary"
                )
                if assignments >= graph.get_minimo_asignaciones():
                    problema += (
                        lpSum(yi[i] for i in graph.get_conjunto_i()) == assignments
                    )
                else:
                    final_assignments = graph.get_minimo_asignaciones()
                    problema += (
                        lpSum(yi[i] for i in graph.get_conjunto_i())
                        == final_assignments
                    )
                for nodo_oferta in graph.get_conjunto_i():
                    for salida_oferta in graph.get_salidas(nodo_oferta):
                        problema += (
                            xij[(nodo_oferta, salida_oferta)] <= yi[nodo_oferta] * big_m
                        )
        elif graph.get_total_oferta() < graph.get_total_demanda():
            # Restricción oferta
            for nodo_oferta in graph.get_conjunto_i():
                problema += (
                    lpSum(
                        [xij[(nodo_oferta, j)] for j in graph.get_salidas(nodo_oferta)]
                    )
                    == graph.get_a_oferta()[nodo_oferta],
                    f"Oferta_{nodo_oferta}",
                )

            # Restricción demanda
            for nodo_demanda in graph.get_conjunto_k():
                print(graph.get_entradas(nodo_demanda))
                problema += (
                    lpSum(
                        [
                            xij[(j, nodo_demanda)]
                            for j in graph.get_entradas(nodo_demanda)
                        ]
                    )
                    <= graph.get_b_demanda()[nodo_demanda],
                    f"Demanda_{nodo_demanda}",
                )

            # Asignacion
            if assignments > 0:
                yi = LpVariable.dicts(
                    "Yi", graph.get_conjunto_j(), lowBound=0, upBound=1, cat="Binary"
                )
                if assignments >= graph.get_minimo_asignaciones():
                    problema += (
                        lpSum(yi[i] for i in graph.get_conjunto_j()) == assignments
                    )
                else:
                    final_assignments = graph.get_minimo_asignaciones()
                    problema += (
                        lpSum(yi[i] for i in graph.get_conjunto_j())
                        == final_assignments
                    )
                for nodo_demanda in graph.get_conjunto_j():
                    for entrada_demanda in graph.get_entradas(nodo_demanda):
                        problema += (
                            xij[(entrada_demanda, nodo_demanda)]
                            <= yi[nodo_demanda] * big_m
                        )
        else:
            # Restricción oferta
            for nodo_oferta in graph.get_conjunto_i():
                problema += (
                    lpSum(
                        [xij[(nodo_oferta, j)] for j in graph.get_salidas(nodo_oferta)]
                    )
                    == graph.get_a_oferta()[nodo_oferta],
                    f"Oferta_{nodo_oferta}",
                )

            # Restricción demanda
            for nodo_demanda in graph.get_conjunto_k():
                problema += (
                    lpSum(
                        [
                            xij[(j, nodo_demanda)]
                            for j in graph.get_entradas(nodo_demanda)
                        ]
                    )
                    == graph.get_b_demanda()[nodo_demanda],
                    f"Demanda_{nodo_demanda}",
                )

        # Resolver el problema
        problema.solve()

        # estructurar los datos del grafo para la respuesta
        for nodo_oferta in graph.get_conjunto_i():
            for nodo_salida in graph.get_salidas(nodo_oferta):
                for variable in problema.variables():
                    if str(xij[(nodo_oferta, nodo_salida)]) == str(variable.name):
                        if variable.varValue == 0:
                            graph.delete_transition(nodo_oferta, nodo_salida)
                        else:
                            graph.update_transition(
                                nodo_oferta, nodo_salida, variable.varValue
                            )
        graph.remove_unreachable_nodes()
        return final_assignments, problema.objective.value()
