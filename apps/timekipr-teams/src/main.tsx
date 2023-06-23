import { app } from "@microsoft/teams-js";
import React from "react";
import ReactDOM from "react-dom/client";

import { ConfigPage } from "./pages/Config";
import { startApplication, injectApplicationStyles } from "timekipr-common";

async function main() {
  try {
    await app.initialize();
  } catch {
    console.error(
      "could not initialize Teams client, make sure you are running the application in a Teams window"
    );
  }

  const queryParams = new URLSearchParams(location.search);
  const route = queryParams.get("route");

  injectApplicationStyles();

  if (route == "config") {
    ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
      <React.StrictMode>
        <ConfigPage />
      </React.StrictMode>
    );
  } else {
    startApplication();
  }
}

main();
