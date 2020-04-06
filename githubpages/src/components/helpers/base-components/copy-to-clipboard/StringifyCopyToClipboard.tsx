import React from 'react';
import { CopyToClipboard, CopyToClipboardProps } from './CopyToClipboard';

export type StringifyCopyToClipboardProps = Omit<
  CopyToClipboardProps,
  'text'
> & {
  value: object | (() => object);
};
export class StringifyCopyToClipboard extends React.PureComponent<
  StringifyCopyToClipboardProps
> {
  getText = (): string => {
    const { value: propsValue } = this.props;
    let value: object;
    if (typeof propsValue === 'function') {
      value = propsValue();
    } else {
      value = propsValue;
    }
    return JSON.stringify(value);
  };

  render(): JSX.Element {
    const { onCopy, options, children } = this.props;
    return (
      <CopyToClipboard onCopy={onCopy} options={options} text={this.getText}>
        {children}
      </CopyToClipboard>
    );
  }
}
