import * as React from 'react';
import { Prism, Light, SyntaxHighlighterProps } from 'react-syntax-highlighter';

type HighlighterProps = {
  isPrism: boolean;
  children: string;
} & SyntaxHighlighterProps;
export const SyntaxHighlighter = (props: HighlighterProps): JSX.Element => {
  const { isPrism, children, ...other } = props;
  const Highlighter = isPrism ? Prism : Light;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Highlighter {...other}>{children}</Highlighter>;
};
