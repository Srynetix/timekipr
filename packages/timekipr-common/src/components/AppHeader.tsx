import clsx from "clsx";
import logo from "../assets/icon.png";
import { APP_PROJECT_URL, APP_VERSION } from "../constants";

export interface Props {
  animated: boolean;
}

export const AppHeader = ({ animated }: Props) => (
  <div className={clsx("app-header", { "app-header--animated": animated })}>
    <div className="app-header__logo">
      <img src={logo} alt="logo" />
    </div>
    <div className="app-header__title-version">
      <div className="app-header__title">timekipr</div>
      <div className="app-header__version">
        <a href={APP_PROJECT_URL} target="_blank">
          {APP_VERSION}
        </a>
      </div>
    </div>
  </div>
);
