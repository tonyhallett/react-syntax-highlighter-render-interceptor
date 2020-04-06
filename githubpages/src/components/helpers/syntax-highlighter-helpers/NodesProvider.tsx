import { Prism, Light } from 'react-syntax-highlighter';
import * as React from 'react';
import { RenderNode, CustomRendererDetails } from '../../../../../dist';

export interface NodesProviderProps {
  language: string | null;
  code: string;
  wrapLines: boolean;
  nodes: (prismNodes: RenderNode[]) => void;
  isPrism: boolean;
}
function HiddenSpan(): JSX.Element {
  return <span style={{ display: 'none' }} />;
}
export class NodesProvider extends React.Component<NodesProviderProps> {
  customRenderer = (details: CustomRendererDetails): void => {
    const { nodes } = this.props;
    nodes(details.rows);
  };

  render(): false | JSX.Element {
    const { isPrism, language, wrapLines, code } = this.props;
    const SyntaxHighlighter = isPrism ? Prism : Light;
    return (
      language !== null && (
        <SyntaxHighlighter
          PreTag={HiddenSpan}
          CodeTag={HiddenSpan}
          language={language}
          wrapLines={wrapLines}
          renderer={this.customRenderer}
        >
          {code}
        </SyntaxHighlighter>
      )
    );
  }
}
