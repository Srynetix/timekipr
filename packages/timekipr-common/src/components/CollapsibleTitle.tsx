import { Button } from "./Button";
import { ChevronDown, ChevronUp } from "react-feather";

export interface Props {
  leftIcon: JSX.Element;
  name: string;
  collapsed?: boolean;
  showRightIcon?: boolean;
  onClick?: () => void;
  collapsedTitle?: string;
  visibleTitle?: string;
}

interface ChevronProps {
  collapsed: boolean;
  visible: boolean;
}

const ChevronIcon = ({ collapsed, visible }: ChevronProps) => {
  const opacity = visible ? 1 : 0;

  return collapsed ?? true ? (
    <ChevronDown opacity={opacity} />
  ) : (
    <ChevronUp opacity={opacity} />
  );
};

export const CollapsibleTitle = ({
  leftIcon,
  name,
  collapsedTitle,
  visibleTitle,
  showRightIcon,
  collapsed,
  onClick,
}: Props) => {
  return (
    <div className="collapsible-title">
      <Button
        onClick={() => onClick && onClick()}
        title={collapsed ? collapsedTitle ?? "Show" : visibleTitle ?? "Hide"}
      >
        {leftIcon}

        <div className="collapsible-title__chevron-group">
          {name}
          <ChevronIcon
            collapsed={collapsed ?? true}
            visible={showRightIcon ?? true}
          />
        </div>
      </Button>
    </div>
  );
};
