import {
  AppBar,
  makeStyles,
  createStyles,
  Theme,
  Toolbar,
} from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const useAppBarStyles = makeStyles((theme: Theme) => {
  const backgroundColor = lighten(theme.palette.secondary.light, 0.7);
  return createStyles({
    root: {
      paddingTop: theme.spacing(),
      paddingBottom: theme.spacing(),
      color: 'rgba(0,0,0,0.87)',
      backgroundColor,
    },
  });
});
const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiButtonBase-root:not(.Mui-disabled)': {
        color: theme.palette.primary.dark,
      },
    },
  })
);
export function SubAppBar({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const classes = useAppBarStyles();
  return (
    <AppBar
      elevation={0}
      className={classes.root}
      position="static"
      color="default"
    >
      {children}
    </AppBar>
  );
}
export function SubToolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  const classes = useToolbarStyles();
  return (
    <Toolbar className={clsx(classes.root, className)} variant="dense">
      {children}
    </Toolbar>
  );
}
