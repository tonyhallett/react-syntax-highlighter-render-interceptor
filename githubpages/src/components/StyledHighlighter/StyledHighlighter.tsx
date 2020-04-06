/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
  TextField,
  IconButton,
  Tooltip,
  Checkbox,
  Toolbar,
  Divider,
  withStyles,
  Theme,
  WithStyles,
  styled,
} from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';
import {
  StyleDetails,
  HighlighterStyle,
} from '../helpers/syntax-highlighter-helpers/languagesAndStylesProvider';
import { AddCustomStyle, AddCustomStyleResult } from './AddCustomStyle';
import { SmallSingleAutoComplete } from '../helpers/base-components/SmallSingleAutoComplete';
import { CopyToClipboardWithIcon } from '../helpers/base-components/copy-to-clipboard/CopyToClipboardWithIcon';
import { SubAppBar, SubToolbar } from '../helpers/base-components/SubAppBar';
import { SyntaxHighlighter } from '../SyntaxHighlighter';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styleHighlighterStyles = (theme: Theme) => ({
  buttonsToolbar: {
    paddingLeft: '0px',
    marginBottom: theme.spacing(),
  },
  mainToolbar: {
    flexWrap: 'wrap' as React.CSSProperties['flexWrap'],
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
  },
  customStyle: {
    fontStyle: 'italic',
  },
  builtInStyle: {
    fontStyle: 'normal',
  },
});

export interface StyleHighlighterProps
  extends WithStyles<typeof styleHighlighterStyles> {
  isPrism: boolean;
  code: string;
  wrapLines: boolean;
  language: string | null;
  styles: StyleDetails[];
  selectedStyle: StyleDetails | null;
  selectedStyleChanged: (styleName: StyleDetails | null) => void;

  showStyle: (style: HighlighterStyle) => void;
  editStyle: (style: HighlighterStyle) => void;
  addCustomStyle: (name: string, style: HighlighterStyle) => void;
}
export interface StyledHighlighterState {
  addCustomStyle: boolean;
  addCustomFromExisting: boolean;
}

const OverflowScrollbars = styled('div')({
  overflow: 'overlay',
  fallbacks: {
    overflow: 'auto',
  },
});

export const StyledHighlighter = withStyles(styleHighlighterStyles)(
  class extends React.Component<StyleHighlighterProps, StyledHighlighterState> {
    constructor(props: StyleHighlighterProps) {
      super(props);
      this.state = {
        addCustomStyle: false,
        addCustomFromExisting: false,
      };
    }

    getStyle(): object | undefined {
      const { selectedStyle } = this.props;
      return selectedStyle ? selectedStyle.style : undefined;
    }

    addCustomStyleResult = (result: AddCustomStyleResult): void => {
      const { addCustomStyle } = this.props;
      const { addCustomFromExisting } = this.state;
      if (result.cancelled) {
        this.setState({ addCustomStyle: false });
      } else {
        this.setState({ addCustomStyle: false });
        addCustomStyle(
          result.styleName,
          addCustomFromExisting ? this.cloneExistingStyle() : {}
        );
      }
    };

    addCustomStyle = (): void => {
      this.setState({ addCustomStyle: true });
    };

    showOrEditStyle = (): void => {
      const { selectedStyle, showStyle, editStyle } = this.props;
      if (selectedStyle) {
        if (selectedStyle.isBuiltIn) {
          showStyle(selectedStyle.style);
        } else {
          editStyle(selectedStyle.style);
        }
      }
    };

    cloneExistingStyle(): HighlighterStyle {
      const clone: HighlighterStyle = {};
      const { selectedStyle } = this.props;
      if (selectedStyle) {
        const existing = selectedStyle.style;
        Object.getOwnPropertyNames(existing).forEach((n) => {
          clone[n] = { ...existing[n] };
        });
      }
      return clone;
    }

    render(): JSX.Element {
      const {
        selectedStyle,
        classes,
        showStyle,
        editStyle,
        selectedStyleChanged,
        isPrism,
        wrapLines,
        language,
        code,
        styles,
      } = this.props;
      const { addCustomStyle, addCustomFromExisting } = this.state;
      const highlighterName = isPrism ? 'Prism' : 'Hljs';
      /* const styleClassName2 = selectedStyle
        ? selectedStyle.isBuiltIn
          ? classes.builtInStyle
          : classes.customStyle
        : classes.builtInStyle; */

      let styleClassName = classes.builtInStyle;
      if (selectedStyle) {
        styleClassName = selectedStyle.isBuiltIn
          ? classes.builtInStyle
          : classes.customStyle;
      }

      return (
        <div>
          {addCustomStyle && (
            <AddCustomStyle
              existingStyleNames={styles.map((sd) => sd.name)}
              result={this.addCustomStyleResult}
            />
          )}
          <SubAppBar>
            <Toolbar className={classes.mainToolbar}>
              <SubToolbar className={classes.buttonsToolbar}>
                {selectedStyle === null || selectedStyle.isBuiltIn ? (
                  <Tooltip title="View built-in style">
                    <IconButton
                      disabled={!selectedStyle}
                      onClick={(): void => {
                        if (selectedStyle) {
                          showStyle(selectedStyle.style);
                        }
                      }}
                    >
                      <LaunchIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Edit custom style">
                    <IconButton
                      disabled={!selectedStyle}
                      onClick={(): void => editStyle(selectedStyle.style)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Divider flexItem orientation="vertical" />
                <Tooltip title="Create custom style">
                  <IconButton onClick={this.addCustomStyle}>
                    <AddBoxIcon />{' '}
                  </IconButton>
                </Tooltip>

                <Tooltip title="From selected">
                  <Checkbox
                    disabled={!selectedStyle}
                    value={addCustomFromExisting}
                    onChange={(evt): void =>
                      this.setState({
                        addCustomFromExisting: evt.target.checked,
                      })
                    }
                  />
                </Tooltip>
                <Divider flexItem orientation="vertical" />
                <CopyToClipboardWithIcon
                  disabled={!selectedStyle}
                  tooltipPlacement="bottom"
                  value={selectedStyle ? selectedStyle.style : {}}
                />
              </SubToolbar>
              <SmallSingleAutoComplete
                value={selectedStyle}
                options={styles}
                getOptionLabel={(option): string => option.name}
                renderInput={(params): JSX.Element => (
                  <TextField
                    className={styleClassName}
                    {...params}
                    label={`Select ${highlighterName} Style`}
                    variant="outlined"
                    fullWidth
                  />
                )}
                onChange={(_, sheet): void => {
                  selectedStyleChanged(sheet);
                }}
              />
            </Toolbar>
          </SubAppBar>
          {language && (
            <OverflowScrollbars>
              <SyntaxHighlighter
                isPrism={isPrism}
                wrapLines={wrapLines}
                language={language}
                style={this.getStyle()}
              >
                {code}
              </SyntaxHighlighter>
            </OverflowScrollbars>
          )}
        </div>
      );
    }
  }
);
