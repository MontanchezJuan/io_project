import json

class Graph:
    def __init__(self, supply: list[dict] = [], demand:list[dict] = [] , transshipment: list[dict] = []) -> None:
        self.supply : list[SupplyNode] = []
        self.demand : list[DemandNode] = []
        self.transshipment : list[Node] = []
        self.transitions : list[Transition] = []
        self.estructure(supply,demand,transshipment)
        
    def estructure(self,supply:list[dict], demand:list[dict], transshipment:list[dict]):
        for supply_node in supply:
            name = supply_node.get("name")
            supply_quantity = supply_node.get("supply_quantity")
            self.supply.append(SupplyNode(name,supply_quantity))
            self.add_transitions(supply_node)
        for demand_node in demand:
            name = demand_node.get("name")
            demand_quantity = demand_node.get("demand_quantity")
            self.demand.append(DemandNode(name,demand_quantity))
            self.add_transitions(demand_node)
        if len(transshipment)>0:
            for transshipment_node in transshipment:
                name = transshipment_node.get("name")
                self.transshipment.append(Node(name))
                self.add_transitions(transshipment_node)
    
    def add_transitions(self,node_dict: dict):
        origin = node_dict.get("name")
        transitions:list[dict] = node_dict.get("transitions")
        for transition in transitions:
            destination,cost = next(iter(transition.items()))
            self.transitions.append(Transition(origin,destination,cost))
        
    def delete_transition(self,origin, destination):
        for transition in self.transitions:
            if transition.origin == origin and transition.destination == destination:
                self.transitions.remove(transition)
        
    def get_conjunto_i(self):
        conjunto_i:list[str] = []
        for supply_node in self.supply:
            conjunto_i.append(supply_node.name)
        return conjunto_i
    
    def get_conjunto_j(self):
        conjunto_j:list[str] = []
        if len(self.transshipment)==0:
            for demand_node in self.demand:
                conjunto_j.append(demand_node.name)
        else:
            for transshipment_node in self.transshipment:
                conjunto_j.append(transshipment_node.name)
        return conjunto_j
    
    def get_conjunto_k(self):
        conjunto_k:list[str] = []
        for demand_node in self.demand:
            conjunto_k.append(demand_node.name)
        return conjunto_k
                
    def get_cii(self):
        CII : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_i() and transition.destination in self.get_conjunto_i():
                CII[(transition.origin,transition.destination)] = transition.cost
        return CII
    
    def get_cij(self):
        CIJ : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_i() and transition.destination in self.get_conjunto_j():
                CIJ[(transition.origin,transition.destination)] = transition.cost
        return CIJ
    
    def get_cik(self):
        CIK : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_i() and transition.destination in self.get_conjunto_k():
                CIK[(transition.origin,transition.destination)] = transition.cost
        return CIK
    
    def get_cji(self):
        CJI : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_j() and transition.destination in self.get_conjunto_i():
                CJI[(transition.origin,transition.destination)] = transition.cost
        return CJI
    
    def get_cjj(self):
        CJJ : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_j() and transition.destination in self.get_conjunto_j():
                CJJ[(transition.origin,transition.destination)] = transition.cost
        return CJJ
    
    def get_cjk(self):
        CJK : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_j() and transition.destination in self.get_conjunto_k():
                CJK[(transition.origin,transition.destination)] = transition.cost
        return CJK
    
    def get_cki(self):
        CKI : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_k() and transition.destination in self.get_conjunto_i():
                CKI[(transition.origin,transition.destination)] = transition.cost
        return CKI
    
    def get_ckj(self):
        CKJ : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_k() and transition.destination in self.get_conjunto_j():
                CKJ[(transition.origin,transition.destination)] = transition.cost
        return CKJ
    
    def get_ckk(self):
        CKK : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_k() and transition.destination in self.get_conjunto_k():
                CKK[(transition.origin,transition.destination)] = transition.cost
        return CKK
    
    def get_entradas(self,node_name:str):
        entradas: list[str] = []
        for transition in self.transitions:
            if transition.destination == node_name:
                entradas.append(transition.origin)
        return entradas
    
    def get_salidas(self,node_name:str):
        salidas: list[str] = []
        for transition in self.transitions:
            if transition.origin == node_name:
                salidas.append(transition.destination)
        return salidas
    
    def get_a_oferta(self):
        a_oferta: dict[str,float] = {}
        for supply_node in self.supply:
            a_oferta[supply_node.name] =  supply_node.supply_quantity
        return a_oferta
        
    def get_b_demanda(self):
        b_demanda: dict[str,float] = {}
        for demand_node in self.demand:
            b_demanda[demand_node.name] =  demand_node.demand_quantity
        return b_demanda
    
    def get_total_oferta(self):
        total_oferta = 0
        for value in self.get_a_oferta().values():
            total_oferta+= value
        return total_oferta
            
    def get_total_demanda(self):
        total_demanda = 0
        for value in self.get_b_demanda().values():
            total_demanda+= value
        return total_demanda
    
    def get_minimo_asignaciones(self):
        if self.get_total_oferta()>self.get_total_demanda():
            total_tmp = self.get_total_oferta()
            count = len(self.get_conjunto_i())
            for value in sorted(self.get_a_oferta().values()):
                total_tmp -= value
                if total_tmp <= self.get_total_demanda():
                    return count
                else:
                    count -= 1
            return count
        else:
            total_tmp = self.get_total_demanda()
            count = len(self.get_conjunto_k())
            for value in sorted(self.get_b_demanda().values()):
                total_tmp -= value
                if total_tmp <= self.get_total_oferta():
                    return count
                else:
                    count -= 1
            return count
    
    def remove_unreachable_nodes(self):
        to_delete = []
        for node in self.supply:
            delete = True
            for transition in self.transitions:
                if node.name in [transition.origin,transition.destination]:
                    delete = False
            if delete == True:
                to_delete.append(node)
        for node in to_delete:
            self.supply.remove(node)
        to_delete = []
        for node in self.demand:
            delete = True
            for transition in self.transitions:
                if node.name in [transition.origin,transition.destination]:
                    delete = False
            if delete == True:
                to_delete.append(node)
        for node in to_delete:    
            self.demand.remove(node)
        to_delete = []
        for node in self.transshipment:
            delete = True
            for transition in self.transitions:
                if node.name in [transition.origin,transition.destination]:
                    delete = False
            if delete == True:
                to_delete.append(node)
        for node in to_delete:    
            self.transshipment.remove(node)
    
    def update_transition(self, origin, destination, quantity):
        for transition in self.transitions:
            if transition.origin == origin and transition.destination == destination:
                transition.cost = transition.cost * quantity
    
    def response(self):
        return {"supply":self.supply_json(),
                "demand":self.demand_json(),
                "transshipment":self.transshipment_json()}
    
    def supply_json(self):
        supply_list: list = []
        for supply_node in self.supply:
            node_json:dict = {}
            transitions_list: list = []
            for transition in self.transitions:
                if transition.origin == supply_node.name:
                    transitions_list.append({transition.destination:transition.cost})
            node_json["name"] = supply_node.name
            node_json["supply_quantity"] = supply_node.supply_quantity
            node_json["transitions"] = transitions_list
            supply_list.append(node_json)
        return supply_list
    
    def demand_json(self):
        demand_list: list = []
        for demand_node in self.demand:
            node_json:dict = {}
            transitions_list: list = []
            for transition in self.transitions:
                if transition.origin == demand_node.name:
                    transitions_list.append({transition.destination:transition.cost})
            node_json["name"] = demand_node.name
            node_json["demand_quantity"] = demand_node.demand_quantity
            node_json["transitions"] = transitions_list
            demand_list.append(node_json)
        return demand_list
    
    def transshipment_json(self):
        transshipment_list: list = []
        for transshipment_node in self.transshipment:
            node_json:dict = {}
            transitions_list: list = []
            for transition in self.transitions:
                if transition.origin == transshipment_node.name:
                    transitions_list.append({transition.destination:transition.cost})
            node_json["name"] = transshipment_node.name
            node_json["transitions"] = transitions_list
            transshipment_list.append(node_json)
        return transshipment_list

class Node:
    def __init__(self, name:str) -> None:
        self.name = name
    
class SupplyNode(Node):
    def __init__(self, name:str, supply_quantity:float) -> None:
        self.name = name
        self.supply_quantity = supply_quantity

class DemandNode(Node):
    def __init__(self, name:str, demand_quantity:float) -> None:
        self.name = name
        self.demand_quantity = demand_quantity
    
class Transition:
    def __init__(self, origin : Node , destination: Node , cost: float) -> None:
        self.origin = origin 
        self.destination = destination 
        self.cost= cost