import { app } from "@microsoft/teams-js";
import React from "react";
import ReactDOM from "react-dom/client";

import { ConfigPage } from "./pages/Config";
import { startApplication, injectApplicationStyles } from "timekipr-common";

async function main() {
  await app.initialize();

  const queryParams = new URLSearchParams(location.search);
  const route = queryParams.get("route");

  if (route == "config") {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <React.StrictMode>
        <ConfigPage />
      </React.StrictMode>
    );
  } else {
    injectApplicationStyles();
    startApplication();
  }
}

main();
