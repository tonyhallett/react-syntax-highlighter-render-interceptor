/* eslint-disable import/prefer-default-export */
import { getInlineStyle } from './getInlineStyle';
import { ElementNode, Stylesheet, StyleCreator } from './index';

function createClassNameString(classNames: Array<string>): string {
  return classNames.join(' ');
}
export function getProps(
  useInlineStyles: boolean,
  node: ElementNode,
  stylesheet: Stylesheet,
  styleCreator: StyleCreator
): { className: string } & Omit<ElementNode['properties'], 'className'> {
  const { properties } = node;
  let { className } = properties;
  let inlineOnlyStyleProp: { style: React.CSSProperties } | undefined;
  if (useInlineStyles) {
    const sSheet = stylesheet || {};
    className = className.filter((cn) => {
      return !sSheet[cn];
    });
    inlineOnlyStyleProp = {
      style: getInlineStyle(
        styleCreator,
        properties.className,
        properties.style,
        sSheet,
        node
      ),
    };
  }
  return {
    ...properties,
    ...inlineOnlyStyleProp,
    ...{
      className: createClassNameString(className),
    },
  };
}
