import { TimeSlotBuilder } from "./TimeSlotBuilder";
import { ChronometerFlowDefinition } from "../domain/ChronometerFlowDefinition";
import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash } from "react-feather";

export interface Props {
  definitions: ChronometerFlowDefinition[];
  setDefinitions: (definitions: ChronometerFlowDefinition[]) => void;
}

export const TimelineBuilder = ({ definitions, setDefinitions }: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  const updateDefinition = (
    index: number,
    value: ChronometerFlowDefinition
  ) => {
    setDefinitions([
      ...definitions.slice(0, index),
      value,
      ...definitions.slice(index + 1),
    ]);
  };

  const removeDefinition = (index: number) => {
    setDefinitions([
      ...definitions.slice(0, index),
      ...definitions.slice(index + 1),
    ]);
  };

  return (
    <div
      className={`timeline-builder ${
        collapsed ? "timeline-builder--collapsed" : ""
      }`}
    >
      <div className="timeline-builder__title">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="timeline-builder__collapseIcon"
          title={collapsed ? "Show builder" : "Hide builder"}
        >
          {!collapsed ? <ChevronDown /> : <ChevronUp />}
          Timeline Builder
        </button>
      </div>

      {definitions.map((d, idx) => (
        <div key={idx} className="timeline-builder__slot">
          <TimeSlotBuilder
            definition={d}
            onChange={(def) => updateDefinition(idx, def)}
          />
          <button onClick={() => removeDefinition(idx)}><Trash />Remove</button>
        </div>
      ))}
      <button
        onClick={() =>
          setDefinitions([
            ...definitions,
            { name: "", timeLimit: {}, warnAtPercentage: 50 },
          ])
        }
      >
        <Plus />Add
      </button>
    </div>
  );
};
