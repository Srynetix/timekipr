import { TimeSlotBuilder } from "./TimeSlotBuilder";
import {
  ChronometerFlowDefinition,
  buildDefaultDefinition,
} from "../domain/ChronometerFlowDefinition";
import { useState } from "react";
import { Box, ChevronsDown, ChevronsUp, Plus, Trash } from "react-feather";
import { Button } from "./Button";
import { CollapsibleTitle } from "./CollapsibleTitle";
import {
  immutableArrayInsert,
  immutableArrayMoveIndex,
  immutableArrayRemove,
} from "../utils";
import { InlineHelp } from "./InlineHelp";

export interface Props {
  definitions: ChronometerFlowDefinition[];
  setDefinitions: (definitions: ChronometerFlowDefinition[]) => void;
  readonly: boolean;
}

const HelpText = () => (
  <InlineHelp>
    <p>
      Create a new time slot using the{" "}
      <Button primary inline>
        <Plus />
        Add
      </Button>{" "}
      button.
    </p>
    <p>Then you can setup:</p>
    <ul>
      <li>
        The slot <b>name</b>,
      </li>
      <li>
        The slot <b>duration</b> (you can specify an amount of seconds, minutes
        and hours),
      </li>
      <li>
        The slot <b>alerts</b>, where you can setup notifications at specific
        "remaining durations".
      </li>
    </ul>
    <p>
      You can also move slots using the{" "}
      <Button primary inline>
        <ChevronsUp />
        Move up
      </Button>{" "}
      and{" "}
      <Button primary inline>
        <ChevronsDown />
        Move down
      </Button>{" "}
      buttons, and remove slots using the{" "}
      <Button primary inline>
        <Trash />
        Remove
      </Button>{" "}
      button.
    </p>
  </InlineHelp>
);

export const TimelineBuilder = ({
  definitions,
  setDefinitions,
  readonly,
}: Props) => {
  const [collapsed, setCollapsed] = useState(true);

  const updateDefinition = (
    index: number,
    value: ChronometerFlowDefinition
  ) => {
    setDefinitions(immutableArrayInsert(definitions, index, value));
  };

  const removeDefinition = (index: number) => {
    setDefinitions(immutableArrayRemove(definitions, index));
  };

  const moveUp = (index: number) => {
    if (index == 0) {
      return;
    }

    setDefinitions(immutableArrayMoveIndex(definitions, index, index - 1));
  };

  const moveDown = (index: number) => {
    if (index == definitions.length - 1) {
      return;
    }

    setDefinitions(immutableArrayMoveIndex(definitions, index, index + 1));
  };

  return (
    <div
      className={`timeline-builder ${
        collapsed ? "timeline-builder--collapsed" : ""
      }`}
    >
      <CollapsibleTitle
        leftIcon={<Box />}
        collapsed={collapsed}
        collapsedTitle="Show builder"
        visibleTitle="Hide builder"
        name="Timeline Builder"
        onClick={() => setCollapsed(!collapsed)}
      />
      <HelpText />
      {definitions.map((d, idx) => (
        <div key={idx} className="timeline-builder__slot">
          <TimeSlotBuilder
            definition={d}
            onChange={(def) => updateDefinition(idx, def)}
            readonly={readonly}
          />
          <div className="timeline-builder__buttons">
            <Button
              primary
              disabled={readonly || idx == 0}
              onClick={() => moveUp(idx)}
            >
              <ChevronsUp />
              Move up
            </Button>
            <Button
              primary
              disabled={readonly || idx == definitions.length - 1}
              onClick={() => moveDown(idx)}
            >
              <ChevronsDown />
              Move down
            </Button>
            <Button
              primary
              disabled={readonly}
              onClick={() => removeDefinition(idx)}
            >
              <Trash />
              Remove
            </Button>
          </div>
        </div>
      ))}
      <Button
        primary
        disabled={readonly}
        onClick={() =>
          setDefinitions([...definitions, buildDefaultDefinition()])
        }
      >
        <Plus />
        Add
      </Button>
    </div>
  );
};
