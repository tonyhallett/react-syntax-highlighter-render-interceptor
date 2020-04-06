import * as React from 'react';
import { styled, Box } from '@material-ui/core';
import { ClipboardTreeNodeSyntaxHighlighter } from './ClipboardTreeNodeSyntaxHighlighter';
import { FlexedHighlighters } from '../helpers/base-components/FlexedHighlighters';

const StyledBox = styled(Box)((props) => ({
  [props.theme.breakpoints.down('xs')]: {
    minWidth: '400px',
  },
}));

export interface LanguageStyle {
  language: string | null;
  style: object | null;
}
export interface HighlightersProps {
  wrapLines: boolean;
  code: string;
  prism: LanguageStyle;
  hljs: LanguageStyle;
}

/* export class TreeNodeHighlighters extends React.Component<HighlightersProps> {
  render():JSX.Element {
    const {code, prism,hljs, wrapLines} = this.props;
    return (
      <FlexedHighlighters
        StyledBox={StyledBox}
        prism={
          <ClipboardTreeNodeSyntaxHighlighter
            code={code}
            isPrism
            language={prism.language}
            style={prism.style}
            wrapLines={wrapLines}
          />
        }
        hljs={
          <ClipboardTreeNodeSyntaxHighlighter
            code={code}
            isPrism={false}
            language={hljs.language}
            style={hljs.style}
            wrapLines={wrapLines}
          />
        }
      />
    );
  }
} */

export const TreeNodeHighlighters = ({
  code,
  prism,
  hljs,
  wrapLines,
}: HighlightersProps): JSX.Element => {
  return (
    <FlexedHighlighters
      StyledBox={StyledBox}
      prism={
        <ClipboardTreeNodeSyntaxHighlighter
          code={code}
          isPrism
          language={prism.language}
          style={prism.style}
          wrapLines={wrapLines}
        />
      }
      hljs={
        <ClipboardTreeNodeSyntaxHighlighter
          code={code}
          isPrism={false}
          language={hljs.language}
          style={hljs.style}
          wrapLines={wrapLines}
        />
      }
    />
  );
};
