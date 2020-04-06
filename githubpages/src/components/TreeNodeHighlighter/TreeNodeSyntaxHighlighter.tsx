import * as React from 'react';
import { TreeView } from '@material-ui/lab';
import {
  treeViewRendererWrapLinesRenderer,
  treeViewRenderer,
} from '../helpers/syntax-highlighter-helpers/treeViewRenderer';
import { SyntaxHighlighter } from '../SyntaxHighlighter';

export function TreeViewCodeTag({
  children,
}: {
  children: React.ReactNode[];
}): JSX.Element | null {
  if (children.length === 0) {
    return null;
  }
  return <TreeView>{children}</TreeView>;
}

export interface TreeNodeSyntaxHighlighterProps {
  wrapLines: boolean;
  language: string;
  style: object | null;
  code: string;
  isPrism: boolean;
}
export class TreeNodeSyntaxHighlighter extends React.Component<
  TreeNodeSyntaxHighlighterProps
> {
  getStyle(): object | undefined {
    const { style } = this.props;
    return style || undefined;
  }

  render(): JSX.Element {
    const { isPrism, wrapLines, language, code } = this.props;
    return (
      <SyntaxHighlighter
        isPrism={isPrism}
        PreTag="div"
        CodeTag={TreeViewCodeTag}
        wrapLines={wrapLines}
        language={language}
        style={this.getStyle()}
        renderer={
          wrapLines ? treeViewRendererWrapLinesRenderer : treeViewRenderer
        }
      >
        {code}
      </SyntaxHighlighter>
    );
  }
}
