import { createElement } from './createElement';
import { getDescendantKey } from './keyProvider';

import {
  NodeRenderInterceptor,
  StyleCreator,
  Stylesheet,
  RenderNode,
} from './index';

export function createChildren(
  interceptor: NodeRenderInterceptor,
  styleCreator: StyleCreator,
  stylesheet: Stylesheet,
  useInlineStyles: boolean,
  parentKey: string
) {
  return (
    children: Array<RenderNode>
  ): Array<ReturnType<typeof createElement>> => {
    return children.map((child, i) => {
      const key = getDescendantKey(parentKey, i);
      return createElement(
        interceptor,
        styleCreator,
        {
          node: child,

          stylesheet,
          useInlineStyles,

          key,
        },
        key
      );
    });
  };
}
