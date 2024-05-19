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
                CII[f'{(transition.origin,transition.destination)}'] = transition.cost
        return CII
    
    def get_cij(self):
        CIJ : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_i() and transition.destination in self.get_conjunto_j():
                CIJ[f'{(transition.origin,transition.destination)}'] = transition.cost
        return CIJ
    
    def get_cik(self):
        CIK : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_i() and transition.destination in self.get_conjunto_k():
                CIK[f'{(transition.origin,transition.destination)}'] = transition.cost
        return CIK
    
    def get_cji(self):
        CJI : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_j() and transition.destination in self.get_conjunto_i():
                CJI[f'{(transition.origin,transition.destination)}'] = transition.cost
        return CJI
    
    def get_cjj(self):
        CJJ : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_j() and transition.destination in self.get_conjunto_j():
                CJJ[f'{(transition.origin,transition.destination)}'] = transition.cost
        return CJJ
    
    def get_cjk(self):
        CJK : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_j() and transition.destination in self.get_conjunto_k():
                CJK[f'{(transition.origin,transition.destination)}'] = transition.cost
        return CJK
    
    def get_cki(self):
        KI : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_k() and transition.destination in self.get_conjunto_i():
                KI[f'{(transition.origin,transition.destination)}'] = transition.cost
        return KI
    
    def get_ckj(self):
        CKJ : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_k() and transition.destination in self.get_conjunto_j():
                CKJ[f'{(transition.origin,transition.destination)}'] = transition.cost
        return CKJ
    
    def get_ckk(self):
        CKK : dict[tuple,float]= {}
        for transition in self.transitions:
            if transition.origin in self.get_conjunto_k() and transition.destination in self.get_conjunto_k():
                CKK[f'{(transition.origin,transition.destination)}'] = transition.cost
        return CKK
    
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
    
    def to_json(self):
        json_dict: dict ={}
        json_dict["conjunto_i"] = self.get_conjunto_i()
        json_dict["conjunto_j"] = self.get_conjunto_j()
        if len(self.transshipment)>0:
            json_dict["conjunto_k"] = self.get_conjunto_k()
        json_dict["CII"] = self.get_cii()
        json_dict["CIJ"] = self.get_cij()
        json_dict["CIk"] = self.get_cik()
        json_dict["CJI"] = self.get_cji()
        json_dict["CJJ"] = self.get_cjj()
        json_dict["CJK"] = self.get_cjk()
        json_dict["CKI"] = self.get_cki()
        json_dict["CKJ"] = self.get_ckj()
        json_dict["CKK"] = self.get_ckk()
        json_dict["a_oferta"] = self.get_a_oferta()
        json_dict["b_demanda"] = self.get_b_demanda()
        return json.dumps(json_dict)

                    

    # def to_json(self):
    #     return json.dumps(self.obj_to_dict(self), indent=4)

    # def obj_to_dict(self,obj):
    #     # Si el objeto es una lista o un diccionario, procesar recursivamente
    #     if isinstance(obj, list):
    #         return [self.obj_to_dict(i) for i in obj]
    #     elif isinstance(obj, dict):
    #         return {k: self.obj_to_dict(v) for k, v in obj.items()}
        
    #     # Si el objeto es de una clase definida por el usuario, convertir sus atributos a un diccionario
    #     elif hasattr(obj, "__dict__"):
    #         return {k: self.obj_to_dict(v) for k, v in obj.__dict__.items() if not k.startswith('_')}
        
    #     # Si el objeto es de un tipo primitivo, devolverlo tal cual
    #     else:
    #         return obj


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