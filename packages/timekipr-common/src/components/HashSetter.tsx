import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Clipboard, Upload } from "react-feather";

export interface Props {
  hash: string;
  onHashLoad: (value: string) => void;
}

export const HashSetter = ({ hash, onHashLoad }: Props) => {
  const [localHash, setLocalHash] = useState(hash);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setLocalHash(hash);
  }, [hash]);

  return (
    <div className={`hash-setter ${collapsed ? "hash-setter--collapsed" : ""}`}>
      <div className="hash-setter__title">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hash-setter__collapseIcon"
          title={collapsed ? "Show share section" : "Hide share section"}
        >
          {!collapsed ? <ChevronDown /> : <ChevronUp />}
          Share
        </button>
      </div>
      <input
        className="hash-setter__input"
        type="text"
        value={localHash}
        onChange={(e) => setLocalHash(e.target.value)}
      />
      <button onClick={() => navigator.clipboard.writeText(localHash)}>
        <Clipboard />
        Copy
      </button>
      <button onClick={() => onHashLoad(localHash)}>
        <Upload />
        Load
      </button>
    </div>
  );
};
