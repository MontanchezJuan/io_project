/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement } from "react";

import { Landing } from "./Landing";
import { History } from "./History";

export interface Page {
  component: ReactElement<any, any>;
  path: string;
  name: string;
}

export const PAGES: Page[] = [
  { component: <Landing />, path: "/", name: "Inicio" },
  { component: <History />, path: "/history", name: "Historial" },
];
