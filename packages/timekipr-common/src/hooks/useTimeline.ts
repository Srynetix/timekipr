import { useEffect, useState } from "react";
import deepEqual from "deep-equal";
import {
  ChronometerTimelineDefinition,
  ChronometerTimelineMapper,
} from "../domain/mappers/ChronometerTimelineMapper";
import { ChronometerTimeline } from "../domain/ChronometerTimeline";
import { ChronometerDefinition } from "../domain/mappers/ChronometerMapper";
import { ChronometerAlert } from "../domain/ChronometerAlert";
import { ChronometerAlertDefinition } from "../domain/mappers/ChronometerAlertMapper";
import { Duration } from "../domain/value_objects/Duration";
import { Chronometer } from "../domain/Chronometer";
import { None, Option, Some } from "../utils/option";
import { useStableRef } from "../utils/useStableRef";

const buildAlertFromDefinition = (
  definition: ChronometerAlertDefinition
): ChronometerAlert => {
  return ChronometerAlert.buildFromProps({
    remainingTime: Duration.fromProps(definition.remainingTime),
    shown: false,
  });
};

const buildChronometerFromDefinition = (
  definition: ChronometerDefinition
): Chronometer => {
  return Chronometer.buildFromProps({
    alerts: definition.alerts.map(buildAlertFromDefinition),
    finishedAt: None(),
    startedAt: None(),
    lastUpdatedAt: None(),
    timeLimit: Duration.fromProps(definition.timeLimit),
    name: definition.name,
    timeOutPassed: false,
  });
};

const buildTimelineFromDefinition = (
  definition: ChronometerTimelineDefinition,
  fromStorage?: boolean
): ChronometerTimeline => {
  if (fromStorage) {
    const value = loadFromStorage();
    if (value.isSome()) {
      return value.unwrap();
    }
  }

  return ChronometerTimeline.buildFromProps({
    chronometers: definition.chronometers.map(buildChronometerFromDefinition),
    currentChronometerIndex: 0,
    started: false,
  });
};

const saveToStorage = (chronometerTimeline: ChronometerTimeline) => {
  const mapper = new ChronometerTimelineMapper();
  localStorage.setItem(
    "lastTimeline",
    JSON.stringify(mapper.toStorage(chronometerTimeline))
  );
};

const loadFromStorage = (): Option<ChronometerTimeline> => {
  const mapper = new ChronometerTimelineMapper();
  const item = localStorage.getItem("lastTimeline");
  if (item != null) {
    return Some(mapper.fromStorage(JSON.parse(item)));
  } else {
    return None();
  }
};

const chronometerTimelineMapper = new ChronometerTimelineMapper();

const snapshotTimeline = (obj: ChronometerTimeline) => {
  return chronometerTimelineMapper.toView(obj);
};

export const useTimeline = (definition: ChronometerTimelineDefinition) => {
  const timelineObject = useStableRef(() =>
    buildTimelineFromDefinition(definition, true)
  );
  const [previousDefinition, setPreviousDefinition] = useState(definition);
  const [timelineView, setTimelineView] = useState(() =>
    snapshotTimeline(timelineObject.current)
  );

  const updateTimeline = () => {
    setTimelineView(snapshotTimeline(timelineObject.current));
    saveToStorage(timelineObject.current);
  };

  const recreateTimeline = () => {
    const obj = buildTimelineFromDefinition(definition);
    timelineObject.current = obj;
    updateTimeline();
  };

  const resetTimeline = () => {
    recreateTimeline();
  };

  const startTimeline = () => {
    timelineObject.current.startTimeline();
    tick();
  };

  const markCurrentChronometerAsDone = () => {
    timelineObject.current.currentChronometer.unwrap().finish();
    tick();
  };

  const tick = () => {
    timelineObject.current.tick(new Date());
    updateTimeline();
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  // This is safe to do, tick() is using timelineObject which is a ref.
  // The linter does not see it because it's built using useStableRef instead of useRef.
  // https://github.com/facebook/react/issues/23392
  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  if (!deepEqual(previousDefinition, definition)) {
    setPreviousDefinition(definition);
    recreateTimeline();
  }

  return {
    state: { timelineView },
    commands: { startTimeline, resetTimeline, markCurrentChronometerAsDone },
  };
};
