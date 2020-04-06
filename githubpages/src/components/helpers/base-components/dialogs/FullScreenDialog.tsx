import * as React from 'react';
import { Dialog, Slide, Divider } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import { DialogTitleWithClose } from './DialogTitle';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SlideUp: any = React.forwardRef(function Transition(
  props: TransitionProps,
  ref
) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Slide {...props} direction="up" ref={ref} />;
});

export const FullScreenDialog = (props: {
  open: boolean;
  close: () => void;
  transition: boolean;
  title: string;
  footer?: React.ReactNode;
  titlePreComponent?: React.ReactNode;
  titlePostComponent?: React.ReactNode;
  children: React.ReactNode;
}): JSX.Element => {
  const {
    open,
    close,
    transition,
    titlePostComponent,
    titlePreComponent,
    title,
    children,
    footer,
  } = props;
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={close}
      TransitionComponent={transition ? SlideUp : undefined}
    >
      <DialogTitleWithClose
        postComponent={titlePostComponent}
        preComponent={titlePreComponent}
        onClose={close}
      >
        {title}
      </DialogTitleWithClose>
      <Divider variant="middle" />

      {children}

      {footer && footer}
    </Dialog>
  );
};
