import React from 'react';
import { TextField } from '@material-ui/core';
import { PropertyValueControlProps } from './PropertyValueControlProps';

export function TextFieldWrapper({
  propertyValue,
  propertyValueChanged,
}: PropertyValueControlProps): JSX.Element {
  return (
    <TextField
      placeholder="Css Value"
      value={propertyValue}
      onChange={(evt): void => propertyValueChanged(evt.target.value)}
    />
  );
}
