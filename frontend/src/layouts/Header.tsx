import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Heading, Tab, TabList, Tabs } from "@chakra-ui/react";
import { PAGES, Page } from "../pages";

export const Header = () => {
  const [header, setHeader] = useState<string>(PAGES[0].name);
  const navigate = useNavigate();

  const rediretTo = (page: Page) => {
    navigate(page.path);
    setHeader(page.name);
  };

  return (
    <>
      <div className="flex justify-center items-center h-16 bg-primary">
        <Heading className="text-white">
          Solver de transporte y transbordo
        </Heading>
      </div>

      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          {PAGES &&
            PAGES.map((page) => (
              <Tab onClick={() => rediretTo(page)}>
                {header === page.name ? (
                  <p className="text-tertiary">{page.name}</p>
                ) : (
                  <p className="text-primary">{page.name}</p>
                )}
              </Tab>
            ))}
        </TabList>
      </Tabs>
    </>
  );
};
