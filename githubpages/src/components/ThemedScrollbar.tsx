/* eslint-disable @typescript-eslint/no-explicit-any */
import { Theme } from '@material-ui/core';
import React from 'react';
import { GlobalScrollbar } from './helpers/base-components/GlobalScrollbar';

export function ThemedScrollbar({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <GlobalScrollbar
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      scrollbar={(theme: Theme) => {
        const thumbColor = theme.palette.grey[400];
        const trackColor = theme.palette.grey[300];
        return {
          scrollbarWidth: 'thin',
          thumbColor,
          trackColor,
          webkitScrollbar: {
            width: theme.spacing(),
          },
          webkitThumb: {
            backgroundColor: thumbColor,
          },
          webkitTrack: {
            backgroundColor: trackColor,
          },
        };
      }}
    >
      {children}
    </GlobalScrollbar>
  );
}
