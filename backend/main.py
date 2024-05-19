from flask import Flask, request, jsonify
from flask_cors import CORS
from models.transportation_problem import TransportationProblem
from models.transshipment_problem import TransshipmentProblem
from models.graph import Graph

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
                respuesta =TransportationProblem.solve(graph)
                json = graph.to_json()
                return json
            except Exception as e:
                traceback = e.__traceback__
                while traceback:
                    print("Archivo:", traceback.tb_frame.f_code.co_filename)
                    print("Línea:", traceback.tb_lineno)
                    traceback = traceback.tb_next
                return jsonify({'error': str(e)}), 400
    
        @self.app.route('/transshipment_problem', methods=['POST'])
        def transshipment_problem():
            try:
                data = request.get_json()
                supply:list[dict] = data.get("supply")
                demand:list[dict] = data.get("demand")
                transshipment:list[dict] = data.get("transshipment")
                graph = Graph(supply,demand,transshipment)
                json = graph.to_json()
                return json
            except Exception as e:
                traceback = e.__traceback__
                while traceback:
                    print("Archivo:", traceback.tb_frame.f_code.co_filename)
                    print("Línea:", traceback.tb_lineno)
                    traceback = traceback.tb_next
                return jsonify({'error': str(e)}), 400
            
    def run(self):
        self.app.run(debug=True)
    
if __name__ == "__main__":
    main_instance = Main()
    main_instance.run()