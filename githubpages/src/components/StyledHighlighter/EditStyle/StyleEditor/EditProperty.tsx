import React from 'react';
import { Typography } from '@material-ui/core';
import { PropertyValueControlProps } from './PropertyValueControlProps';

export type EditPropertyProps = PropertyValueControlProps & {
  propertyName: string;
  EditValueControl: React.ComponentType<PropertyValueControlProps>;
};
export function EditProperty({
  propertyName,
  liveEdit,
  propertyValue,
  propertyValueChanged,
  EditValueControl,
}: EditPropertyProps): JSX.Element {
  return (
    <>
      <Typography>{`Edit ${propertyName}`}</Typography>
      <EditValueControl
        liveEdit={liveEdit}
        propertyValue={propertyValue}
        propertyValueChanged={propertyValueChanged}
      />
    </>
  );
}
