import { useCallback, useEffect, useRef, useState } from "react";
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
import { Option, None, Some, useStableRef } from "../functional";
import deepEqual from "deep-equal";

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

  const onTimelineUpdate = (timelineObject: ChronometerTimeline) => {
    saveToStorage(timelineObject);
  };

  const recreateTimeline = () => {
    const obj = buildTimelineFromDefinition(definition);
    timelineObject.current = obj;
    setTimelineView(snapshotTimeline(obj));
    onTimelineUpdate(obj);
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
    setTimelineView(snapshotTimeline(timelineObject.current));
    onTimelineUpdate(timelineObject.current);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!deepEqual(previousDefinition, definition)) {
    setPreviousDefinition(definition);
    recreateTimeline();
  }

  return {
    state: { timelineView },
    commands: { startTimeline, resetTimeline, markCurrentChronometerAsDone },
  };
};
