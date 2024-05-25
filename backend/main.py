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

        @self.app.route("/transportation_problem", methods=["POST"])
        def transportation_problem():
            try:
                data = request.get_json()
                problem = data.get("problem")
                assignments = data.get("assignments")
                supply: list[dict] = problem.get("supply")
                demand: list[dict] = problem.get("demand")
                graph = Graph(supply, demand)
                assignments, objective = TransportationProblem.solucion_transporte(
                    graph, assignments
                )
                return {
                    "problem": graph.response(),
                    "assignments": assignments,
                    "objective": objective,
                }
            except Exception as e:
                traceback.print_exc()
                return jsonify({"error": str(e)}), 400

        @self.app.route("/transshipment_problem", methods=["POST"])
        def transshipment_problem():
            try:
                data = request.get_json()
                problem = data.get("problem")
                assignments = data.get("assignments")
                supply: list[dict] = problem.get("supply")
                demand: list[dict] = problem.get("demand")
                transshipment: list[dict] = problem.get("transshipment")
                graph = Graph(supply, demand, transshipment)
                assignments, objective = TransshipmentProblem.solucion_transbordo(
                    graph, assignments
                )
                return {
                    "problem": graph.response(),
                    "assignments": assignments,
                    "objective": objective,
                }
            except Exception as e:
                print(f"Se generó un error: {e}")
                # Puedes obtener más información usando la clase de la excepción
                print(f"Tipo de excepción: {type(e).__name__}")
                traceback.print_exc()
                return jsonify({"error": str(e)}), 400

    def run(self):
        self.app.run(debug=True)


if __name__ == "__main__":
    main_instance = Main()
    main_instance.run()
