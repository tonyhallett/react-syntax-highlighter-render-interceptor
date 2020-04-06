import * as React from 'react';
import { Box, Paper, BoxProps } from '@material-ui/core';

export function FlexedHighlighters({
  StyledBox,
  hljs,
  prism,
}: {
  prism: React.ReactNode;
  hljs: React.ReactNode;
  StyledBox: React.ComponentType<BoxProps>;
}): JSX.Element {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      <StyledBox p={1} flexGrow={1} flexBasis={0} flexShrink={1}>
        <Paper elevation={1}>
          <Box p={1}>{prism}</Box>
        </Paper>
      </StyledBox>
      <StyledBox p={1} flexGrow={1} flexBasis={0} flexShrink={1}>
        <Paper elevation={1}>
          <Box p={1}>{hljs}</Box>
        </Paper>
      </StyledBox>
    </Box>
  );
}
