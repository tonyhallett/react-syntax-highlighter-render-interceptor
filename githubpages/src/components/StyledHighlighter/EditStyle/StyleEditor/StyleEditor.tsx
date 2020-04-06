import React from 'react';
import {
  Box,
  Divider,
  WithStyles,
  withStyles,
  Theme,
  createStyles,
} from '@material-ui/core';
import StyleIcon from '@material-ui/icons/Style';
import { TreeView } from '@material-ui/lab';
import './StyleEditor.css';
import memoize from 'memoize-one';
import { ColorValue } from './ColorValue/colorValue';
import { SmallElevationPaddedPaper } from '../../../helpers/base-components/SmallElevationPaddedPaper';
import { ManuallyFocusableTreeItem } from '../ManuallyFocusableTreeItem';
import { PropertyValueControlProps } from './PropertyValueControlProps';
import { cssProperties } from './cssProperties';
import { colorCssProperties } from './colorCssProperties';
import { HighlighterStyle } from '../../../helpers/syntax-highlighter-helpers/languagesAndStylesProvider';
import { EditProperty } from './EditProperty';
import { AddNewProperty } from './AddNewProperty';
import { CommonHeaderWithDelete } from './CommonHeaderWithDelete';
import { NewKey } from './NewKey';
import { TextFieldWrapper } from './TextFieldPropertyValueControl';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styleEditorStyles = (theme: Theme) =>
  createStyles({
    root: {
      '& .MuiIconButton-root:not(.Mui-disabled)': {
        color: theme.palette.primary.main,
        '& .MuiTickConfirmIcon-root': {
          color: theme.palette.success.main,
        },
      },
      '& .MuiToggleButton-root': {
        color: theme.palette.primary.light,
      },
      '& .MuiToggleButton-root.Mui-selected': {
        color: theme.palette.primary.main,
      },
    },
  });

export interface StyleEditorProps extends WithStyles<typeof styleEditorStyles> {
  style: HighlighterStyle;
  styleChanged: (value: HighlighterStyle) => void;
  liveEdit: boolean;
}

export interface StyleEditorState {
  selectedNodeId: string;
  newKey: string;
  newPropertyName: string;
  newPropertyValue: string;
  manuallyFocusedItem: string | undefined;
  manuallyFocusedCounter: number;
}

