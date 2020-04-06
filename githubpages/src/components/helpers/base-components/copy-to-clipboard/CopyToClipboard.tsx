import React from 'react';
import copy from 'copy-to-clipboard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChildClickerProps = { onClick: (evt?: any) => void };

export interface CopyToClipboardProps {
  text: string | (() => string);
  onCopy?: (text: string, result: boolean) => void;
  options?: { debug: boolean; message: string; format: string };
  children: React.ReactElement<ChildClickerProps>;
}

interface CopyToClipboardChildProps {
  props: Readonly<CopyToClipboardProps>;
}

export class CopyToClipboard extends React.PureComponent<CopyToClipboardProps>
  implements CopyToClipboardChildProps {
  onClick: ChildClickerProps['onClick'] = (event) => {
    const { onCopy, options, children } = this.props;
    let { text } = this.props;
    const elem = children;

    if (typeof text !== 'string') {
      text = text();
    }
    const result = copy(text, options);

    if (onCopy) {
      onCopy(text, result);
    }

    if (elem && elem.props && typeof elem.props.onClick === 'function') {
      elem.props.onClick(event);
    }
  };

  render(): JSX.Element {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      text,
      onCopy,
      options,
      children,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...props
    } = this.props;

    return React.cloneElement<ChildClickerProps>(children, {
      ...props,
      onClick: this.onClick,
    });
  }
}
