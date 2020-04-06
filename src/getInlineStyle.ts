import React from 'react';
import { StyleCreator, Stylesheet, ElementNode } from './index';

export function mergeStylesFromStylesheetWithNodePropertiesStyle(
  nodePropertiesStyle: React.CSSProperties | undefined,
  classNames: string[],
  stylesheet: Stylesheet
): React.CSSProperties {
  const style = nodePropertiesStyle || {};
  return classNames.reduce((styleObject, className) => {
    return { ...styleObject, ...stylesheet[className] } as React.CSSProperties;
  }, style);
}
export function getInlineStyle(
  styleCreator: StyleCreator,
  className: string[],
  nodePropertiesStyle: React.CSSProperties | undefined,
  stylesheet: Stylesheet,
  node: ElementNode
): React.CSSProperties {
  const currentStyle = mergeStylesFromStylesheetWithNodePropertiesStyle(
    nodePropertiesStyle,
    className,
    stylesheet
  );
  const style = styleCreator(currentStyle, className, node);
  return style || currentStyle;
}
