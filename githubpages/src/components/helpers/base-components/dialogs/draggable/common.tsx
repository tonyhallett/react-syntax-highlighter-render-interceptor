import React from 'react';
import { Paper, styled, PaperProps } from '@material-ui/core';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Draggable = require('react-draggable');

export function createPaperComponent(handleId: string) {
  return function PaperComponent(props: PaperProps): JSX.Element {
    return (
      <Draggable
        handle={`#${handleId}`}
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Paper {...props} />
      </Draggable>
    );
  };
}

export const DragIndicatorSpan = styled('span')({
  cursor: 'move',
  position: 'absolute',
});
