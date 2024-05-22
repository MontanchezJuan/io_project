from pulp import LpProblem, LpMinimize, LpVariable, lpSum, LpStatus
from models.graph import Graph

class TransportationProblem:
    @staticmethod
    def solucion_transporte(graph: Graph):
        problema = LpProblem("PROBLEMA_DE_TRANSPORTE", LpMinimize)

        # Obtener conjuntos y parámetros del objeto graph
        conjunto_i = graph.get_conjunto_i()
        conjunto_j = graph.get_conjunto_j()
        CIJ = graph.get_cij()
        AOFERTA = graph.get_a_oferta()
        BDEMANDA = graph.get_b_demanda()
        total_oferta = graph.get_total_oferta()
        total_demanda = graph.get_total_demanda()

        # Definir variables
        Xij = LpVariable.dicts("Xij", (conjunto_i, conjunto_j), lowBound=0, cat='Continuous')

        # Función Objetivo
        problema += lpSum([CIJ[(i, j)] * Xij[i][j] for i in conjunto_i for j in conjunto_j]), "Funcion_objetivo"

        print("Función objetivo:")
        print(problema.objective)
        if total_oferta > total_demanda:
            # Restricción oferta
            for i in conjunto_i:
                problema += lpSum([Xij[i][j] for j in conjunto_j]) <= AOFERTA[i], f"Oferta_{i}"

            # Restricción demanda
            for j in conjunto_j:
                problema += lpSum([Xij[i][j] for i in conjunto_i]) == BDEMANDA[j], f"Demanda_{j}"
        elif total_oferta < total_demanda:
            # Restricción oferta
            for i in conjunto_i:
                problema += lpSum([Xij[i][j] for j in conjunto_j]) == AOFERTA[i], f"Oferta_{i}"

            # Restricción demanda
            for j in conjunto_j:
                problema += lpSum([Xij[i][j] for i in conjunto_i]) <= BDEMANDA[j], f"Demanda_{j}"
        else:
            # Restricción oferta
            for i in conjunto_i:
                problema += lpSum([Xij[i][j] for j in conjunto_j]) == AOFERTA[i], f"Oferta_{i}"

            # Restricción demanda
            for j in conjunto_j:
                problema += lpSum([Xij[i][j] for i in conjunto_i]) == BDEMANDA[j], f"Demanda_{j}"
            
        # Resolver el problema
        problema.solve()

        # Imprimir el valor de la función objetivo y variables
        valor_objetivo = problema.objective.value()
        print(f"Valor de la función objetivo: {valor_objetivo}")

        for i in conjunto_i:
            for j in conjunto_j:
                print(f"Xij[{i}][{j}] = {Xij[i][j].value()}")
