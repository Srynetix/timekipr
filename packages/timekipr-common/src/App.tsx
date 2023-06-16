import { useEffect, useState } from "react";
import { TimelineBuilder } from "./components/TimelineBuilder";
import {
  ChronometerFlowDefinition,
  buildHash,
  loadHash,
} from "./domain/ChronometerFlowDefinition";
import { Timeline } from "./components/Timeline";

import logo from "./assets/icon.png";
import { HashSetter } from "./components/HashSetter";

function App() {
  const initialDefinitions = loadHash(window.location.hash.slice(1));
  const [definitions, setDefinitions] =
    useState<ChronometerFlowDefinition[]>(initialDefinitions);

  useEffect(() => {
    const handler = () => {
      setDefinitions(loadHash(window.location.hash.slice(1)));
    };

    window.addEventListener("hashchange", handler);

    return () => {
      window.removeEventListener("hashchange", handler);
    };
  });

  useEffect(() => {
    if (definitions.length == 0) {
      window.location.hash = "";
    } else {
      window.location.hash = buildHash(definitions);
    }
  }, [definitions]);

  return (
    <div className="app">
      <div className="app__header">
        <div className="app__header__logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="app__header__title">timekipr</div>
      </div>
      <TimelineBuilder
        definitions={definitions}
        setDefinitions={setDefinitions}
      />
      <HashSetter
        hash={window.location.hash.slice(1)}
        onHashLoad={(h) => (window.location.hash = h)}
      />
      <Timeline definitions={definitions} />
    </div>
  );
}

export default App;
