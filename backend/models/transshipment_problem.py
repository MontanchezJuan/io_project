from pulp import LpProblem, LpMinimize, LpVariable, lpSum, LpStatus, LpAffineExpression
from models.graph import Graph

class TransshipmentProblem:
    @staticmethod
    def solucion_transbordo(graph: Graph):
        problema = LpProblem("PROBLEMA_DE_TRANSBORDO", LpMinimize)
        big_m = 10000000

        # Definir variables
        xii = LpVariable.dicts("X", graph.get_cii(), lowBound=0, cat='Continuous')
        xij = LpVariable.dicts("X", graph.get_cij(), lowBound=0, cat='Continuous')
        xik = LpVariable.dicts("X", graph.get_cik(), lowBound=0, cat='Continuous')
        xji = LpVariable.dicts("X", graph.get_cji(), lowBound=0, cat='Continuous')
        xjj = LpVariable.dicts("X", graph.get_cjj(), lowBound=0, cat='Continuous')
        xjk = LpVariable.dicts("X", graph.get_cjk(), lowBound=0, cat='Continuous')
        xki = LpVariable.dicts("X", graph.get_cki(), lowBound=0, cat='Continuous')
        xkj = LpVariable.dicts("X", graph.get_ckj(), lowBound=0, cat='Continuous')
        xkk = LpVariable.dicts("X", graph.get_ckk(), lowBound=0, cat='Continuous')
        # yi = LpVariable.dicts("Yi", conjunto_i, lowBound=0, upBound=1, cat='Binary')
        
        # Función Objetivo
        problema += (  lpSum([graph.get_cii()[(i, j)] * xii[(i,j)] for i,j in graph.get_cii().keys()])
                     + lpSum([graph.get_cij()[(i, j)] * xij[(i,j)] for i,j in graph.get_cij().keys()])
                     + lpSum([graph.get_cik()[(i, k)] * xik[(i,k)] for i,k in graph.get_cik().keys()])
                     + lpSum([graph.get_cji()[(j, i)] * xji[(j,i)] for j,i in graph.get_cji().keys()])
                     + lpSum([graph.get_cjj()[(j, k)] * xjj[(j,k)] for j,k in graph.get_cjj().keys()])
                     + lpSum([graph.get_cjk()[(j, k)] * xjk[(j,k)] for j,k in graph.get_cjk().keys()])
                     + lpSum([graph.get_cki()[(k, i)] * xki[(k,i)] for k,i in graph.get_cki().keys()])
                     + lpSum([graph.get_ckj()[(k, j)] * xkj[(k,j)] for k,j in graph.get_ckj().keys()])
                     + lpSum([graph.get_ckk()[(j, k)] * xkk[(j,k)] for j,k in graph.get_ckk().keys()])), "Funcion_objetivo"
        
        # Restricciones
        if graph.get_total_oferta() > graph.get_total_demanda():
            print(graph.get_total_oferta() > graph.get_total_demanda())
            # oferta
            for nodo_oferta in graph.get_conjunto_i():
                xi_ = xii | xij | xik
                x_i = xii | xji | xki
                problema += lpSum([xi_[(nodo_oferta,j)] for j in graph.get_salidas(nodo_oferta)]) <= graph.get_a_oferta()[nodo_oferta] + lpSum([x_i[(j,nodo_oferta)] for j in graph.get_entradas(nodo_oferta)])
            
            # demanda
            for nodo_demanda in graph.get_conjunto_k():
                xk_ = xki | xkj | xkk
                x_k = xik | xjk | xkk
                problema += lpSum([x_k[(j,nodo_demanda)] for j in graph.get_entradas(nodo_demanda)]) == graph.get_b_demanda()[nodo_demanda] + lpSum([xk_[(nodo_demanda,j)] for j in graph.get_salidas(nodo_demanda)])             
        elif graph.get_total_oferta() < graph.get_total_demanda():
            # oferta
            for nodo_oferta in graph.get_conjunto_i():
                xi_ = xii | xij | xik
                x_i = xii | xji | xki
                problema += lpSum([xi_[(nodo_oferta,j)] for j in graph.get_salidas(nodo_oferta)]) == graph.get_a_oferta()[nodo_oferta] + lpSum([x_i[(j,nodo_oferta)] for j in graph.get_entradas(nodo_oferta)])
            
            # demanda
            for nodo_demanda in graph.get_conjunto_k():
                xk_ = xki | xkj | xkk
                x_k = xik | xjk | xkk
                problema += lpSum([x_k[(j,nodo_demanda)] for j in graph.get_entradas(nodo_demanda)]) <= graph.get_b_demanda()[nodo_demanda] + lpSum([xk_[(nodo_demanda,j)] for j in graph.get_salidas(nodo_demanda)])
        else:
            # oferta
            for nodo_oferta in graph.get_conjunto_i():
                xi_ = xii | xij | xik
                x_i = xii | xji | xki
                problema += lpSum([xi_[(nodo_oferta,j)] for j in graph.get_salidas(nodo_oferta)]) == graph.get_a_oferta()[nodo_oferta] + lpSum([x_i[(j,nodo_oferta)] for j in graph.get_entradas(nodo_oferta)])
            
            # demanda
            for nodo_demanda in graph.get_conjunto_k():
                xk_ = xki | xkj | xkk
                x_k = xik | xjk | xkk
                problema += lpSum([x_k[(j,nodo_demanda)] for j in graph.get_entradas(nodo_demanda)]) == graph.get_b_demanda()[nodo_demanda] + lpSum([xk_[(nodo_demanda,j)] for j in graph.get_salidas(nodo_demanda)])
                
        # transbordo
        
        for nodo_transbordo in graph.get_conjunto_j():
            xj_ = xji | xjj | xjk
            x_j = xij | xjj | xkj
            problema += lpSum([x_j[(j,nodo_transbordo)] for j in graph.get_entradas(nodo_transbordo)]) == lpSum([xj_[(nodo_transbordo,j)] for j in graph.get_salidas(nodo_transbordo)])   
        
        
        
        print(problema)
        problema.solve()
        print(f"Estado del problema: {LpStatus[problema.status]}")

        # Imprimir resultados
        for var in problema.variables():
            print(f"{var.name} = {var.varValue}")

        print(f"Valor objetivo: {problema.objective.value()}")
        
        # # Restricción oferta
        # for i in graph.get_conjunto_i():
        #     problema += lpSum([xij[i][j] for j in conjunto_j]) <= AOFERTA[i], f"Oferta_{i}"

        # # Restricción demanda
        # for k in conjunto_k:
        #     problema += lpSum([xjk[j][k] for j in conjunto_j]) == BDEMANDA[k], f"Demanda_{k}"

        # # Restricción transbordo
        # for j in conjunto_j:
        #     problema += lpSum([xij[i][j] for i in conjunto_i]) == lpSum([xjk[j][k] for k in conjunto_k]), f"balance_{j}"

        # # Restricción asignación
        # problema += lpSum([yi[i] for i in conjunto_i]) == asig, "eqAsi"

        # # Restricción BIGM
        # for i in conjunto_i:
        #     for j in conjunto_j:
        #         problema += xij[i][j] <= big_m * yi[i], f"eqBigM_{i}_{j}"

        # # Resolver el problema
        # problema.solve()
        # print(f"Estado del problema: {LpStatus[problema.status]}")

        # # Imprimir resultados
        # for var in problema.variables():
        #     print(f"{var.name} = {var.varValue}")

        # print(f"Valor objetivo: {problema.objective.value()}")