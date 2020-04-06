import * as React from 'react';
import { styled, Box } from '@material-ui/core';
import { StyledHighlighter } from './StyledHighlighter';
import {
  StyleDetails,
  HighlighterStyle,
} from '../helpers/syntax-highlighter-helpers/languagesAndStylesProvider';
import { EditStyleDialog } from './EditStyle/EditStyleDialog';
import { FlexedHighlighters } from '../helpers/base-components/FlexedHighlighters';

const MinWidthResponsiveBox = styled(Box)((props) => ({
  [props.theme.breakpoints.down('xs')]: {
    width: '400px',
  },
}));

export interface HighlighterCommon {
  language: string | null;
  style: StyleDetails | null;
  styles: StyleDetails[];
}
export interface StyledHighlightersProps {
  selectedPrismStyleChanged: (prismSheet: StyleDetails | null) => void;
  selectedHljsStyleChanged: (hljsSheet: StyleDetails | null) => void;
  showStyle: (style: HighlighterStyle) => void;
  styleEdited: (
    style: HighlighterStyle,
    isPrism: boolean,
    name: string
  ) => void;
  addCustomStyle: (
    name: string,
    isPrism: boolean,
    style: HighlighterStyle
  ) => void;
  wrapLines: boolean;
  code: string;
  prism: HighlighterCommon;
  hljs: HighlighterCommon;
  editNewStyleDelay?: number;
}
interface NewStyleToEdit {
  isPrism: boolean;
  name: string;
}
interface StyledHighlightersState {
  editPrismStyle: boolean;
  prismStyle: HighlighterStyle | undefined;
  editHljsStyle: boolean;
  hljsStyle: HighlighterStyle | undefined;
  liveEdit: boolean;
  newStyleToEdit: NewStyleToEdit | undefined;
}
export class StyledHighlighters extends React.Component<
  StyledHighlightersProps,
  StyledHighlightersState
