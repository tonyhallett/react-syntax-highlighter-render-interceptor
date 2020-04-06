import * as React from 'react';
import {
  FormControlLabel,
  Checkbox,
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  Fab,
  withTheme,
  Theme,
  Fade,
} from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import Code from '@material-ui/icons/Code';
import StyleIcon from '@material-ui/icons/Style';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import { ToggleButton } from '@material-ui/lab';
import { TreeSheet } from '../helpers/base-components/TreeSheet';
import { CodeEditor } from '../CodeEditor';
import { TreeNodeHighlighters } from '../TreeNodeHighlighter/TreeNodeHighlighters';
import { FullScreenDialog } from '../helpers/base-components/dialogs/FullScreenDialog';
import { LanguagesSelector } from '../LanguagesSelector';
import { StyledHighlighters } from '../StyledHighlighter/StyledHighlighters';
import { DemoDescription } from '../DemoDescription';
import {
  StyleDetails,
  hljsStyles as initialHljsStyles,
  prismStyles as initialPrismStyles,
  HighlighterStyle,
} from '../helpers/syntax-highlighter-helpers/languagesAndStylesProvider';
import { LanguageDetails } from '../helpers/syntax-highlighter-helpers/commonLanguageProvider';
import { StickyAppBar } from '../StickyAppBar';
import { StylesNodesContainer } from './StylesNodesContainer';

const demoCode = `function demo(alertPerson:string){
  /*
    This typescript will be syntax highlighted
  */
  // you can change this by clicking the code button
  const alertMessage = \`Hello \${alertPerson}\`;
  alert(alertMessage);
  return Date.now();
}`;

interface DemoState {
  // only necessary here due to re-render
  commonLanguage: LanguageDetails | null;
  prismStyles: StyleDetails[];
  hljsStyles: StyleDetails[];
  selectedPrismStyle: StyleDetails | null;
  selectedPrismLanguage: LanguageDetails | null;
  selectedHljsStyle: StyleDetails | null;
  selectedHljsLanguage: LanguageDetails | null;
  code: string;
  showCode: boolean;
  wrapLines: boolean;
  showDialog: boolean;
  languageChangeClearsCode: boolean;
  showStyles: boolean;
  showNodes: boolean;
}
enum DialogContents {
  Style,
  Language,
  Description,
}

export class ThemedDemo extends React.Component<{ theme: Theme }, DemoState> {
  private selectedStyle!: HighlighterStyle;

  private dialogContents = DialogContents.Description;

  constructor(props: { theme: Theme }) {
    super(props);
    const secondaryDark = props.theme.palette.secondary.dark;
    const dodgyWrapLinesTruePrismStyle: StyleDetails = {
      isBuiltIn: false,
      name: 'dodgy wrapLines true',
      style: {
        comment: { color: 'orange' },
        'pre[class*="language-"]': {
          backgroundColor: secondaryDark,
          borderRadius: `${props.theme.shape.borderRadius}px`,
          padding: `${props.theme.spacing()}px`,
        },
      },
    };
    initialPrismStyles.push(dodgyWrapLinesTruePrismStyle);
    const initialSelectedHljs = initialHljsStyles.find(
      (s) => s.name === 'atelierCaveLight'
    );
    const initialCommonLanguage: LanguageDetails = {
      language: 'typescript',
      isCommon: true,
    };
    this.state = {
      commonLanguage: initialCommonLanguage,
      selectedPrismLanguage: initialCommonLanguage,
      selectedHljsLanguage: initialCommonLanguage,
      prismStyles: initialPrismStyles,
      hljsStyles: initialHljsStyles,
      selectedPrismStyle: dodgyWrapLinesTruePrismStyle,
      selectedHljsStyle: initialSelectedHljs || null,
      code: demoCode,
      wrapLines: false,
      showCode: false,
      showDialog: true,
      showStyles: true,
      languageChangeClearsCode: true,
      showNodes: false,
    };
  }

  getCodeOnLanguageChange(): string {
    const { languageChangeClearsCode, code } = this.state;
    return languageChangeClearsCode ? '' : code;
  }

