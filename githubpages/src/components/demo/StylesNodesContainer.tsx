import { Box, Paper, Grow } from '@material-ui/core';
import React from 'react';

export function StylesNodesContainer({
  children,
  show,
}: {
  children: React.ReactNode;
  show: boolean;
}): JSX.Element {
  return (
    <Grow in={show} mountOnEnter unmountOnExit>
      <Box mx={1}>
        <Paper elevation={3}>
          <Box p={1}>{children}</Box>
        </Paper>
      </Box>
    </Grow>
  );
}
