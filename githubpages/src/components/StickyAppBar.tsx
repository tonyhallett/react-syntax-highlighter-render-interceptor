import { AppBar, makeStyles } from '@material-ui/core';
import React from 'react';

export const appBarStyles = makeStyles((theme) => ({
  appBar: {
    marginBottom: theme.spacing(),
  },
}));

export function StickyAppBar({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const styles = appBarStyles();
  return (
    <AppBar className={styles.appBar} position="sticky">
      {children}
    </AppBar>
  );
}
