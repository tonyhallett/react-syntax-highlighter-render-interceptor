import React from 'react';
import {
  withStyles,
  Typography,
  IconButton,
  DialogTitle,
  WithStyles,
  DialogTitleProps,
  TypographyTypeMap,
  createStyles,
  Theme,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(),
      top: theme.spacing(),
      color: theme.palette.grey[900],
    },
  });
export type DialogTitleWithCloseClasses = WithStyles<typeof styles>;
export type DialogTitleWithCloseProps = DialogTitleWithCloseClasses &
  DialogTitleProps & {
    onClose?: () => void;
    preComponent?: React.ReactNode;
    postComponent?: React.ReactNode;
    titleAlign?: TypographyTypeMap['props']['align'];
  };
export const DialogTitleWithClose = withStyles(styles)(
  (props: DialogTitleWithCloseProps) => {
    const {
      children,
      classes,
      onClose,
      preComponent,
      postComponent,
      titleAlign,
      ...other
    } = props;
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <DialogTitle disableTypography className={classes.root} {...other}>
        {preComponent && preComponent}
        <Typography align={titleAlign || 'left'} variant="h6">
          {children}
        </Typography>
        {postComponent && postComponent}
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }
);
