from pulp import LpProblem, LpMinimize, LpVariable, lpSum, LpStatus
from graph import Graph

class TransportationProblem:
    def solucionTransporte(self, graph: Graph):
        problema = pulp.LpProblem("PROBLEMA_DE_TRANSPORTE", pulp.LpMinimize)

        # Obtener conjuntos y parámetros del objeto graph
        conjunto_i = graph.get_conjunto_i()
        conjunto_j = graph.get_conjunto_j()
        CIJ = graph.get_cij()
        AOFERTA = graph.get_a_oferta()
        BDEMANDA = graph.get_b_demanda()

        # Definir variables
        Xij = pulp.LpVariable.dicts("Xij", (conjunto_i, conjunto_j), lowBound=0, cat='Continuous')

        # Función Objetivo
        problema += pulp.lpSum([CIJ[(i, j)] * Xij[i][j] for i in conjunto_i for j in conjunto_j]), "Funcion_objetivo"

        # Restricción oferta
        for i in conjunto_i:
            problema += pulp.lpSum([Xij[i][j] for j in conjunto_j]) == AOFERTA[i], f"Oferta_{i}"

        # Restricción demanda
        for j in conjunto_j:
            problema += pulp.lpSum([Xij[i][j] for i in conjunto_i]) == BDEMANDA[j], f"Demanda_{j}"

        # Resolver el problema
        problema.solve()

        # Imprimir el valor de la función objetivo y variables
        valor_objetivo = pulp.value(problema.objective)
        print(f"Valor de la función objetivo: {valor_objetivo}")

        for i in conjunto_i:
            for j in conjunto_j:
                print(f"Xij[{i}][{j}] = {Xij[i][j].value()}")
