import * as React from 'react';
import { Box, Typography } from '@material-ui/core';
import { TreeNodeSyntaxHighlighter } from './TreeNodeSyntaxHighlighter';
import { CopyNodesToClipboard } from '../helpers/base-components/copy-to-clipboard/CopyNodesToClipboard';
import { SubAppBar, SubToolbar } from '../helpers/base-components/SubAppBar';

export interface ClipboardTreeNodeSyntaxHighlighterProps {
  wrapLines: boolean;
  language: string | null;
  style: object | null;
  code: string;
  isPrism: boolean;
}

export const ClipboardTreeNodeSyntaxHighlighter = ({
  isPrism,
  style,
  code,
  language,
  wrapLines,
}: ClipboardTreeNodeSyntaxHighlighterProps): JSX.Element => {
  return (
    <>
      <SubAppBar>
        <SubToolbar>
          <Typography>{isPrism ? 'Prism' : 'Hljs'}</Typography>
          <CopyNodesToClipboard
            disabled={!language}
            code={code}
            language={language}
            wrapLines={wrapLines}
            isPrism={isPrism}
          />
        </SubToolbar>
      </SubAppBar>

      {language && (
        <Box mt={1}>
          <TreeNodeSyntaxHighlighter
            isPrism={isPrism}
            code={code}
            wrapLines={wrapLines}
            language={language}
            style={style}
          />
        </Box>
      )}
    </>
  );
};
