import * as React from 'react';
import {
  Box,
  Dialog,
  FormLabel,
  DialogContent,
  IconButton,
  DialogTitle,
  Typography,
  WithStyles,
  withStyles,
  createStyles,
  Theme,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { TextFieldCenteredPlaceholder } from '../helpers/base-components/textFieldCenteredPlaceholder';

export type AddCustomStyleResult = AddCustomStyleCancelled | AddCustomStyle;
interface AddCustomStyleCancelled {
  cancelled: true;
}

interface AddCustomStyle {
  cancelled: false;
  styleName: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = (theme: Theme) => {
  return createStyles({
    addIcon: {
      '&:not(.Mui-disabled)': {
        color: theme.palette.success.main,
      },
    },
    cancelIcon: {
      '&:not(.Mui-disabled)': {
        color: theme.palette.error.light,
      },
    },
  });
};

export interface AddCustomStyleProps extends WithStyles<typeof styles> {
  existingStyleNames: string[];
  result: (result: AddCustomStyleResult) => void;
}
export interface AddCustomStyleState {
  errorMessage: string | undefined;
  canSubmit: boolean;
  styleName: string;
}

export const AddCustomStyle = withStyles(styles)(
  class extends React.Component<AddCustomStyleProps, AddCustomStyleState> {
    constructor(props: AddCustomStyleProps) {
      super(props);
      this.state = {
        canSubmit: false,
        styleName: '',
        errorMessage: undefined,
      };
    }

    styleNameChanged = (styleName: string): void => {
      const { existingStyleNames } = this.props;
      if (existingStyleNames.indexOf(styleName) !== -1) {
        this.setState({
          styleName,
          errorMessage: 'Existing style name',
          canSubmit: false,
        });
      } else if (styleName.length > 0) {
        this.setState({
          styleName,
          errorMessage: undefined,
          canSubmit: true,
        });
      } else {
        this.setState({
          styleName,
          errorMessage: undefined,
          canSubmit: false,
        });
      }
    };

    submit = (): void => {
      const { result } = this.props;
      const { styleName } = this.state;
      result({ cancelled: false, styleName });
    };

    cancel = (): void => {
      const { result } = this.props;
      result({ cancelled: true });
    };

    render(): JSX.Element {
      const { styleName, errorMessage, canSubmit } = this.state;
      const { classes } = this.props;
      return (
        <Dialog open>
          <DialogTitle disableTypography>
            <Typography align="center" variant="h6">
              Custom Style
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <TextFieldCenteredPlaceholder
              placeholder="name"
              value={styleName}
              onChange={(evt): void => this.styleNameChanged(evt.target.value)}
              InputLabelProps={{
                style: {
                  color: 'gray',
                },
              }}
            />
            <Box mt="10px">
              {errorMessage && <FormLabel error>{errorMessage}</FormLabel>}
            </Box>
          </DialogContent>
          <DialogContent dividers>
            <Box display="flex">
              <Box flexGrow={1} justifyContent="center" alignItems="center">
                <div style={{ width: '2em', margin: 'auto' }}>
                  <IconButton
                    className={classes.addIcon}
                    disabled={!canSubmit}
                    edge="start"
                    onClick={this.submit}
                  >
                    <AddCircleIcon />
                  </IconButton>
                </div>
              </Box>
              <Box flexGrow={1} justifyContent="center" alignItems="center">
                <div style={{ width: '2em', margin: 'auto' }}>
                  <IconButton
                    className={classes.cancelIcon}
                    onClick={this.cancel}
                  >
                    <CancelIcon />
                  </IconButton>
                </div>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      );
    }
  }
);
