import React from 'react';
import * as ReactIs from "react-is";
import { ElementNode, RenderNode } from './index';


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
  if((TagName as unknown) === ReactIs.Fragment){
    return React.createElement(
      TagName,
      { key },
      children || childrenCreator(node.children)
    );
  }
  return React.createElement(
    TagName,
    { key, ...props },
    children || childrenCreator(node.children)
  );
}
