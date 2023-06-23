import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import styleInject from "style-inject";
import allStyles from "./styles/index.scss?inline";

export const injectApplicationStyles = () => {
  styleInject(allStyles);
};

export const startApplication = () => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};
