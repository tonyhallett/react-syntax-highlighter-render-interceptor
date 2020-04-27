import React from 'react';
import * as ReactIs from 'react-is';
import { ElementNode, RenderNode } from './index';

const voidElements = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];
function isVoidElement(tagName: string): boolean {
  return voidElements.indexOf(tagName) !== -1;
}
function shouldProcessChildren(tagName: ElementNode['tagName']): boolean {
  let processChildren = true;
  if (typeof tagName === 'string' && isVoidElement(tagName)) {
    processChildren = false;
  }
  return processChildren;
}

export function reactCreateElement(
  node: ElementNode,
  props: {
    className: string;
    style?: React.CSSProperties;
    children?: React.ReactNode[];
    [index: string]: unknown;
  },
  key: string,
  childrenCreator: (children: RenderNode[]) => React.ReactNode[]
): React.ReactNode {
  const { children } = props;
  const TagName = node.tagName;
  if ((TagName as unknown) === ReactIs.Fragment) {
    return React.createElement(
      TagName,
      { key },
      children || childrenCreator(node.children)
    );
  }
  return React.createElement(
    TagName,
    { key, ...props },
    shouldProcessChildren(TagName)
      ? children || childrenCreator(node.children)
      : undefined
  );
}
