import * as React from 'react';
import { IconButton, Tooltip, TooltipProps } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { StringifyCopyToClipboard } from './StringifyCopyToClipboard';

export function CopyToClipboardWithIcon({
  value,
  tooltipPlacement,
  disabled,
  iconButtonClassName,
}: {
  value: object | (() => object);
  tooltipPlacement: TooltipProps['placement'];
  disabled?: boolean;
  iconButtonClassName?: string;
}): JSX.Element {
  return (
    <StringifyCopyToClipboard value={value}>
      <Tooltip title="Copy to clipboard" placement={tooltipPlacement}>
        <IconButton
          className={iconButtonClassName}
          disabled={disabled}
          edge="end"
        >
          <AssignmentIcon />
        </IconButton>
      </Tooltip>
    </StringifyCopyToClipboard>
  );
}
