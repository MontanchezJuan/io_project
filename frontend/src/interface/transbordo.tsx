import { DemandNode, Node, SupplyNode } from "./common";

export interface Transbordo {
  supply: SupplyNode[];
  demand: DemandNode[];
  transshipment: Node[];
}

export interface DataTransbordo {
  problem: Transbordo;
  assignments: number;
}

export interface ResponseTransbordo {
  data: DataResponseTransbordo;
  status: number;
  statusText: string;
  headers: ResponseHeaders;
  config: Config;
  request: Request;
}

export interface DataResponseTransbordo {
  assignments: number;
  objective: number;
  model: Model;
  problem: Transbordo;
}

export interface Model {
  constraints: string[];
  objective: string;
  parameters: string[];
  variables: string[];
}

export interface Config {
  transitional: Transitional;
  adapter: string[];
  transformRequest: null[];
  transformResponse: null[];
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
  env: Request;
  headers: ConfigHeaders;
  baseURL: string;
  method: string;
  url: string;
  data: string;
}

export interface ConfigHeaders {
  Accept: string;
  "Content-Type": string;
}

export interface Transitional {
  silentJSONParsing: boolean;
  forcedJSONParsing: boolean;
  clarifyTimeoutError: boolean;
}

export interface ResponseHeaders {
  "content-length": string;
  "content-type": string;
}
