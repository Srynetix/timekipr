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
import clsx from "clsx";

function App() {
  const initialDefinitions = loadHash(window.location.hash.slice(1));
  const [definitions, setDefinitions] =
    useState<ChronometerFlowDefinition[]>(initialDefinitions);
  const [playing, setPlaying] = useState(false);
  const [chronometerView, setChronometerView] = useState(false);

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
      <div
        className={clsx("app__header", { "app__header--animated": playing })}
      >
        <div className="app__header__logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="app__header__title">timekipr</div>
      </div>
      {!chronometerView && (
        <>
          <TimelineBuilder
            definitions={definitions}
            setDefinitions={setDefinitions}
            readonly={playing}
          />
          <HashSetter
            hash={window.location.hash.slice(1)}
            onHashLoad={(h) => (window.location.hash = h)}
            readonly={playing}
          />
        </>
      )}
      <Timeline
        definitions={definitions}
        chronometerView={chronometerView}
        setChronometerView={setChronometerView}
        onPlay={() => setPlaying(true)}
        onReset={() => setPlaying(false)}
      />
    </div>
  );
}

export default App;
