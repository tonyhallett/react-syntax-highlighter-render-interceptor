import React from 'react';
import { Autocomplete, FilterOptionsState } from '@material-ui/lab';
import { TextField, IconButton } from '@material-ui/core';
import matchSorter from 'match-sorter';
import { PropertyValueControlProps } from './PropertyValueControlProps';
import { TickConfirmIcon } from '../../../helpers/base-components/TickConfirmIcon';

const filterOptions = (
  options: string[],
  state: FilterOptionsState<string>
): string[] => matchSorter<string>(options, state.inputValue);

export interface AddNewPropertyProps {
  newPropertyName: string;
  newPropertyNameChanged: (
    evt: React.ChangeEvent<{}>,
    newValue: string | null
  ) => void;
  newPropertyValue: string;
  newPropertyValueChanged: (newPropertyValue: string) => void;
  addNewProperty: () => void;
  newPropertyIsExisting: boolean;
  unusedCssProperties: string[];
  PropertyValueControl: React.ComponentType<PropertyValueControlProps>;
}

export const AddNewProperty = React.forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: AddNewPropertyProps, ref: any) => {
    const {
      unusedCssProperties,
      newPropertyName,
      newPropertyNameChanged,
      newPropertyIsExisting,
      newPropertyValue,
      newPropertyValueChanged,
      PropertyValueControl,
      addNewProperty,
    } = props;
    return (
      <>
        <Autocomplete
          autoComplete
          filterOptions={filterOptions}
          freeSolo
          options={unusedCssProperties}
          inputValue={newPropertyName}
          onInputChange={newPropertyNameChanged}
          renderInput={(params): JSX.Element => (
            <TextField
              inputRef={ref}
              error={newPropertyIsExisting}
              helperText={newPropertyIsExisting ? 'Duplicate' : ''}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...params}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password',
              }}
              label="New Css Property"
              margin="normal"
            />
          )}
        />
        <PropertyValueControl
          liveEdit={false}
          propertyValue={newPropertyValue}
          propertyValueChanged={newPropertyValueChanged}
        />
        <IconButton
          disabled={
            newPropertyName.length === 0 ||
            newPropertyIsExisting ||
            newPropertyValue.length === 0
          }
          onClick={addNewProperty}
        >
          <TickConfirmIcon />
        </IconButton>
      </>
    );
  }
);
