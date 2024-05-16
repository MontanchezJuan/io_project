class Graph:
    def __init__(self, supply: list[dict] = [], demand:list[dict] = [] , transshipment: list[dict] = []) -> None:
        self.supply : list[SupplyNode]
        self.demand : list[DemandNode]
        self.transshipment : list[Node]
        self.transitions : list[Transition] = []
        self.estructure(supply,demand,transshipment)
        
    def estructure(self,supply:list[dict], demand:list[dict], transshipment:list[dict]):
        for supply_node in supply:
            name = supply_node.get("name")
            supply_quantity = supply_node.get("capacity")
            self.supply.append(SupplyNode(name,supply_quantity))
            self.add_transitions(supply_node)
        for demand_node in demand:
            name = demand_node.get("name")
            demand_quantity = demand_node.get("capacity")
            self.demand.append(DemandNode(name,demand_quantity))
            self.add_transitions(demand_node)
        if len(transshipment)>0:
            for transshipment_node in transshipment:
                name = transshipment_node.get("name")
                self.demand.append(Node(name))
                self.add_transitions(transshipment_node)
                
    def add_transitions(self,node_dict: dict):
        origin = node_dict.get("name")
        transitions:list[dict] = node_dict.get("transitions")
        for transition in transitions:
            cost, destination = next(iter(transition.items()))
            self.transitions.append(Transition(origin,destination,cost))

    def to_json(self):
        if len(self.transshipment)>0:
            return {'supply': self.supply,
                    'demand': self.demand,
                    'transshipment': self.transshipment,
                    'transitions': self.transitions,}
        else:
            return {'supply': self.supply,
                    'demand': self.demand,
                    'transitions': self.transitions,}


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