import { Option } from "../../functional";
import { Chronometer } from "../Chronometer";
import {
  Duration,
  DurationProps,
  DurationStorageDTO,
  DurationViewDTO,
} from "../value_objects/Duration";
import {
  ChronometerAlertDefinition,
  ChronometerAlertMapper,
  ChronometerAlertStorageDTO,
  ChronometerAlertViewDTO,
} from "./ChronometerAlertMapper";

export interface DateStorageDTO {
  dateString: string;
}

export interface ChronometerStorageDTO {
  name: string;
  timeLimit: DurationStorageDTO;
  alerts: ChronometerAlertStorageDTO[];
  timeOutPassed: boolean;
  lastUpdatedAt: DateStorageDTO | null;
  startedAt: DateStorageDTO | null;
  finishedAt: DateStorageDTO | null;
}

export interface ChronometerViewDTO {
  name: string;
  elapsedTime: DurationViewDTO;
  timeLimit: DurationViewDTO;
  deltaValue: DurationViewDTO;
  progressPercentage: number;
  alerts: ChronometerAlertViewDTO[];
  timeOutPassed: boolean;
  started: boolean;
  finished: boolean;
  startedAt: Date | null;
  finishedAt: Date | null;
}

export interface ChronometerDefinition {
  name: string;
  timeLimit: DurationProps;
  alerts: ChronometerAlertDefinition[];
}

export class ChronometerMapper {
  private alertMapper: ChronometerAlertMapper;

  constructor(alertMapper?: ChronometerAlertMapper) {
    this.alertMapper = alertMapper ?? new ChronometerAlertMapper();
  }

  toStorage(chronometer: Chronometer): ChronometerStorageDTO {
    return {
      name: chronometer.name,
      timeLimit: { milliseconds: chronometer.timeLimit.milliseconds },
      alerts: chronometer.alerts.map((a) => this.alertMapper.toStorage(a)),
      timeOutPassed: chronometer.timeOutPassed,
      lastUpdatedAt: chronometer.lastUpdatedAt
        .map((d) => d.toISOString())
        .map((d) => ({ dateString: d }))
        .toNullable(),
      startedAt: chronometer.startedAt
        .map((d) => d.toISOString())
        .map((d) => ({ dateString: d }))
        .toNullable(),
      finishedAt: chronometer.finishedAt
        .map((d) => d.toISOString())
        .map((d) => ({ dateString: d }))
        .toNullable(),
    };
  }

  fromStorage(dto: ChronometerStorageDTO): Chronometer {
    return Chronometer.buildFromProps({
      alerts: dto.alerts.map((a) => this.alertMapper.fromStorage(a)),
      startedAt: Option.fromNullable(dto.startedAt).map(
        (d) => new Date(d.dateString)
      ),
      finishedAt: Option.fromNullable(dto.finishedAt).map(
        (d) => new Date(d.dateString)
      ),
      lastUpdatedAt: Option.fromNullable(dto.lastUpdatedAt).map(
        (d) => new Date(d.dateString)
      ),
      name: dto.name,
      timeLimit: Duration.fromMilliseconds(dto.timeLimit.milliseconds),
      timeOutPassed: dto.timeOutPassed,
    });
  }

  toView(chronometer: Chronometer): ChronometerViewDTO {
    return {
      name: chronometer.name,
      elapsedTime: chronometer.elapsedTime.toViewDTO(),
      timeLimit: chronometer.timeLimit.toViewDTO(),
      deltaValue: chronometer.deltaValue.toViewDTO(),
      progressPercentage: chronometer.progress,
      alerts: chronometer.alerts.map((a) => this.alertMapper.toView(a)),
      timeOutPassed: chronometer.timeOutPassed,
      startedAt: chronometer.startedAt.toNullable(),
      finishedAt: chronometer.finishedAt.toNullable(),
      started: chronometer.started,
      finished: chronometer.finished,
    };
  }
}
