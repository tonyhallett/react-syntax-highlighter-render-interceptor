import * as React from 'react';
import { TreeView, TreeItem } from '@material-ui/lab';
import { InputLabel } from '@material-ui/core';
import { HighlighterStyle } from '../syntax-highlighter-helpers/languagesAndStylesProvider';

export interface TreeSheetProps {
  style: HighlighterStyle;
}
export class TreeSheet extends React.Component<TreeSheetProps> {
  static mapCssPropertiesToTreeItems(
    cssProperties: Record<string, string>,
    key: string
  ): JSX.Element[] {
    return Object.getOwnPropertyNames(cssProperties).map(
      (cssPropertyName, i) => {
        const cssPropertyValue = cssProperties[cssPropertyName];

        return (
          <TreeItem
            nodeId={`${key}${cssPropertyName}`}
            key={i.toString()}
            label={
              <>
                <InputLabel
                  style={{ display: 'inline' }}
                >{`${cssPropertyName} : `}</InputLabel>
                <InputLabel style={{ display: 'inline' }}>
                  {cssPropertyValue}
                </InputLabel>
                {(cssPropertyName === 'color' ||
                  cssPropertyName === 'backgroundColor') && (
                  <div
                    style={{
                      backgroundColor: cssPropertyValue,
                      padding: '8px',
                      marginLeft: '10px',
                      width: '10px',
                      display: 'inline-block',
                    }}
                  />
                )}
              </>
            }
          />
        );
      }
    );
  }

  getStyleAsTreeItems(): JSX.Element[] {
    const { style } = this.props;
    return Object.getOwnPropertyNames(style).map((key, i) => {
      return (
        <TreeItem key={i.toString()} nodeId={i.toString()} label={key}>
          {TreeSheet.mapCssPropertiesToTreeItems(style[key], key)}
        </TreeItem>
      );
    });
  }

  render(): JSX.Element {
    return <TreeView>{this.getStyleAsTreeItems()}</TreeView>;
  }
}
