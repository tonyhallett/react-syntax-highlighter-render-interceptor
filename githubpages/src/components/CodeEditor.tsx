import * as React from 'react';
import {
  TextField,
  Theme,
  makeStyles,
  createStyles,
  Box,
  Paper,
} from '@material-ui/core';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const useStyles = makeStyles((theme: Theme) => {
  const backgroundColorHover = lighten(theme.palette.secondary.light, 0.7);
  return createStyles({
    textField: {
      padding: '99',
      backgroundColor: theme.palette.secondary.light,
      '&:hover': {
        backgroundColor: backgroundColorHover,
      },
      '& .MuiFilledInput-multiline': {
        padding: theme.spacing(),
      },
    },
    input: {
      backgroundColor: theme.palette.secondary.light,
      '&:hover': {
        backgroundColor: backgroundColorHover,
      },
    },
  });
});
export interface CodeEditorProps {
  show: boolean;
  code: string;
  codeChanged: (newCode: string) => void;
}
export function CodeEditor({
  code,
  codeChanged,
  show,
}: CodeEditorProps): JSX.Element {
  const styles = useStyles();
  return (
    <Box
      width={{ xs: '400px', sm: '500px' }}
      visibility={show ? 'visible' : 'hidden'}
    >
      <Paper>
        <Box p={1}>
          <TextField
            placeholder="Enter some code in the language of your choice"
            multiline
            rowsMax={12}
            fullWidth
            variant="filled"
            className={styles.textField}
            InputProps={{ className: styles.input }}
            value={code}
            onChange={(evt): void => codeChanged(evt.target.value)}
          />
        </Box>
      </Paper>
    </Box>
  );
}
