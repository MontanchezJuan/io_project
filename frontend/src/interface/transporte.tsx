import { DemandNode, SupplyNode } from "./common";

export interface Transporte {
  supply: SupplyNode[];
  demand: DemandNode[];
}

export interface DataTransporte {
  problem: Transporte;
  assignments: number;
}

export interface ResponseTransporte {
  data: DataResponseTransporte;
  status: number;
  statusText: string;
  headers: ResponseHeaders;
  config: Config;
  request: Request;
}

export interface DataResponseTransporte {
  assignments: number;
  objective: number;
  model: Model;
  problem: Transporte;
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
