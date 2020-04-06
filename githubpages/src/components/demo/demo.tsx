import { ThemeProvider, CssBaseline } from '@material-ui/core';
import React from 'react';
import { theme } from '../../theme';
import { ThemedScrollbar } from '../ThemedScrollbar';
import { DemoThemed } from './themedDemo';

export function Demo(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <ThemedScrollbar>
          <DemoThemed />
        </ThemedScrollbar>
      </CssBaseline>
    </ThemeProvider>
  );
}
