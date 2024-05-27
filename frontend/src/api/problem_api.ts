import { Api } from "./api";

import { DataTransbordo, ResponseTransbordo } from "../interface/transbordo";
import { DataTransporte, ResponseTransporte } from "../interface/transporte";

export const transportationProblemApi = (data: DataTransporte) =>
  Api.post<DataTransporte, ResponseTransporte>("transportation_problem", data);

export const transshipmentProblemApi = (data: DataTransbordo) =>
  Api.post<DataTransbordo, ResponseTransbordo>("transshipment_problem", data);
