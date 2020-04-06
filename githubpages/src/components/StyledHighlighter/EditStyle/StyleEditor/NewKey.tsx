import React from 'react';
import { TextField, IconButton } from '@material-ui/core';
import { TickConfirmIcon } from '../../../helpers/base-components/TickConfirmIcon';

export function NewKey({
  confirm,
  newKey,
  newKeyChanged,
  newKeyIsExisting,
}: {
  newKeyIsExisting: boolean;
  newKey: string;
  newKeyChanged: (newKey: string) => void;
  confirm: () => void;
}): JSX.Element {
  return (
    <>
      <TextField
        error={newKeyIsExisting}
        placeholder="Add key"
        value={newKey}
        onChange={(evt): void => newKeyChanged(evt.target.value)}
        helperText={newKeyIsExisting ? 'existing key' : ''}
      />
      <IconButton
        disabled={newKey.length === 0 || newKeyIsExisting}
        onClick={confirm}
      >
        <TickConfirmIcon />
      </IconButton>
    </>
  );
}
