import { useState } from "react";
import { TimelineBuilder } from "./components/builders/TimelineBuilder";
import { Timeline } from "./components/Timeline";

import { HashSetter } from "./components/builders/HashSetter";
import { AppHeader } from "./components/AppHeader";
import { useTimeline } from "./hooks/useTimeline";

function App() {
  const [playing, setPlaying] = useState(false);
  const [chronometerView, setChronometerView] = useState(false);

  const { commands: timelineActions, state: timelineState } = useTimeline();

  const onPlay = () => {
    timelineActions.startTimeline();
    setPlaying(true);
  };

  const onReset = () => {
    timelineActions.resetTimeline();
    setPlaying(false);
  };

  if (
    timelineState.timelineView.started &&
    !timelineState.timelineView.finished &&
    !playing
  ) {
    setPlaying(true);
  }

  if (
    timelineState.timelineView.started &&
    timelineState.timelineView.finished &&
    playing
  ) {
    setPlaying(false);
  }

  const onCheck = () => {
    timelineActions.markCurrentChronometerAsDone();
  };

  return (
    <div className="app">
      {!chronometerView && <AppHeader animated={playing} />}
      {!chronometerView && (
        <>
          <TimelineBuilder
            definition={timelineState.timelineDefinition}
            setDefinition={timelineActions.setTimelineDefinition}
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
