import { createMuiTheme } from '@material-ui/core';
import orange from '@material-ui/core/colors/orange';
import yellow from '@material-ui/core/colors/yellow';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

export const theme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: yellow,
  },
});
theme.overrides = {
  MuiTooltip: {
    tooltip: {
      padding: '10px 15px',
      minWidth: '130px',
      color: theme.palette.common.white,
      lineHeight: '1.7em',
      background: fade(theme.palette.grey[900], 0.9),
      border: 'none',
      borderRadius: '3px',
      boxShadow: `0 8px 10px 1px ${fade(
        theme.palette.common.black,
        0.14
      )}, 0 3px 14px 2px ${fade(
        theme.palette.common.black,
        0.12
      )}, 0 5px 5px -3px ${fade(theme.palette.common.black, 0.2)}`,
      maxWidth: '200px',
      textAlign: 'center',
      fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
      fontSize: '0.875em',
      fontStyle: 'normal',
      fontWeight: 400,
      textShadow: 'none',
      textTransform: 'none',
      letterSpacing: 'normal',
      wordBreak: 'normal',
      wordSpacing: 'normal',
      wordWrap: 'normal',
      whiteSpace: 'normal',
      lineBreak: 'auto',
    } as CSSProperties,
  },
};
