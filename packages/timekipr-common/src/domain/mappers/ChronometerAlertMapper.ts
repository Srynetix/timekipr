import { ChronometerAlert } from "../ChronometerAlert";
import {
  Duration,
  DurationProps,
  DurationViewDTO,
} from "../value_objects/Duration";

export interface ChronometerAlertStorageDTO {
  remainingTimeSeconds: number;
  shown: boolean;
}

export interface ChronometerAlertViewDTO {
  remainingTime: DurationViewDTO;
  shown: boolean;
}

export interface ChronometerAlertDefinition {
  remainingTime: DurationProps;
}

export class ChronometerAlertMapper {
  toStorage(alert: ChronometerAlert): ChronometerAlertStorageDTO {
    return {
      remainingTimeSeconds: alert.remainingTime.seconds,
      shown: alert.shown,
    };
  }

  fromDefinition(definition: ChronometerAlertDefinition): ChronometerAlert {
    return ChronometerAlert.buildFromProps({
      remainingTime: Duration.fromProps(definition.remainingTime),
      shown: false,
    });
  }

  fromStorage(dto: ChronometerAlertStorageDTO): ChronometerAlert {
    return ChronometerAlert.buildFromProps({
      remainingTime: Duration.fromSeconds(dto.remainingTimeSeconds),
      shown: dto.shown,
    });
  }

  toView(alert: ChronometerAlert): ChronometerAlertViewDTO {
    return {
      remainingTime: alert.remainingTime.toViewDTO(),
      shown: alert.shown,
    };
  }
}