> {
  static defaultProps: Pick<StyledHighlightersProps, 'editNewStyleDelay'> = {
    editNewStyleDelay: 200,
  };

  constructor(props: StyledHighlightersProps) {
    super(props);
    this.state = {
      editHljsStyle: false,
      editPrismStyle: false,
      hljsStyle: undefined,
      prismStyle: undefined,
      liveEdit: false,
      newStyleToEdit: undefined,
    };
  }

  componentDidUpdate(): void {
    const { newStyleToEdit } = this.state;
    if (newStyleToEdit) {
      this.editNewStyle(newStyleToEdit);
    }
  }

  getStyle(isPrism: boolean): HighlighterStyle {
    const { liveEdit, prismStyle, hljsStyle } = this.state;
    const { prism, hljs } = this.props;

    let style: HighlighterStyle | undefined;
    if (liveEdit) {
      if (isPrism && prism.style) {
        style = prism.style.style;
      } else if (hljs.style) {
        style = hljs.style.style;
      }
    } else {
      style = isPrism ? prismStyle : hljsStyle;
    }
    if (style === undefined) {
      throw new Error('no style');
    }
    return style;
  }

  liveEditChanged = (liveEdit: boolean): void => {
    const { editHljsStyle, hljsStyle, prismStyle } = this.state;
    const { hljs, prism } = this.props;
    if (liveEdit) {
      if (editHljsStyle) {
        if (hljsStyle) {
          this.hljsStyleEdited(hljsStyle);
        }
      } else if (prismStyle) {
        this.prismStyleEdited(prismStyle);
      }
      this.setState({ liveEdit });
    } else if (editHljsStyle) {
      if (hljs.style) {
        this.setState({ liveEdit, hljsStyle: hljs.style.style });
      } else {
        this.setState({ liveEdit });
      }
    } else if (prism.style) {
      this.setState({ liveEdit, prismStyle: prism.style.style });
    } else {
      this.setState({ liveEdit });
    }
  };

  hljsStyleChanged = (style: HighlighterStyle): void => {
    const { liveEdit } = this.state;
    if (liveEdit) {
      this.hljsStyleEdited(style);
    } else {
      this.setState({ hljsStyle: style });
    }
  };

  finishedEditingHljs = (): void => {
    const { liveEdit } = this.state;
    this.setState({ editHljsStyle: false });
    if (!liveEdit) {
      this.hljsStyleEdited(this.getStyle(false));
    }
  };

  prismStyleChanged = (style: HighlighterStyle): void => {
    const { liveEdit } = this.state;
    if (liveEdit) {
      this.prismStyleEdited(style);
    } else {
      this.setState({ prismStyle: style });
    }
  };

  finishedEditingPrism = (): void => {
    const { liveEdit } = this.state;
    this.setState({ editPrismStyle: false });
    if (!liveEdit) {
      this.prismStyleEdited(this.getStyle(true));
    }
  };

  editHljsStyle = (style: HighlighterStyle): void => {
    this.setState({ editHljsStyle: true, hljsStyle: style });
  };

  editPrismStyle = (style: HighlighterStyle): void => {
    this.setState({ editPrismStyle: true, prismStyle: style });
  };

  hljsStyleEdited(style: HighlighterStyle): void {
    const { styleEdited, hljs } = this.props;
    if (hljs.style) {
      styleEdited(style, false, hljs.style.name);
    } else {
      throw new Error();
    }
  }

  prismStyleEdited(style: HighlighterStyle): void {
    const { styleEdited, prism } = this.props;
    if (prism.style) {
      styleEdited(style, true, prism.style.name);
    } else {
      throw new Error();
    }
  }

  editNewStyle(newStyleToEdit: NewStyleToEdit): void {
    const { prism, hljs, editNewStyleDelay } = this.props;

    const editPrism = newStyleToEdit.isPrism;
    const hlcommon = editPrism ? prism : hljs;

    if (hlcommon.style && hlcommon.style.name === newStyleToEdit.name) {
      const editStyle = hlcommon.style.style;
      window.setTimeout(() => {
        if (editPrism) {
          this.setState({
            newStyleToEdit: undefined,
            editPrismStyle: true,
            prismStyle: editStyle,
          });
        } else {
          this.setState({
            newStyleToEdit: undefined,
            editHljsStyle: true,
            hljsStyle: editStyle,
          });
        }
      }, editNewStyleDelay);
    }
  }

  render(): JSX.Element {
    const { editHljsStyle, liveEdit, editPrismStyle } = this.state;
    const {
      addCustomStyle,
      code,
      hljs,
      prism,
      selectedHljsStyleChanged,
      selectedPrismStyleChanged,
      showStyle,
      wrapLines,
    } = this.props;
    return (
      <>
        {editHljsStyle && hljs.style && (
          <EditStyleDialog
            finishedEditing={this.finishedEditingHljs}
            style={hljs.style.style}
            editStyle={this.getStyle(false)}
            styleChanged={this.hljsStyleChanged}
            liveEdit={liveEdit}
            liveEditChanged={this.liveEditChanged}
            isPrism={false}
            wrapLines={wrapLines}
            language={hljs.language ? hljs.language : undefined}
            code={code}
          />
        )}
        {editPrismStyle && prism.style && (
          <EditStyleDialog
            finishedEditing={this.finishedEditingPrism}
            style={prism.style.style}
            editStyle={this.getStyle(true)}
            styleChanged={this.prismStyleChanged}
            liveEdit={liveEdit}
            liveEditChanged={this.liveEditChanged}
            isPrism
            wrapLines={wrapLines}
            language={prism.language ? prism.language : undefined}
            code={code}
          />
        )}
        <FlexedHighlighters
          StyledBox={MinWidthResponsiveBox}
          prism={
            <StyledHighlighter
              code={code}
              wrapLines={wrapLines}
              styles={prism.styles}
              isPrism
              addCustomStyle={(name, style): void => {
                addCustomStyle(name, true, style);
                this.setState({ newStyleToEdit: { isPrism: true, name } });
              }}
              language={prism.language}
              selectedStyleChanged={(prismStyle): void =>
                selectedPrismStyleChanged(prismStyle)
              }
              selectedStyle={prism.style}
              editStyle={this.editPrismStyle}
              showStyle={(style): void => showStyle(style)}
            />
          }
          hljs={
            <StyledHighlighter
              addCustomStyle={(name, style): void => {
                addCustomStyle(name, false, style);
                this.setState({ newStyleToEdit: { isPrism: false, name } });
              }}
              code={code}
              wrapLines={wrapLines}
              styles={hljs.styles}
              isPrism={false}
              language={hljs.language}
              selectedStyleChanged={(hljsStyle): void =>
                selectedHljsStyleChanged(hljsStyle)
              }
              selectedStyle={hljs.style}
              editStyle={this.editHljsStyle}
              showStyle={(style): void => showStyle(style)}
            />
          }
        />
      </>
    );
  }
}
