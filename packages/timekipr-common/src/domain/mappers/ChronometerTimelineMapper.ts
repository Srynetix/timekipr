import { ChronometerTimeline } from "../ChronometerTimeline";
import { DurationViewDTO } from "../value_objects/Duration";
import {
  ChronometerViewDTO,
  ChronometerDefinition,
  ChronometerMapper,
  ChronometerStorageDTO,
} from "./ChronometerMapper";

export interface ChronometerTimelineStorageDTO {
  chronometers: ChronometerStorageDTO[];
  currentChronometerIndex: number;
  started: boolean;
}

export interface ChronometerTimelineViewDTO {
  chronometers: ChronometerViewDTO[];
  currentChronometer: ChronometerViewDTO | null;
  currentChronometerIndex: number;
  totalElapsedTime: DurationViewDTO;
  totalTimeLimit: DurationViewDTO;
  totalDeltaValue: DurationViewDTO;
  started: boolean;
  finished: boolean;
}

export interface ChronometerTimelineDefinition {
  chronometers: ChronometerDefinition[];
}

export class ChronometerTimelineMapper {
  private chronometerMapper: ChronometerMapper;

  constructor(chronometerMapper?: ChronometerMapper) {
    this.chronometerMapper = chronometerMapper ?? new ChronometerMapper();
  }

  toStorage(
    chronometerTimeline: ChronometerTimeline
  ): ChronometerTimelineStorageDTO {
    return {
      chronometers: chronometerTimeline.chronometers.map((c) =>
        this.chronometerMapper.toStorage(c)
      ),
      currentChronometerIndex: chronometerTimeline.currentChronometerIndex,
      started: chronometerTimeline.started,
    };
  }

  fromStorage(dto: ChronometerTimelineStorageDTO): ChronometerTimeline {
    return ChronometerTimeline.buildFromProps({
      chronometers: dto.chronometers.map((c) =>
        this.chronometerMapper.fromStorage(c)
      ),
      currentChronometerIndex: dto.currentChronometerIndex,
      started: dto.started,
    });
  }

  toView(chronometerTimeline: ChronometerTimeline): ChronometerTimelineViewDTO {
    return {
      chronometers: chronometerTimeline.chronometers.map((c) =>
        this.chronometerMapper.toView(c)
      ),
      currentChronometer: chronometerTimeline.currentChronometer
        .map((c) => this.chronometerMapper.toView(c))
        .toNullable(),
      currentChronometerIndex: chronometerTimeline.currentChronometerIndex,
      finished: chronometerTimeline.finished,
      totalDeltaValue: chronometerTimeline.deltaValue.toViewDTO(),
      totalElapsedTime: chronometerTimeline.totalElapsedTime.toViewDTO(),
      totalTimeLimit: chronometerTimeline.totalTimeLimit.toViewDTO(),
      started: chronometerTimeline.started,
    };
  }
}
