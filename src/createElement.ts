import React from 'react';
import {
  NodeRenderInterceptor,
  StyleCreator,
  NodeRenderDetails,
} from './index';
import { createChildren } from './createChildren';
import { getProps } from './getProps';
import { reactCreateElement } from './reactCreateElement';

export function createElement(
  interceptor: NodeRenderInterceptor,
  styleCreator: StyleCreator,
  details: NodeRenderDetails,
  parentKey: string
): React.ReactNode | undefined {
  const interceptedDetails = interceptor(details);
  if (interceptedDetails) {
    const { node } = interceptedDetails;
    if (node.type === 'text') {
      return node.value;
    }

    const TagName = node.tagName;
    if (TagName) {
      const { stylesheet, useInlineStyles } = interceptedDetails;
      const childrenCreator = createChildren(
        interceptor,
        styleCreator,
        stylesheet,
        useInlineStyles,
        parentKey
      );
      const props = getProps(useInlineStyles, node, stylesheet, styleCreator);
      return reactCreateElement(
        node,
        props,
        interceptedDetails.key,
        childrenCreator
      );
    }
  }
  return undefined;
}
