import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import styleInject from "style-inject";

import indexStyles from "./index.css?inline";
import allStyles from "./styles/index.scss?inline";

export const startApplication = () => {
  styleInject(indexStyles);
  styleInject(allStyles);

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};
