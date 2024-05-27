import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import { PAGES } from "./pages";

import { Header } from "./layouts/Header";
import { StepByStepProvider } from "./providers/StepByStepProvider";

function App() {
  return (
    <StepByStepProvider>
      <ChakraProvider>
        <BrowserRouter>
          <Header />

          <Routes>
            {PAGES &&
              PAGES.map((page) => (
                <Route
                  key={page.path}
                  path={page.path}
                  element={page.component}
                />
              ))}
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </StepByStepProvider>
  );
}

export default App;
