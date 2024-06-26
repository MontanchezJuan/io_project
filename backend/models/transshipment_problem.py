from pulp import LpProblem, LpMinimize, LpVariable, lpSum
from models.graph import Graph
import re


class TransshipmentProblem:
    @staticmethod
    def solucion_transbordo(graph: Graph, assignments: int):
        final_assignments = assignments
        problema = LpProblem("PROBLEMA_DE_TRANSBORDO", LpMinimize)
        big_m = 10000000

        # Definir variables
        xii = LpVariable.dicts("X", graph.get_cii(), lowBound=0, cat="Continuous")
        xij = LpVariable.dicts("X", graph.get_cij(), lowBound=0, cat="Continuous")
        xik = LpVariable.dicts("X", graph.get_cik(), lowBound=0, cat="Continuous")
        xji = LpVariable.dicts("X", graph.get_cji(), lowBound=0, cat="Continuous")
        xjj = LpVariable.dicts("X", graph.get_cjj(), lowBound=0, cat="Continuous")
        xjk = LpVariable.dicts("X", graph.get_cjk(), lowBound=0, cat="Continuous")
        xki = LpVariable.dicts("X", graph.get_cki(), lowBound=0, cat="Continuous")
        xkj = LpVariable.dicts("X", graph.get_ckj(), lowBound=0, cat="Continuous")
        xkk = LpVariable.dicts("X", graph.get_ckk(), lowBound=0, cat="Continuous")

        # Función Objetivo
        problema += (
            lpSum(
                [
                    graph.get_cii()[(i, j)] * xii[(i, j)]
                    for i, j in graph.get_cii().keys()
                ]
            )
            + lpSum(
                [
                    graph.get_cij()[(i, j)] * xij[(i, j)]
                    for i, j in graph.get_cij().keys()
                ]
            )
            + lpSum(
                [
                    graph.get_cik()[(i, k)] * xik[(i, k)]
                    for i, k in graph.get_cik().keys()
                ]
            )
            + lpSum(
                [
                    graph.get_cji()[(j, i)] * xji[(j, i)]
                    for j, i in graph.get_cji().keys()
                ]
            )
            + lpSum(
                [
                    graph.get_cjj()[(j, k)] * xjj[(j, k)]
                    for j, k in graph.get_cjj().keys()
                ]
            )
            + lpSum(
                [
                    graph.get_cjk()[(j, k)] * xjk[(j, k)]
                    for j, k in graph.get_cjk().keys()
                ]
            )
            + lpSum(
                [
                    graph.get_cki()[(k, i)] * xki[(k, i)]
                    for k, i in graph.get_cki().keys()
                ]
            )
            + lpSum(
                [
                    graph.get_ckj()[(k, j)] * xkj[(k, j)]
                    for k, j in graph.get_ckj().keys()
                ]
            )
            + lpSum(
                [
                    graph.get_ckk()[(j, k)] * xkk[(j, k)]
                    for j, k in graph.get_ckk().keys()
                ]
            )
        ), "Funcion_objetivo"

        # Restricciones
        if graph.get_total_oferta() > graph.get_total_demanda():
            # oferta
            for nodo_oferta in graph.get_conjunto_i():
                xi_ = xii | xij | xik
                x_i = xii | xji | xki
                problema += lpSum(
                    [xi_[(nodo_oferta, j)] for j in graph.get_salidas(nodo_oferta)]
                ) <= graph.get_a_oferta()[nodo_oferta] + lpSum(
                    [x_i[(j, nodo_oferta)] for j in graph.get_entradas(nodo_oferta)]
                )

            # demanda
            for nodo_demanda in graph.get_conjunto_k():
                xk_ = xki | xkj | xkk
                x_k = xik | xjk | xkk
                problema += lpSum(
                    [x_k[(j, nodo_demanda)] for j in graph.get_entradas(nodo_demanda)]
                ) == graph.get_b_demanda()[nodo_demanda] + lpSum(
                    [xk_[(nodo_demanda, j)] for j in graph.get_salidas(nodo_demanda)]
                )

            # Asignacion
            if assignments > 0:
                yi = LpVariable.dicts(
                    "Y", graph.get_conjunto_i(), lowBound=0, upBound=1, cat="Binary"
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
                xi_ = xii | xij | xik
                x_i = xii | xji | xki
                for nodo_oferta in graph.get_conjunto_i():
                    for salida_oferta in graph.get_salidas(nodo_oferta):
                        problema += (
                            xi_[(nodo_oferta, salida_oferta)] <= yi[nodo_oferta] * big_m
                        )
                    for entrada_oferta in graph.get_entradas(nodo_oferta):
                        problema += (
                            x_i[(entrada_oferta, nodo_oferta)]
                            <= yi[nodo_oferta] * big_m
                        )
            #! poner las restricciones de rango >=0
        elif graph.get_total_oferta() < graph.get_total_demanda():
            # oferta
            for nodo_oferta in graph.get_conjunto_i():
                xi_ = xii | xij | xik
                x_i = xii | xji | xki
                problema += lpSum(
                    [xi_[(nodo_oferta, j)] for j in graph.get_salidas(nodo_oferta)]
                ) == graph.get_a_oferta()[nodo_oferta] + lpSum(
                    [x_i[(j, nodo_oferta)] for j in graph.get_entradas(nodo_oferta)]
                )
            # demanda
            for nodo_demanda in graph.get_conjunto_k():
                xk_ = xki | xkj | xkk
                x_k = xik | xjk | xkk
                problema += lpSum(
                    [x_k[(j, nodo_demanda)] for j in graph.get_entradas(nodo_demanda)]
                ) <= graph.get_b_demanda()[nodo_demanda] + lpSum(
                    [xk_[(nodo_demanda, j)] for j in graph.get_salidas(nodo_demanda)]
                )

            # Asignacion
            if assignments > 0:
                yk = LpVariable.dicts(
                    "Y", graph.get_conjunto_k(), lowBound=0, upBound=1, cat="Binary"
                )
                if assignments >= graph.get_minimo_asignaciones():
                    problema += (
                        lpSum(yk[k] for k in graph.get_conjunto_k()) == assignments
                    )
                else:
                    final_assignments = graph.get_minimo_asignaciones()
                    problema += (
                        lpSum(yk[k] for k in graph.get_conjunto_k())
                        == final_assignments
                    )
                xk_ = xki | xkj | xkk
                x_k = xik | xjk | xkk
                for nodo_demanda in graph.get_conjunto_k():
                    for salida_demanda in graph.get_salidas(nodo_demanda):
                        problema += (
                            xk_[(nodo_demanda, salida_demanda)]
                            <= yk[nodo_demanda] * big_m
                        )
                    for entrada_demanda in graph.get_entradas(nodo_demanda):
                        problema += (
                            x_k[(nodo_demanda, entrada_demanda)]
                            <= yk[nodo_demanda] * big_m
                        )
        else:
            # oferta
            for nodo_oferta in graph.get_conjunto_i():
                xi_ = xii | xij | xik
                x_i = xii | xji | xki
                problema += lpSum(
                    [xi_[(nodo_oferta, j)] for j in graph.get_salidas(nodo_oferta)]
                ) == graph.get_a_oferta()[nodo_oferta] + lpSum(
                    [x_i[(j, nodo_oferta)] for j in graph.get_entradas(nodo_oferta)]
                )

            # demanda
            for nodo_demanda in graph.get_conjunto_k():
                xk_ = xki | xkj | xkk
                x_k = xik | xjk | xkk
                problema += lpSum(
                    [x_k[(j, nodo_demanda)] for j in graph.get_entradas(nodo_demanda)]
                ) == graph.get_b_demanda()[nodo_demanda] + lpSum(
                    [xk_[(nodo_demanda, j)] for j in graph.get_salidas(nodo_demanda)]
                )

        # transbordo
        for nodo_transbordo in graph.get_conjunto_j():
            xj_ = xji | xjj | xjk
            x_j = xij | xjj | xkj
            problema += lpSum(
                [x_j[(j, nodo_transbordo)] for j in graph.get_entradas(nodo_transbordo)]
            ) == lpSum(
                [xj_[(nodo_transbordo, j)] for j in graph.get_salidas(nodo_transbordo)]
            )

        problema.solve()

        # estructurar los datos del grafo para la respuesta
        for nodo_oferta in graph.get_conjunto_i():
            xi_ = xii | xij | xik
            for nodo_salida in graph.get_salidas(nodo_oferta):
                for variable in problema.variables():
                    if str(xi_[(nodo_oferta, nodo_salida)]) == str(variable.name):
                        if variable.varValue == 0:
                            graph.delete_transition(nodo_oferta, nodo_salida)
                        else:
                            graph.update_transition(
                                nodo_oferta, nodo_salida, variable.varValue
                            )

        for nodo_demanda in graph.get_conjunto_k():
            xk_ = xki | xkj | xkk
            for nodo_salida in graph.get_salidas(nodo_demanda):
                for variable in problema.variables():
                    if str(xk_[(nodo_demanda, nodo_salida)]) == str(variable.name):
                        if variable.varValue == 0:
                            graph.delete_transition(nodo_demanda, nodo_salida)
                        else:
                            graph.update_transition(
                                nodo_demanda, nodo_salida, variable.varValue
                            )

        for nodo_transbordo in graph.get_conjunto_j():
            xj_ = xji | xjj | xjk
            for nodo_salida in graph.get_salidas(nodo_transbordo):
                for variable in problema.variables():
                    if str(xj_[(nodo_transbordo, nodo_salida)]) == str(variable.name):
                        if variable.varValue == 0:
                            graph.delete_transition(nodo_transbordo, nodo_salida)
                        else:
                            graph.update_transition(
                                nodo_transbordo, nodo_salida, variable.varValue
                            )

        # Función para obtener la representación de la función objetivo
        def get_objective(problem):
            return formatear_ecuaciones([str(problem.objective)])[0]

        # Función para obtener la representación de las restricciones
        def get_constraints(problem):
            constraints = []
            for name, constraint in problem.constraints.items():
                constraints.append(f"{constraint}")
            return formatear_ecuaciones(constraints)

        # Función para obtener la representación de las variables
        def get_variables(problem):
            variables = []
            for variable in problem.variables():
                variables.append(f"{variable.name} = {variable.varValue}")
            return formatear_ecuaciones(variables)

        # Función para obtener los parámetros
        def get_parameters(problem):
            parameters: list[str] = []
            # En este ejemplo, simplemente agregamos los coeficientes de las variables en la función objetivo
            for variable in problem.variables():
                if problem.objective.get(variable) is not None:
                    parameters.append(
                        f"{variable.name}: {problem.objective.get(variable)}"
                    )
                else:
                    parameters.append(f"{variable.name}: 0")
                parameters[-1] = re.sub(r"^[XY]", "C", parameters[-1])
            return formatear_ecuaciones(parameters)

        def formatear_ecuaciones(lista_ecuaciones):
            ecuaciones_formateadas = []
            for ecuacion in lista_ecuaciones:
                # Eliminar caracteres especiales y guiones bajos
                ecuacion_formateada = re.sub(r"[_()',]", "", ecuacion)
                ecuaciones_formateadas.append(ecuacion_formateada)
            return ecuaciones_formateadas

        # Crear el diccionario con los datos del problema
        problem_dict = {
            "objective": get_objective(problema),
            "constraints": get_constraints(problema),
            "variables": get_variables(problema),
            "parameters": get_parameters(problema),
        }

        graph.remove_unreachable_nodes()
        return final_assignments, problema.objective.value(), problem_dict
