import * as React from 'react';
import {
  Autocomplete,
  AutocompleteProps,
  UseAutocompleteSingleProps,
} from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    width: '300px',
    flexGrow: 1,
  },
});
export function SmallSingleAutoComplete<T>(
  props: AutocompleteProps<T> & UseAutocompleteSingleProps<T>
): JSX.Element {
  const classes = useStyles();
  const { className, ...other } = props;
  return (
    <Autocomplete
      className={clsx(classes.root, className)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
      multiple={false}
    />
  );
}
