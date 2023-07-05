import { useState } from "react";
import { Clipboard, Share2, Upload } from "react-feather";
import { CollapsibleTitle } from "../CollapsibleTitle";
import { InlineHelp } from "../InlineHelp";
import { Button } from "../Button";
import { loadHash } from "../../utils/hash";

export interface Props {
  hash: string;
  onHashLoad: (value: string) => void;
  readonly: boolean;
}

export const HashSetter = ({ hash, onHashLoad, readonly }: Props) => {
  const [localHash, setLocalHash] = useState(hash);
  const [collapsed, setCollapsed] = useState(true);
  const [previousHash, setPreviousHash] = useState(hash);

  if (previousHash !== hash) {
    setPreviousHash(hash);
    setLocalHash(hash);
  }

  return (
    <div className={`hash-setter ${collapsed ? "hash-setter--collapsed" : ""}`}>
      <CollapsibleTitle
        leftIcon={<Share2 />}
        collapsed={collapsed}
        collapsedTitle="Show share section"
        visibleTitle="Hide share section"
        name="Share"
        onClick={() => setCollapsed(!collapsed)}
      />
      <InlineHelp>
        <p>
          The hash below represents a specific timeline build. It is
          automatically updated at each timeline build change. You can also
          specify a value manually.
        </p>
        <p>
          Use the{" "}
          <Button primary inline>
            <Clipboard />
            Copy
          </Button>{" "}
          button to copy the hash to your clipboard.
        </p>
        <p>
          Use the{" "}
          <Button primary inline>
            <Upload />
            Load
          </Button>{" "}
          button to load the hash stored in the input box.
        </p>
      </InlineHelp>
      <input
        className="hash-setter__input"
        disabled={readonly}
        type="text"
        value={localHash}
        onChange={(e) => setLocalHash(e.target.value)}
      />
      <div className="hash-setter__buttons">
        <Button
          primary
          onClick={() => navigator.clipboard.writeText(localHash)}
        >
          <Clipboard />
          Copy
        </Button>
        <Button
          primary
          disabled={readonly}
          onClick={() => onHashLoad(localHash)}
        >
          <Upload />
          Load
        </Button>
      </div>
      <div className="hash-setter__debug">
        <b>Debug</b>
        <code>{JSON.stringify(loadHash(localHash))}</code>
      </div>
    </div>
  );
};
