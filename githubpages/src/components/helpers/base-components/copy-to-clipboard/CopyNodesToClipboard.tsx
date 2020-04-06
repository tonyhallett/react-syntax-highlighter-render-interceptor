import * as React from 'react';
import { RenderNode } from '../../../../../../dist';
import { NodesProvider } from '../../syntax-highlighter-helpers/NodesProvider';
import { CopyToClipboardWithIcon } from './CopyToClipboardWithIcon';

export interface CopyNodesToClipboardProps {
  language: string | null;
  code: string;
  wrapLines: boolean;
  isPrism: boolean;
  disabled?: boolean;
}
export class CopyNodesToClipboard extends React.Component<
  CopyNodesToClipboardProps
> {
  nodes: RenderNode[] | undefined;

  getValue = (): RenderNode[] | undefined => {
    return this.nodes;
  };

  render(): JSX.Element {
    const { code, language, wrapLines, isPrism, disabled } = this.props;
    return (
      <>
        <NodesProvider
          code={code}
          language={language}
          wrapLines={wrapLines}
          nodes={(nodes): void => {
            this.nodes = nodes;
          }}
          isPrism={isPrism}
        />
        <CopyToClipboardWithIcon
          disabled={disabled}
          tooltipPlacement="right"
          value={this.getValue}
        />
      </>
    );
  }
}
