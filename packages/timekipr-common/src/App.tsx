import { useEffect, useState } from "react";
import { TimelineBuilder } from "./components/builders/TimelineBuilder";
import { Timeline } from "./components/Timeline";

import { HashSetter } from "./components/builders/HashSetter";
import { AppHeader } from "./components/AppHeader";
import { buildHash, loadHash } from "./utils";
import { ChronometerTimelineDefinition } from "./domain/mappers/ChronometerTimelineMapper";
import { buildDefaultTimelineDefinition } from "./domain/builders";
import { useTimeline } from "./hooks/useTimeline";

function App() {
  const [timelineDefinition, setTimelineDefinition] = useState(
    () =>
      loadHash<ChronometerTimelineDefinition>(window.location.hash.slice(1)) ??
      buildDefaultTimelineDefinition()
  );
  const [playing, setPlaying] = useState(false);
  const [chronometerView, setChronometerView] = useState(false);

  const { commands: timelineActions, state: timelineState } =
    useTimeline(timelineDefinition);

  const onPlay = () => {
    timelineActions.startTimeline();
    setPlaying(true);
  };

  const onReset = () => {
    timelineActions.resetTimeline();
    setPlaying(false);
  };

  if (timelineState.timelineView.started && !timelineState.timelineView.finished && !playing) {
    setPlaying(true);
  }

  if (timelineState.timelineView.started && timelineState.timelineView.finished && playing) {
    setPlaying(false);
  }

  const onCheck = () => {
    timelineActions.markCurrentChronometerAsDone();
  };

  useEffect(() => {
    const handler = () => {
      setTimelineDefinition(
        loadHash<ChronometerTimelineDefinition>(
          window.location.hash.slice(1)
        ) ?? buildDefaultTimelineDefinition()
      );
    };

    window.addEventListener("hashchange", handler);

    return () => {
      window.removeEventListener("hashchange", handler);
    };
  }, []);

  useEffect(() => {
    window.location.hash = buildHash(timelineDefinition);
  }, [timelineDefinition]);

  return (
    <div className="app">
      {!chronometerView && <AppHeader animated={playing} />}
      {!chronometerView && (
        <>
          <TimelineBuilder
            definition={timelineDefinition}
            setDefinition={setTimelineDefinition}
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
        timelineView={timelineState.timelineView}
        chronometerView={chronometerView}
        setChronometerView={setChronometerView}
        onPlay={onPlay}
        onCheck={onCheck}
        onReset={onReset}
      />
    </div>
  );
}

export default App;
