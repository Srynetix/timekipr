import { TimeSlotBuilder } from "./TimeSlotBuilder";
import { useState } from "react";
import {
  Box,
  ChevronsDown,
  ChevronsUp,
  Copy,
  Plus,
  Trash,
} from "react-feather";
import { Button } from "../Button";
import { CollapsibleTitle } from "../CollapsibleTitle";
import {
  immutableArrayInsert,
  immutableArrayInsertN,
  immutableArrayMoveIndex,
  immutableArrayRemove,
} from "../../utils/immutableCollections";
import { InlineHelp } from "../InlineHelp";
import { ChronometerDefinition } from "../../domain/mappers/ChronometerMapper";
import { ChronometerTimelineDefinition } from "../../domain/mappers/ChronometerTimelineMapper";
import { buildDefaultChronometerDefinition } from "../../domain/builders";

export interface Props {
  definition: ChronometerTimelineDefinition;
  setDefinition: (definition: ChronometerTimelineDefinition) => void;
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
      buttons, duplicate slots using the{" "}
      <Button primary inline>
        <Copy />
        Duplicate
      </Button>{" "}
      button, and remove slots using the{" "}
      <Button primary inline>
        <Trash />
        Remove
      </Button>{" "}
      button.
    </p>
  </InlineHelp>
);

export const TimelineBuilder = ({
  definition,
  setDefinition,
  readonly,
}: Props) => {
  const [collapsed, setCollapsed] = useState(true);

  const updateDefinition = (index: number, value: ChronometerDefinition) => {
    setDefinition({
      ...definition,
      chronometers: immutableArrayInsert(definition.chronometers, index, value),
    });
  };

  const removeDefinition = (index: number) => {
    setDefinition({
      ...definition,
      chronometers: immutableArrayRemove(definition.chronometers, index),
    });
  };

  const duplicateDefinition = (index: number) => {
    setDefinition({
      ...definition,
      chronometers: immutableArrayInsertN(definition.chronometers, index, [
        { ...definition.chronometers[index] },
        { ...definition.chronometers[index] },
      ]),
    });
  };

  const moveUp = (index: number) => {
    if (index == 0) {
      return;
    }

    setDefinition({
      ...definition,
      chronometers: immutableArrayMoveIndex(
        definition.chronometers,
        index,
        index - 1
      ),
    });
  };

  const moveDown = (index: number) => {
    if (index == definition.chronometers.length - 1) {
      return;
    }

    setDefinition({
      ...definition,
      chronometers: immutableArrayMoveIndex(
        definition.chronometers,
        index,
        index + 1
      ),
    });
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
      {definition.chronometers.map((d, idx) => (
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
              disabled={readonly || idx == definition.chronometers.length - 1}
              onClick={() => moveDown(idx)}
            >
              <ChevronsDown />
              Move down
            </Button>
            <Button
              primary
              disabled={readonly}
              onClick={() => duplicateDefinition(idx)}
            >
              <Copy />
              Duplicate
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
          setDefinition({
            ...definition,
            chronometers: [
              ...definition.chronometers,
              buildDefaultChronometerDefinition(),
            ],
          })
        }
      >
        <Plus />
        Add
      </Button>
    </div>
  );
};
