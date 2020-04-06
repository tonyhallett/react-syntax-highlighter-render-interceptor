import React from 'react';
import { createPortal } from 'react-dom';
import { makeStyles, TextField, IconButton, Box } from '@material-ui/core';
import { ColorPickerComponent } from '@syncfusion/ej2-react-inputs';
import CancelIcon from '@material-ui/icons/Cancel';
import { debounce } from 'throttle-debounce';
import { TickConfirmButton } from './TickConfirmButton';
import { PickerIcon } from '../PickerIcon';
import { DraggableByIconCloseIconDialog } from '../../../../helpers/base-components/dialogs/draggable/DraggableByIconCloseIconDialog';
import { colorNames } from './colorNames';
import { PropertyValueControlProps } from '../PropertyValueControlProps';

const useColorPickerStyles = makeStyles((theme) => ({
  root: {
    '& .e-cancel': {
      display: 'none',
    },
    '& .e-apply': {
      display: 'none',
    },
    '& .e-value-switch-btn': {
      cursor: 'pointer',
    },
    '& .e-value-switch-btn:focus': {
      color: 'yellow',
    },
    '& .e-switch-ctrl-btn': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  cancelIcon: {
    color: theme.palette.error.light,
  },
  dialogTitle: {
    marginTop: '4px',
    marginBottom: '16px',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '0px',
    marginLeft: '4px',
  },
  dragIndicator: {
    color: theme.palette.secondary.main,
  },
}));

function canShowColorPicker(
  value: string | undefined
): { canShow: boolean; colorName: [string, string] | undefined } {
  if (value === undefined) {
    return { canShow: false, colorName: undefined };
  }
  let colorName: [string, string] | undefined;
  let canShow = false;
  if (value === '') {
    canShow = true;
  } else if (value.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/)) {
    canShow = true;
  } else {
    colorName = colorNames.find((cn) => cn[0] === value.toUpperCase());
    if (colorName) {
      canShow = true;
    }
  }
  return {
    canShow,
    colorName,
  };
}

type ColorPickerSelectEvent = Parameters<
  Required<ColorPickerComponent['props']>['select']
>[0];

export function ColorValue({
  propertyValueChanged,
  propertyValue,
  liveEdit,
}: PropertyValueControlProps): JSX.Element {
  const pickerButtonRef = React.useRef<HTMLButtonElement>(null);
  const classes = useColorPickerStyles();
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [colorPickerValue, setColorPickerValue] = React.useState<
    string | undefined
  >(undefined);
  const [buttonPortal, setButtonPortal] = React.useState(false);
  const colorPickerComponentCreated = React.useCallback(() => {
    setButtonPortal(true);
  }, [setButtonPortal]);
  const liveEditDebounced = React.useCallback(
    debounce(150, (evt: ColorPickerSelectEvent) => {
      const currentHex = evt?.currentValue.hex;
      if (currentHex) {
        propertyValueChanged(currentHex);
      }
    }),
    []
  );

  React.useEffect(() => {
    setColorPickerValue((prevColorPickerValue) => {
      if (prevColorPickerValue === undefined) {
        return propertyValue;
      }
      if (liveEdit && showColorPicker) {
        return prevColorPickerValue;
      }
      return propertyValue;
    });
  }, [setColorPickerValue, propertyValue, showColorPicker, liveEdit]);

  const myButtons = buttonPortal
    ? createPortal(
        <span>
          <IconButton
            className={classes.cancelIcon}
            onClick={(): void => {
              setShowColorPicker(false);
              setButtonPortal(false);
              if (liveEdit && colorPickerValue !== undefined) {
                propertyValueChanged(colorPickerValue);
              }
            }}
          >
            <CancelIcon />
          </IconButton>
          <TickConfirmButton />
        </span>,
        document.getElementsByClassName('e-ctrl-btn')[0]
      )
    : null;

  const { colorName, canShow } = React.useMemo(
    () => canShowColorPicker(colorPickerValue),
    [colorPickerValue]
  );
  const colourValue = colorName ? colorName[1] : colorPickerValue;

  return (
    <div>
      <TextField
        disabled={showColorPicker}
        placeholder="Css Color"
        value={propertyValue}
        onChange={(evt): void => propertyValueChanged(evt.target.value)}
      />
      <IconButton
        disabled={!canShow}
        ref={pickerButtonRef}
        onClick={(): void => setShowColorPicker(true)}
      >
        <PickerIcon disabled={!canShow} underlineColor={propertyValue} />
      </IconButton>
      <br />
      {myButtons}
      <DraggableByIconCloseIconDialog
        dialogProps={{ open: showColorPicker, scroll: 'body' }}
        title=""
        dialogTitleWithCloseClasses={{ root: classes.dialogTitle }}
        dragIndicatorClassName={classes.dragIndicator}
      >
        <Box p={1}>
          <ColorPickerComponent
            created={colorPickerComponentCreated}
            cssClass={classes.root}
            inline
            value={colourValue}
            select={liveEdit ? liveEditDebounced : undefined}
            change={(evt): void => {
              const currentHex = evt?.currentValue.hex;

              if (currentHex) {
                const valueChanged =
                  colorName === undefined ||
                  currentHex.toUpperCase() !== colorName[1];
                if (valueChanged) {
                  propertyValueChanged(currentHex);
                }
              }

              setButtonPortal(false);
              setShowColorPicker(false);

              const pickerButton = pickerButtonRef.current;
              if (pickerButton) {
                pickerButton.focus();
              }
            }}
          />
        </Box>
      </DraggableByIconCloseIconDialog>
    </div>
  );
}