export const StyleEditor = withStyles(styleEditorStyles)(
  class extends React.Component<StyleEditorProps, StyleEditorState> {
    addNewPropertyRef: React.RefObject<{ focus: () => void }>;

    newKeyIsExisting = memoize((value, newKey) => {
      const keys = this.getKeys(value);
      return keys.indexOf(newKey) !== -1;
    });

    constructor(props: StyleEditorProps) {
      super(props);
      const valueKeys = Object.keys(props.style);
      const initialSelectedKey = valueKeys.length === 0 ? '-1' : valueKeys[0];
      this.addNewPropertyRef = React.createRef<{ focus: () => void }>();
      this.state = {
        selectedNodeId: initialSelectedKey,
        newKey: '',
        newPropertyName: '',
        newPropertyValue: '',
        manuallyFocusedItem:
          initialSelectedKey !== '-1' ? initialSelectedKey : undefined,
        manuallyFocusedCounter: 0,
      };
    }

    getExistingCSSProperties = memoize((value, selectedNodeId) => {
      return Object.keys(value[selectedNodeId]);
    });

    getKeyOrProperty(): string {
      const { selectedNodeId } = this.state;
      if (this.isRoot()) {
        return selectedNodeId;
      }
      const parts = selectedNodeId.split('.');
      return `${parts[0]} ${parts[1]}`;
    }

    getUnusedCssProperties = memoize((existingCssProperties: string[]) => {
      return cssProperties.filter(
        (p) => existingCssProperties.indexOf(p) === -1
      );
    });

    getKeys = memoize((value) => {
      return Object.keys(value);
    });

    getNewPropertyValueControl(): React.ComponentType<
      PropertyValueControlProps
    > {
      const { newPropertyName } = this.state;
      if (colorCssProperties.indexOf(newPropertyName) !== -1) {
        return ColorValue;
      }
      return TextFieldWrapper;
    }

    getSelectedProperty(): string {
      const { selectedNodeId } = this.state;
      const parts = selectedNodeId.split('.');
      return parts[1];
    }

    getEditPropertyValueControl(): React.ComponentType<
      PropertyValueControlProps
    > {
      if (colorCssProperties.indexOf(this.getSelectedProperty()) !== -1) {
        return ColorValue;
      }
      return TextFieldWrapper;
    }

    getAddNewPropertyControl(): JSX.Element {
      const { style: value } = this.props;
      const { selectedNodeId, newPropertyName, newPropertyValue } = this.state;
      const existingCssProperties = this.getExistingCSSProperties(
        value,
        selectedNodeId
      );
      const newPropertyIsExisting =
        existingCssProperties.indexOf(newPropertyName) !== -1;
      const unusedCssProperties = this.getUnusedCssProperties(
        existingCssProperties
      );
      return (
        <AddNewProperty
          ref={this.addNewPropertyRef}
          addNewProperty={this.addNewProperty}
          newPropertyName={newPropertyName}
          newPropertyNameChanged={this.newPropertyNameChanged}
          newPropertyValue={newPropertyValue}
          newPropertyValueChanged={(newValue): void =>
            this.setState({ newPropertyValue: newValue })
          }
          PropertyValueControl={this.getNewPropertyValueControl()}
          newPropertyIsExisting={newPropertyIsExisting}
          unusedCssProperties={unusedCssProperties}
        />
      );
    }

    getEditPropertyControl(): JSX.Element {
      const { liveEdit, style: value, styleChanged: valueChanged } = this.props;
      const { selectedNodeId } = this.state;
      const parts = selectedNodeId.split('.');
      const propertyName = parts[1];
      const key = parts[0];
      return (
        <EditProperty
          EditValueControl={this.getEditPropertyValueControl()}
          liveEdit={liveEdit}
          propertyName={propertyName}
          propertyValue={value[key][propertyName]}
          propertyValueChanged={(newPropertyValue): void => {
            const newValue = { ...value };
            const oldKey = value[key];
            newValue[key] = { ...oldKey, [propertyName]: newPropertyValue };
            valueChanged(newValue);
          }}
        />
      );
    }

    confirmAddNewKey = (): void => {
      const { style: value, styleChanged: valueChanged } = this.props;
      const { newKey } = this.state;
      const newValue = { ...value };
      newValue[newKey] = {};
      valueChanged(newValue);

      this.setState({
        selectedNodeId: newKey,
        newKey: '',
      });

      if (this.addNewPropertyRef.current) {
        this.addNewPropertyRef.current.focus();
      }
    };

    newPropertyNameChanged = (
      evt: React.ChangeEvent<{}>,
      newValue: string | null
    ): void => {
      this.setState({
        newPropertyName: newValue === null ? '' : newValue,
        newPropertyValue: '',
      });
    };

    addNewProperty = (): void => {
      const { style: value, styleChanged: valueChanged } = this.props;
      const { selectedNodeId, newPropertyName, newPropertyValue } = this.state;
      if (selectedNodeId) {
        const newValue = { ...value };
        const oldKey = value[selectedNodeId];
        newValue[selectedNodeId] = {
          ...oldKey,
          [newPropertyName]: newPropertyValue,
        };
        valueChanged(newValue);
        this.setState({ newPropertyName: '', newPropertyValue: '' });
      }
    };

    deleteKeyOrProperty = (): void => {
      const { style: value, styleChanged: valueChanged } = this.props;
      const { selectedNodeId } = this.state;
      let newValue: HighlighterStyle;
      if (this.isRoot()) {
        newValue = { ...value };
        delete newValue[selectedNodeId];
      } else {
        newValue = { ...value };
        const parts = selectedNodeId.split('.');
        delete newValue[parts[0]][parts[1]];
      }

      this.setState((currentState) => {
        const newState: Pick<
          StyleEditorState,
          'selectedNodeId' | 'manuallyFocusedItem' | 'manuallyFocusedCounter'
        > = {
          selectedNodeId: '-1',
          manuallyFocusedItem: undefined,
          manuallyFocusedCounter: currentState.manuallyFocusedCounter,
        };
        const keys = Object.keys(newValue);
        if (keys.length > 0) {
          const [firstItem] = keys;
          newState.selectedNodeId = firstItem;
          newState.manuallyFocusedItem = firstItem;
          newState.manuallyFocusedCounter =
            currentState.manuallyFocusedCounter + 1;
        }
        return newState;
      });

      valueChanged(newValue);
    };

    isRoot(): boolean {
      const { selectedNodeId } = this.state;
      if (selectedNodeId) {
        return selectedNodeId.indexOf('.') === -1;
      }
      throw new Error('nothing selected');
    }

    render(): JSX.Element {
      const { style: value, classes } = this.props;
      const {
        newKey,
        selectedNodeId,
        manuallyFocusedItem,
        manuallyFocusedCounter,
      } = this.state;
      const keys = this.getKeys(value);
      const newKeyIsExisting = this.newKeyIsExisting(value, newKey);

      return (
        <div className={classes.root}>
          {selectedNodeId !== '-1' && (
            <Box mb={1}>
              <SmallElevationPaddedPaper>
                <CommonHeaderWithDelete
                  delete={this.deleteKeyOrProperty}
                  header={this.getKeyOrProperty()}
                />
                <Divider />
                <Box>
                  {this.isRoot()
                    ? this.getAddNewPropertyControl()
                    : this.getEditPropertyControl()}
                </Box>
              </SmallElevationPaddedPaper>
            </Box>
          )}
          <Box mb={1}>
            <SmallElevationPaddedPaper>
              <NewKey
                newKey={newKey}
                newKeyChanged={(key): void => this.setState({ newKey: key })}
                confirm={this.confirmAddNewKey}
                newKeyIsExisting={newKeyIsExisting}
              />
            </SmallElevationPaddedPaper>
          </Box>
          <Box mb={1}>
            <SmallElevationPaddedPaper>
              <TreeView
                selected={selectedNodeId}
                multiSelect={false}
                onNodeSelect={(_, id): void => {
                  this.setState({ selectedNodeId: id });
                }}
              >
                {keys.map((key) => {
                  const css = value[key];
                  return (
                    <ManuallyFocusableTreeItem
                      doFocus={
                        manuallyFocusedItem === key
                          ? manuallyFocusedCounter
                          : undefined
                      }
                      key={key}
                      nodeId={key}
                      label={key}
                      icon={<StyleIcon />}
                    >
                      {Object.keys(css).map((cssKey) => {
                        return (
                          <ManuallyFocusableTreeItem
                            doFocus={
                              manuallyFocusedItem === cssKey
                                ? manuallyFocusedCounter
                                : undefined
                            }
                            key={cssKey}
                            nodeId={`${key}.${cssKey}`}
                            label={cssKey}
                          />
                        );
                      })}
                    </ManuallyFocusableTreeItem>
                  );
                })}
              </TreeView>
            </SmallElevationPaddedPaper>
          </Box>
        </div>
      );
    }
  }
);
