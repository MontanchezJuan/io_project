import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import { PAGES } from "./pages";

import { Header } from "./layouts/Header";
import { StepbyStepProvider } from "./context/StepByStepContext";

function App() {
  return (
    <StepbyStepProvider>
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
    </StepbyStepProvider>
  );
}

export default App;
