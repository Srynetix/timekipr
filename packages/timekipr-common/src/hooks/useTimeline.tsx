import { useEffect, useState } from "react";
import { ChronometerTimelineProps } from "../domain/ChronometerTimelineProps";
import { ChronometerTimeline } from "../domain/ChronometerTimeline";

export const useTimeline = (props: ChronometerTimelineProps[]) => {
  const [timelineObject, setTimelineObject] = useState(
    () => new ChronometerTimeline(props)
  );
  const [timeline, setTimeline] = useState(() => timelineObject.snapshot());

  const resetTimeline = () => {
    const timelineObject = new ChronometerTimeline(props);
    setTimelineObject(timelineObject);
    setTimeline(timelineObject.snapshot());
  };

  useEffect(() => {
    const timelineObject = new ChronometerTimeline(props);
    setTimelineObject(timelineObject);
    setTimeline(timelineObject.snapshot());
  }, [props]);

  const startTimeline = () => {
    timelineObject.start();
    setTimeline(timelineObject.snapshot());
  };

  const markCurrentChronometerAsDone = () => {
    timelineObject.currentChronometer.finish();
    setTimeline(timelineObject.snapshot());
  };

  useEffect(() => {
    let previousTime = new Date();

    const interval = setInterval(() => {
      const nowTime = new Date();
      const seconds = Math.round((+nowTime - +previousTime) / 1000) * 1;

      timelineObject.tick(seconds);
      previousTime = nowTime;

      setTimeline(timelineObject.snapshot());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timelineObject]);

  return {
    startTimeline,
    resetTimeline,
    markCurrentChronometerAsDone,
    timeline,
  };
};
