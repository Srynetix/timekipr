import { ReactNode } from "react";

export interface Props {
  children: ReactNode;
}

export const InlineHelp = ({ children }: Props) => (
  <div className="inline-help">{children}</div>
);
