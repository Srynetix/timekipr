import { useCallback, useEffect, useState } from "react";
import { ChronometerFlowDefinition } from "../domain/ChronometerFlowDefinition";
import { ChronometerFlow } from "../domain/ChronometerFlow";

export const useFlow = (definitions: ChronometerFlowDefinition[]) => {
  const [flow, setFlow] = useState(() => new ChronometerFlow(definitions));
  const [chronometers, setChronometers] = useState(flow.snapshot());
  const [flowElapsedTime, setFlowElapsedTime] = useState("");
  const [flowTotalTime, setFlowTotalTime] = useState("");
  const [flowDeltaValue, setFlowDeltaValue] = useState(0);
  const [flowDeltaValueHumanReadable, setFlowDeltaValueHumanReadable] =
    useState("");

  const resetFlow = () => {
    const flow = new ChronometerFlow(definitions);
    setFlow(flow);
    setChronometers(flow.snapshot());
  };

  useEffect(() => {
    const flow = new ChronometerFlow(definitions);
    setFlow(flow);
    setChronometers(flow.snapshot());
  }, [definitions]);

  const startFlow = () => {
    flow.start();
    setChronometers(flow.snapshot());
  };

  const validateChronometer = () => {
    flow.currentChronometer.finish();
    setChronometers(flow.snapshot());
  };

  const started = useCallback(() => {
    return flow.started;
  }, [flow]);

  const currentChronometer = () => {
    return flow.currentChronometer?.snapshot();
  };

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

      setFlowElapsedTime(flow.totalElapsedTime.toHumanReadableString());
      setFlowTotalTime(flow.totalTimeLimit.toHumanReadableString());
      setFlowDeltaValue(flow.deltaValue.seconds);
      setFlowDeltaValueHumanReadable(flow.deltaValue.toHumanReadableString());
      setChronometers(flow.snapshot());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [flow]);

  return {
    startFlow,
    started,
    finished,
    resetFlow,
    flowDeltaValue,
    flowDeltaValueHumanReadable,
    flowElapsedTime,
    flowTotalTime,
    validateChronometer,
    currentChronometer,
    chronometers,
  };
};
