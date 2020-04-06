import * as React from 'react';
import {
  TextFieldProps,
  TextField,
  StandardTextFieldProps,
  BaseTextFieldProps,
} from '@material-ui/core';

export interface TextFieldCenteredPlaceholderState {
  canMeasure: boolean;
  labelHasFocus: boolean;
}
export type TextFieldCenteredPlaceholderProps = TextFieldProps & {};
export class TextFieldCenteredPlaceholder extends React.Component<
  TextFieldCenteredPlaceholderProps,
  TextFieldCenteredPlaceholderState
> {
  textFieldDivRef: React.RefObject<HTMLDivElement>;

  textFieldLabelRef: React.RefObject<HTMLLabelElement>;

  constructor(props: TextFieldCenteredPlaceholderProps) {
    super(props);
    this.textFieldDivRef = React.createRef();
    this.textFieldLabelRef = React.createRef();
    this.state = {
      canMeasure: false,
      labelHasFocus: false,
    };
  }

  componentDidMount(): void {
    const interval = window.setInterval(() => {
      if (this.textFieldDivRef.current && this.textFieldLabelRef.current) {
        window.clearInterval(interval);
        this.setState({ canMeasure: true });
      }
    }, 50);
  }

  onBlur: StandardTextFieldProps['onBlur'] = (evt) => {
    const { onBlur: propsOnBlur } = this.props;
    this.setState({ labelHasFocus: false });
    if (propsOnBlur) {
      propsOnBlur(evt);
    }
  };

  onFocus: StandardTextFieldProps['onFocus'] = (evt) => {
    const { onFocus: propsOnFocus } = this.props;
    this.setState({ labelHasFocus: true });
    if (propsOnFocus) {
      propsOnFocus(evt);
    }
  };

  getLeft(): number {
    const divWidth = this.textFieldDivRef.current?.offsetWidth;
    const labelWidth = this.textFieldLabelRef.current?.offsetWidth;
    return divWidth !== undefined && labelWidth !== undefined
      ? (divWidth - labelWidth) / 2
      : 0;
  }

  getInputLabelProps(): BaseTextFieldProps['InputLabelProps'] {
    const { canMeasure } = this.state;
    const { InputLabelProps } = this.props;
    const showLabel = this.showPlaceholderLabel();
    return {
      ...InputLabelProps,
      ref: this.textFieldLabelRef,
      style: {
        ...InputLabelProps?.style,
        left: canMeasure ? this.getLeft() : '0px',
        visibility: showLabel ? undefined : 'hidden',
      } as React.CSSProperties,
    };
  }

  showPlaceholderLabel(): boolean {
    const { canMeasure, labelHasFocus } = this.state;
    const { value } = this.props;
    if (labelHasFocus) {
      return false;
    }
    return (value as string).length === 0 && canMeasure;
  }

  render(): JSX.Element {
    const {
      placeholder,
      /* eslint-disable @typescript-eslint/no-unused-vars */
      onBlur,
      onFocus,
      InputLabelProps,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...other
    } = this.props;

    return (
      <TextField
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...other}
        ref={this.textFieldDivRef}
        label={placeholder}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        InputLabelProps={this.getInputLabelProps()}
      />
    );
  }
}
