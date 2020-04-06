import React from 'react';
import { Dialog, PaperProps, DialogProps } from '@material-ui/core';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import {
  DialogTitleWithClose,
  DialogTitleWithCloseClasses,
} from '../DialogTitle';
import { createPaperComponent, DragIndicatorSpan } from './common';

export interface DraggableByIconCloseIconDialogProps {
  dialogProps: Omit<DialogProps, 'children'>;
  onClose?: () => void;
  children: React.ReactNode;
  id?: string;
  dragIndicatorIcon?: true;
  dragIndicatorClassName?: string;
  dialogTitleWithCloseClasses?: Partial<DialogTitleWithCloseClasses['classes']>;
  title: string;
}
export class DraggableByIconCloseIconDialog extends React.Component<
  DraggableByIconCloseIconDialogProps
> {
  static instances = 0;

  paperComponent: React.FunctionComponent<PaperProps>;

  draggableId: string;

  constructor(props: DraggableByIconCloseIconDialogProps) {
    super(props);
    this.draggableId = props.id
      ? props.id
      : `draggable-dialog-title${(DraggableByIconCloseIconDialog.instances += 1)}`;
    this.paperComponent = createPaperComponent(this.draggableId);
  }

  render(): JSX.Element {
    const {
      title,
      children,
      dragIndicatorIcon,
      dialogProps,
      onClose,
      dialogTitleWithCloseClasses,
      dragIndicatorClassName,
    } = this.props;
    const DragIcon = dragIndicatorIcon ? DragIndicatorIcon : DragHandleIcon;
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Dialog {...dialogProps} PaperComponent={this.paperComponent}>
        <DialogTitleWithClose
          titleAlign="center"
          onClose={onClose}
          classes={dialogTitleWithCloseClasses}
          preComponent={
            <DragIndicatorSpan className={dragIndicatorClassName}>
              <DragIcon />
            </DragIndicatorSpan>
          }
          id={this.draggableId}
        >
          {title}
        </DialogTitleWithClose>
        {children}
      </Dialog>
    );
  }
}
