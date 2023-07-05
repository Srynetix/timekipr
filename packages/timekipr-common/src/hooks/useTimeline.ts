import { useEffect, useRef, useState } from "react";
import {
  ChronometerTimelineDefinition,
  ChronometerTimelineMapper,
  ChronometerTimelineViewDTO,
} from "../domain/mappers/ChronometerTimelineMapper";
import { ChronometerTimeline } from "../domain/ChronometerTimeline";
import { Option } from "../utils/option";
import { useStableRef } from "../utils/useStableRef";
import { buildHash, loadHash } from "../utils/hash";
import { buildDefaultTimelineDefinition } from "../domain/builders";
import deepEqual from "deep-equal";

// Definitions

const loadDefinitionFromHash = (): Option<ChronometerTimelineDefinition> => {
  return Option.fromNullable(
    loadHash<ChronometerTimelineDefinition>(window.location.hash.slice(1))
  );
};

const loadDefinition = (): ChronometerTimelineDefinition => {
  return loadDefinitionFromHash().unwrapOrElse(buildDefaultTimelineDefinition);
};

const buildTimelineFromDefinition = (
  definition: ChronometerTimelineDefinition,
  fromStorage?: boolean
): ChronometerTimeline => {
  if (fromStorage) {
    const hash = buildHash(definition);
    const value = loadTimelineFromStorage(hash);
    if (value.isSome()) {
      return value.unwrap();
    }
  }

  const mapper = new ChronometerTimelineMapper();
  return mapper.fromDefinition(definition);
};

// Timeline data

const saveTimelineToStorage = (
  hash: string,
  chronometerTimeline: ChronometerTimeline
) => {
  const mapper = new ChronometerTimelineMapper();
  const data = JSON.stringify(mapper.toStorage(chronometerTimeline));
  const key = `last-timeline${hash}`;

  console.log("[useTimeline] saveTimelineToStorage", key, data);

  localStorage.setItem(key, data);
};

const loadTimelineFromStorage = (hash: string): Option<ChronometerTimeline> => {
  const key = `last-timeline${hash}`;
  const mapper = new ChronometerTimelineMapper();

  console.log("[useTimeline] loadTimelineFromStorage", key);

  return Option.fromNullable(localStorage.getItem(key)).map((item) =>
    mapper.fromStorage(JSON.parse(item))
  );
};

const chronometerTimelineMapper = new ChronometerTimelineMapper();

const snapshotTimeline = (obj: ChronometerTimeline) => {
  return chronometerTimelineMapper.toView(obj);
};

export const useTimeline = () => {
  const lastTimelineSnapshot = useRef<ChronometerTimelineViewDTO | null>(null);
  const [timelineDefinition, setTimelineDefinition] = useState(() => {
    const data = loadDefinition();
    window.location.hash = buildHash(data);
    return data;
  });

  const timelineObject = useStableRef(() =>
    buildTimelineFromDefinition(timelineDefinition, true)
  );

  const updateTimeline = () => {
    const newSnapshot = snapshotTimeline(timelineObject.current);
    if (!deepEqual(newSnapshot, lastTimelineSnapshot.current)) {
      lastTimelineSnapshot.current = newSnapshot;
      setTimelineView(newSnapshot);

      if (timelineObject.current.started) {
        const hash = buildHash(timelineDefinition);
        saveTimelineToStorage(hash, timelineObject.current);
      }
    }
  };

  const recreateTimeline = (definition: ChronometerTimelineDefinition) => {
    const obj = buildTimelineFromDefinition(definition);
    timelineObject.current = obj;
    updateTimeline();
  };

  const setTimelineDefinitionWrapper = (
    value: ChronometerTimelineDefinition
  ) => {
    console.log("[useTimeline] setTimelineDefinitionWrapper", value);
    window.location.hash = buildHash(value);
    setTimelineDefinition(value);
    recreateTimeline(value);
  };

  const [timelineView, setTimelineView] = useState(() =>
    snapshotTimeline(timelineObject.current)
  );

  const resetTimeline = () => {
    recreateTimeline(timelineDefinition);
  };

  const startTimeline = () => {
    timelineObject.current.startTimeline();
    tick();
  };

  const markCurrentChronometerAsDone = () => {
    console.log(
      "[useTimeline] markCurrentChronometerAsDone",
      timelineObject.current.currentChronometer
    );
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

  return {
    state: { timelineView, timelineDefinition },
    commands: {
      startTimeline,
      resetTimeline,
      markCurrentChronometerAsDone,
      setTimelineDefinition: setTimelineDefinitionWrapper,
    },
  };
};
