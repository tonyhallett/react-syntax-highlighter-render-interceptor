import React from 'react';
import { Paper, Box } from '@material-ui/core';

export function SmallElevationPaddedPaper({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <Paper elevation={1}>
      <Box p={1}>{children}</Box>
    </Paper>
  );
}
