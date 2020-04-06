import React from 'react';
import { Dialog, PaperProps, DialogProps } from '@material-ui/core';
import { DialogTitleWithClose } from '../DialogTitle';
import { createPaperComponent } from './common';

export interface DraggableByTitleCloseIconDialogProps {
  dialogProps: DialogProps;
  onClose: () => void;
  children: React.ReactNode;
  id?: string;
}
export class DraggableByTitleCloseIconDialog extends React.Component<
  DraggableByTitleCloseIconDialogProps
> {
  static instances = 0;

  paperComponent: React.FunctionComponent<PaperProps>;

  draggableId: string;

  constructor(props: DraggableByTitleCloseIconDialogProps) {
    super(props);
    this.draggableId = props.id
      ? props.id
      : `draggable-dialog-title${(DraggableByTitleCloseIconDialog.instances += 1)}`;
    this.paperComponent = createPaperComponent(this.draggableId);
  }

  render(): JSX.Element {
    const { dialogProps, children, onClose } = this.props;
    return (
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      <Dialog {...dialogProps} PaperComponent={this.paperComponent}>
        <DialogTitleWithClose
          style={{ cursor: 'move' }}
          id={this.draggableId}
          onClose={onClose}
        >
          Edit Custom Style
        </DialogTitleWithClose>
        {children}
      </Dialog>
    );
  }
}
