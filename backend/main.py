from flask import Flask, request, jsonify
from flask_cors import CORS
from models.transportation_problem import TransportationProblem
from models.transshipment_problem import TransshipmentProblem
from models.graph import Graph
import traceback

class Main:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)
        
        @self.app.route('/transportation_problem', methods=['POST'])
        def transportation_problem():
            try:
                data = request.get_json()
                supply:list[dict] = data.get("supply")
                demand:list[dict] = data.get("demand")
                graph = Graph(supply,demand)
                TransportationProblem.solucion_transporte(graph)
                # json = graph.to_json()
                return {}
            except Exception as e:
                traceback.print_exc()
                return jsonify({'error': str(e)}), 400
    
        @self.app.route('/transshipment_problem', methods=['POST'])
        def transshipment_problem():
            try:
                data = request.get_json()
                supply:list[dict] = data.get("supply")
                demand:list[dict] = data.get("demand")
                transshipment:list[dict] = data.get("transshipment")
                graph = Graph(supply,demand,transshipment)
                TransshipmentProblem.solucion_transbordo(graph)
                # json = graph.to_json()
                return {}
            except Exception as e:
                print(f"Se generó un error: {e}")
                # Puedes obtener más información usando la clase de la excepción
                print(f"Tipo de excepción: {type(e).__name__}")
                traceback.print_exc()
                return jsonify({'error': str(e)}), 400
            
    def run(self):
        self.app.run(debug=True)
    
if __name__ == "__main__":
    main_instance = Main()
    main_instance.run()