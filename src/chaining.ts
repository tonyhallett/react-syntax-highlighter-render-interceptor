import { StyleCreator, NodeRenderInterceptor } from './index';

export function createChainedStyleCreator(
  ...styleCreators: StyleCreator[]
): StyleCreator {
  const chainedStyleCreator: StyleCreator = (
    currentStyle,
    classNames,
    node
  ) => {
    let accumulatedStyle = currentStyle;
    styleCreators.forEach((sc) => {
      const newStyle = sc(accumulatedStyle, classNames, node);
      if (newStyle) accumulatedStyle = newStyle;
    });
    return accumulatedStyle;
  };
  return chainedStyleCreator;
}

export function createChainedNodeRenderInterceptor(
  ...nodeRenderInterceptors: NodeRenderInterceptor[]
): NodeRenderInterceptor {
  const chainedRenderInterceptor: NodeRenderInterceptor = (
    nodeRenderDetails
  ) => {
    let accumulatedNodeRenderDetails = nodeRenderDetails;
    for (let i = 0; i < nodeRenderInterceptors.length; i += 1) {
      const renderDetails = nodeRenderInterceptors[i](
        accumulatedNodeRenderDetails
      );
      if (renderDetails) {
        accumulatedNodeRenderDetails = renderDetails;
      } else {
        return undefined;
      }
    }
    return accumulatedNodeRenderDetails;
  };
  return chainedRenderInterceptor;
}