  getDialogContents(): JSX.Element {
    const {
      selectedHljsLanguage,
      selectedPrismLanguage,
      commonLanguage,
      languageChangeClearsCode,
    } = this.state;
    let dialogContents: JSX.Element;
    switch (this.dialogContents) {
      case DialogContents.Style:
        dialogContents = (
          <Box padding="10px" width="700px">
            <TreeSheet style={this.selectedStyle} />
          </Box>
        );
        break;
      case DialogContents.Language:
        dialogContents = (
          <LanguagesSelector
            hljsLanguage={selectedHljsLanguage}
            prismLanguage={selectedPrismLanguage}
            commonLanguage={commonLanguage}
            hljsLanguageChanged={(hljsLanguage): void =>
              this.setState({
                selectedHljsLanguage: hljsLanguage,
                code: this.getCodeOnLanguageChange(),
              })
            }
            prismLanguageChanged={(prismLanguage): void =>
              this.setState({
                selectedPrismLanguage: prismLanguage,
                code: this.getCodeOnLanguageChange(),
              })
            }
            commonLanguageChanged={(newCommonLanguage): void =>
              this.setState({
                commonLanguage: newCommonLanguage,
                code: this.getCodeOnLanguageChange(),
              })
            }
            languageChangeClearsCode={languageChangeClearsCode}
            languageChangeClearsCodeChanged={(
              newLanguageChangeClearsCode
            ): void =>
              this.setState({
                languageChangeClearsCode: newLanguageChangeClearsCode,
              })
            }
          />
        );
        break;
      case DialogContents.Description:
        dialogContents = <DemoDescription />;
        break;
      default:
        throw new Error('Unexpected dialog contents');
    }
    return dialogContents;
  }

  getDialogTitle(): string {
    let dialogTitle: string;
    switch (this.dialogContents) {
      case DialogContents.Style:
        dialogTitle = 'Built in style';
        break;
      case DialogContents.Language:
        dialogTitle = 'Edit languages';
        break;
      case DialogContents.Description:
        dialogTitle = 'Description';
        break;
      default:
        throw new Error('Unknown dialog contents');
    }
    return dialogTitle;
  }

  getSelectedLanguage(isPrism: boolean): string | null {
    const { selectedPrismLanguage, selectedHljsLanguage } = this.state;
    const languageDetails = isPrism
      ? selectedPrismLanguage
      : selectedHljsLanguage;
    if (languageDetails) {
      return languageDetails.language;
    }
    return null;
  }

  addCustomStyle = (
    name: string,
    isPrism: boolean,
    style: HighlighterStyle
  ): void => {
    this.styledEdited(style, isPrism, name);
  };

  showStyle = (style: HighlighterStyle): void => {
    this.selectedStyle = style;
    this.dialogContents = DialogContents.Style;
    this.setState({ showDialog: true });
  };

  styledEdited = (
    style: HighlighterStyle,
    isPrism: boolean,
    name: string
  ): void => {
    const { prismStyles, hljsStyles } = this.state;
    const styles = isPrism ? prismStyles : hljsStyles;
    const newStyle = { name, isBuiltIn: false, style };
    const newStyles: StyleDetails[] = styles
      .filter((s) => s.name !== name)
      .concat(newStyle);
    if (isPrism) {
      this.setState({ prismStyles: newStyles, selectedPrismStyle: newStyle });
    } else {
      this.setState({ hljsStyles: newStyles, selectedHljsStyle: newStyle });
    }
  };

  showLanguage = (): void => {
    this.dialogContents = DialogContents.Language;
    this.setState({ showDialog: true });
  };

  toggleShowHighlighters = (): void => {
    this.setState((prevState) => ({ showStyles: !prevState.showStyles }));
  };

  toggleShowNodes = (): void => {
    this.setState((prevState) => ({ showNodes: !prevState.showNodes }));
  };

  toggleCode = (): void => {
    this.setState(({ showCode }) => {
      return {
        showCode: !showCode,
      };
    });
  };

  onDialogClose = (): void => {
    this.setState({ showDialog: false });
  };

  hideContents(): boolean {
    const { showDialog } = this.state;
    return this.dialogContents === DialogContents.Description && showDialog;
  }

