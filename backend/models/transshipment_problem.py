from pulp import LpProblem, LpMinimize, LpVariable, lpSum, LpStatus
from graph import Graph

class TransshipmentProblem:
    def solucionTransbordo(self, graph: Graph):
        problema = LpProblem("PROBLEMA_DE_TRANSBORDO", LpMinimize)

        # Obtener conjuntos y parámetros del objeto graph
        conjunto_i = graph.get_conjunto_i()
        conjunto_j = graph.get_conjunto_j()
        conjunto_k = graph.get_conjunto_k()
        CIJ = graph.get_cij()
        CJK = graph.get_cjk()
        AOFERTA = graph.get_a_oferta()
        BDEMANDA = graph.get_b_demanda()
        Asig = 3
        BigM = 10000000

        # Definir variables
        Xij = LpVariable.dicts("Xij", (conjunto_i, conjunto_j), lowBound=0, cat='Continuous')
        Xjk = LpVariable.dicts("Xjk", (conjunto_j, conjunto_k), lowBound=0, cat='Continuous')
        Yi = LpVariable.dicts("Yi", conjunto_i, lowBound=0, upBound=1, cat='Binary')

        # Función Objetivo
        problema += (lpSum([CIJ[(i, j)] * Xij[i][j] for i in conjunto_i for j in conjunto_j])
                     + lpSum([CJK[(j, k)] * Xjk[j][k] for j in conjunto_j for k in conjunto_k])), "Funcion_objetivo"

        # Restricción oferta
        for i in conjunto_i:
            problema += lpSum([Xij[i][j] for j in conjunto_j]) <= AOFERTA[i], f"Oferta_{i}"

        # Restricción demanda
        for k in conjunto_k:
            problema += lpSum([Xjk[j][k] for j in conjunto_j]) == BDEMANDA[k], f"Demanda_{k}"

        # Restricción transbordo
        for j in conjunto_j:
            problema += lpSum([Xij[i][j] for i in conjunto_i]) == lpSum([Xjk[j][k] for k in conjunto_k]), f"balance_{j}"

        # Restricción asignación
        problema += lpSum([Yi[i] for i in conjunto_i]) == Asig, "eqAsi"

        # Restricción BIGM
        for i in conjunto_i:
            for j in conjunto_j:
                problema += Xij[i][j] <= BigM * Yi[i], f"eqBigM_{i}_{j}"

        # Resolver el problema
        problema.solve()
        print(f"Estado del problema: {LpStatus[problema.status]}")

        # Imprimir resultados
        for var in problema.variables():
            print(f"{var.name} = {var.varValue}")

        print(f"Valor objetivo: {problema.objective.value()}")