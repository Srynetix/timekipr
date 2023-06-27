import { SHOW_NOTIFICATIONS } from "../constants";
import { Chronometer } from "./Chronometer";
import { Duration } from "./value_objects/Duration";
import { Option } from "../functional";

export interface ChronometerTimelineProps {
  chronometers: Chronometer[];
  currentChronometerIndex: number;
  started: boolean;
}

export class ChronometerTimeline {
  props: ChronometerTimelineProps;

  private constructor(props: ChronometerTimelineProps) {
    this.props = props;
  }

  bindChronometersEvents() {
    this.props.chronometers.forEach((c) => {
      c.connectOnFinished(this.sendFinishedNotification.bind(this));
      c.connectOnAlert(this.sendAlertNotification.bind(this));
    });
  }

  static buildDefault() {
    const timeline = new ChronometerTimeline({
      chronometers: [],
      currentChronometerIndex: 0,
      started: false,
    });
    timeline.bindChronometersEvents();
    return timeline;
  }

  static buildFromProps(props: ChronometerTimelineProps) {
    const timeline = new ChronometerTimeline(props);
    timeline.bindChronometersEvents();
    return timeline;
  }

  sendAlertNotification(chronometer: Chronometer, remainingSeconds: number) {
    if (SHOW_NOTIFICATIONS && Notification.permission == "granted") {
      const remaining = Duration.fromSeconds(remainingSeconds);
      let message = `Only ${remaining.toHumanReadableString()} left for "${
        chronometer.name
      }"`;

      if (
        this.props.currentChronometerIndex + 1 !=
        this.props.chronometers.length
      ) {
        message += `, next "${
          this.props.chronometers[this.props.currentChronometerIndex + 1].name
        }"`;
      }

      new Notification(message);
    }
  }

  sendFinishedNotification(chronometer: Chronometer) {
    if (SHOW_NOTIFICATIONS && Notification.permission == "granted") {
      let message = `Time's up! "${chronometer.name}" ended`;

      if (
        this.props.currentChronometerIndex + 1 !=
        this.props.chronometers.length
      ) {
        message += `, next "${
          this.props.chronometers[this.props.currentChronometerIndex + 1].name
        }"`;
      }

      new Notification(message);
    }
  }

  get chronometers(): Chronometer[] {
    return this.props.chronometers;
  }

  get currentChronometer(): Option<Chronometer> {
    if (this.props.chronometers.length > 0) {
      return Option.buildSome(
        this.props.chronometers[this.props.currentChronometerIndex]
      );
    }

    return Option.buildNone();
  }

  startTimeline() {
    this.props.started = true;
    this.currentChronometer.unwrap().startChronometer();
  }

  get started(): boolean {
    return this.props.started;
  }

  get currentChronometerIndex(): number {
    return this.props.currentChronometerIndex;
  }

  get finished(): boolean {
    return (
      this.props.currentChronometerIndex ==
        this.props.chronometers.length - 1 &&
      this.currentChronometer.map((c) => c.finished).unwrapOrElse(() => false)
    );
  }

  get totalTimeLimit(): Duration {
    return Duration.fromSeconds(
      this.props.chronometers
        .map((c) => c.timeLimit.seconds)
        .reduce((acc, x) => acc + x, 0)
    );
  }

  get totalElapsedTime(): Duration {
    return Duration.fromSeconds(
      this.props.chronometers
        .map((c) => c.elapsedTime.seconds)
        .reduce((acc, x) => acc + x, 0)
    );
  }

  get deltaValue(): Duration {
    return Duration.fromSeconds(
      this.props.chronometers
        .map((c) => c.deltaValue.seconds)
        .reduce((acc, x) => acc + x, 0)
    );
  }

  tick(now: Date) {
    if (
      this.finished ||
      this.props.chronometers.length == 0 ||
      !this.currentChronometer.unwrap().started
    ) {
      return;
    }

    this.currentChronometer.unwrap().tick(now);

    if (this.finished) {
      return;
    } else if (this.currentChronometer.unwrap().finished) {
      // Start next one!
      this.props.currentChronometerIndex += 1;
      this.currentChronometer.unwrap().startChronometer();
    }
  }
}