  render(): JSX.Element {
    const selectedHljsLanguage = this.getSelectedLanguage(false);
    const selectedPrismLanguage = this.getSelectedLanguage(true);
    const {
      prismStyles,
      hljsStyles,
      selectedPrismStyle,
      selectedHljsStyle,
      showDialog,
      wrapLines,
      showStyles,
      showNodes,
      code,
      showCode,
    } = this.state;
    const styledHighlightersHljsProps = {
      language: selectedHljsLanguage,
      style: selectedHljsStyle,
      styles: hljsStyles,
    };
    const styledHighlightersPrismProps = {
      language: selectedPrismLanguage,
      style: selectedPrismStyle,
      styles: prismStyles,
    };
    const hljsProps = {
      language: selectedHljsLanguage,
      style: selectedHljsStyle ? selectedHljsStyle.style : null,
    };
    const prismProps = {
      language: selectedPrismLanguage,
      style: selectedPrismStyle ? selectedPrismStyle.style : null,
    };
    return (
      <>
        <FullScreenDialog
          title={this.getDialogTitle()}
          transition={this.dialogContents !== DialogContents.Description}
          open={showDialog}
          close={this.onDialogClose}
        >
          <Box m="auto">{this.getDialogContents()}</Box>
        </FullScreenDialog>
        {!this.hideContents() && (
          <>
            <StickyAppBar>
              <Toolbar>
                <Tooltip title="Change languages">
                  <IconButton onClick={this.showLanguage}>
                    <LanguageIcon />
                  </IconButton>
                </Tooltip>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="default"
                      checked={wrapLines}
                      onChange={(evt): void =>
                        this.setState({ wrapLines: evt.target.checked })
                      }
                    />
                  }
                  label="WrapLines"
                />
                <div style={{ flexGrow: 1 }} />

                <Tooltip title={showStyles ? 'Hide styles' : 'Show styles'}>
                  <Box mr={1}>
                    <ToggleButton
                      value=""
                      selected={showStyles}
                      onClick={this.toggleShowHighlighters}
                    >
                      <StyleIcon />
                    </ToggleButton>
                  </Box>
                </Tooltip>
                <Tooltip title={showNodes ? 'Hide nodes' : 'Show nodes'}>
                  <ToggleButton
                    value=""
                    selected={showNodes}
                    onClick={this.toggleShowNodes}
                  >
                    <AccountTreeIcon />
                  </ToggleButton>
                </Tooltip>
              </Toolbar>
            </StickyAppBar>
            <>
              <StylesNodesContainer show={showStyles}>
                <StyledHighlighters
                  addCustomStyle={this.addCustomStyle}
                  styleEdited={this.styledEdited}
                  code={code}
                  wrapLines={wrapLines}
                  showStyle={this.showStyle}
                  selectedHljsStyleChanged={(hljsSheet): void =>
                    this.setState({ selectedHljsStyle: hljsSheet })
                  }
                  selectedPrismStyleChanged={(prismSheet): void =>
                    this.setState({ selectedPrismStyle: prismSheet })
                  }
                  prism={styledHighlightersPrismProps}
                  hljs={styledHighlightersHljsProps}
                />
              </StylesNodesContainer>
              <Box py={1} />
              <StylesNodesContainer show={showNodes}>
                <TreeNodeHighlighters
                  wrapLines={wrapLines}
                  code={code}
                  hljs={hljsProps}
                  prism={prismProps}
                />
              </StylesNodesContainer>
            </>

            <Box display="flex" justifyContent="center">
              <Box zIndex={1000} bottom="0" position="fixed">
                {showCode && (
                  <Fade in={showCode}>
                    <CodeEditor
                      show={showCode}
                      code={code}
                      codeChanged={(newCode): void =>
                        this.setState({ code: newCode })
                      }
                    />
                  </Fade>
                )}
                <Box my={2} display="flex" justifyContent="center">
                  <Fab onClick={this.toggleCode} color="primary">
                    <Code />
                  </Fab>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </>
    );
  }
}
export const DemoThemed = withTheme(ThemedDemo);
