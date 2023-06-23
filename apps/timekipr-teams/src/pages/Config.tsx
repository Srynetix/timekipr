import { pages } from "@microsoft/teams-js";
import { useEffect } from "react";

export const ConfigPage = () => {
  useEffect(() => {
    pages.config.registerOnSaveHandler((handler) => {
      pages.config.setConfig({
        contentUrl: "https://localhost:53000",
        websiteUrl: "https://localhost:53000",
        entityId: "timekipr",
        suggestedDisplayName: "timekipr",
      });
      handler.notifySuccess();
    });

    pages.config.setValidityState(true);
  }, []);

  return <div>Configuration page.</div>;
};
