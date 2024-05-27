// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

import { Heading } from "@chakra-ui/react";
// import { Heading, Tab, TabList, Tabs } from "@chakra-ui/react";
// import { PAGES, Page } from "../pages";

export const Header = () => {
  // const [header, setHeader] = useState<string>(PAGES[0].name);

  // const navigate = useNavigate();

  // const rediretTo = (page: Page) => {
  //   navigate(page.path);
  //   setHeader(page.name);
  // };

  return (
    <>
      <div className="flex justify-center items-center h-16 bg-primary mb-4">
        <Heading className="text-white">
          Solver de transporte y transbordo
        </Heading>
      </div>

      {/* <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          {PAGES &&
            PAGES.map((page) => (
              <Tab key={page.path} onClick={() => rediretTo(page)}>
                {header === page.name ? (
                  <p className="text-tertiary">{page.name}</p>
                ) : (
                  <p className="text-primary">{page.name}</p>
                )}
              </Tab>
            ))}
        </TabList>
      </Tabs> */}
    </>
  );
};
