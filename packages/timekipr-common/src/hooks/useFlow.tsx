import { useCallback, useEffect, useState } from "react";
import { ChronometerFlowDefinition } from "../domain/ChronometerFlowDefinition";
import { ChronometerFlow } from "../domain/ChronometerFlow";

export const useFlow = (definitions: ChronometerFlowDefinition[]) => {
  const [flow, setFlow] = useState(new ChronometerFlow(definitions));
  const [chronometers, setChronometers] = useState(flow.snapshot());

  useEffect(() => {
    const flow = new ChronometerFlow(definitions);
    setFlow(flow);
    setChronometers(flow.snapshot());
  }, [definitions]);

  const paused = useCallback(() => {
    return flow.paused;
  }, [flow]);

  const setPause = useCallback(
    (value: boolean) => {
      flow.setPause(value);
      setChronometers(flow.snapshot());
    },
    [flow]
  );

  const finished = useCallback(() => {
    return flow.finished;
  }, [flow]);

  useEffect(() => {
    let previousTime = new Date();

    const interval = setInterval(() => {
      const nowTime = new Date();
      const seconds = Math.round((+nowTime - +previousTime) / 1000) * 1;

      flow.tick(seconds);
      previousTime = nowTime;

      setChronometers(flow.snapshot());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [flow]);

  return { setPause, paused, finished, chronometers };
};
