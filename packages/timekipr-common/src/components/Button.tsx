import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  inline?: boolean;
}

export const Button = ({ primary, inline, className, ...props }: Props) => (
  <button
    className={clsx("app-button", {
      "app-button--primary": primary ?? false,
      "app-button--inline": inline ?? false,
      [className || ""]: className,
    })}
    {...props}
  />
);
