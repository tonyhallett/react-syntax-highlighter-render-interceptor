import React from 'react';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import { makeStyles } from '@material-ui/core';

interface PickerIconProps {
  underlineColor: string;
  disabled: boolean;
}
export const usePickerStyles = makeStyles({
  root: (props: PickerIconProps) => {
    if (props.disabled) {
      return {
        '& > path:last-child': {
          fill: 'unset',
          fillOpacity: 'unset',
        },
      };
    }
    return {
      '& > path:last-child': {
        fill: props.underlineColor === '' ? 'white' : props.underlineColor,
        fillOpacity: 1,
      },
    };
  },
});
export function PickerIcon(props: {
  underlineColor: string;
  disabled: boolean;
}): JSX.Element {
  const pickerClass = usePickerStyles(props);
  return <FormatColorFillIcon className={pickerClass.root} />;
}
