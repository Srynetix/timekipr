import { pages } from "@microsoft/teams-js";
import { useEffect } from "react";

export const ConfigPage = () => {
  useEffect(() => {
    try {
      pages.config.registerOnSaveHandler((handler) => {
        pages.config.setConfig({
          contentUrl: "https://srynetix.github.io/timekipr/teams/",
          websiteUrl: "https://github.com/Srynetix/timekipr",
          entityId: "timekipr",
          suggestedDisplayName: "timekipr",
        });
        handler.notifySuccess();
      });

      pages.config.setValidityState(true);
    } catch (e) {
      console.error(`could not setup Teams callbacks: ${e}`);
    }
  }, []);

  return <div>Nothing to configure.</div>;
};
