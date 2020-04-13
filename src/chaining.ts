import { StyleCreator, NodeRenderInterceptor } from './index';

export function createChainedStyleCreator(
  ...styleCreators: Array<StyleCreator | undefined>
): StyleCreator {
  const chainedStyleCreator: StyleCreator = (
    currentStyle,
    classNames,
    node
  ) => {
    let accumulatedStyle = currentStyle;
    styleCreators.forEach((sc) => {
      if (sc) {
        const newStyle = sc(accumulatedStyle, classNames, node);
        if (newStyle) accumulatedStyle = newStyle;
      }
    });
    return accumulatedStyle;
  };
  return chainedStyleCreator;
}

export function createChainedNodeRenderInterceptor(
  ...nodeRenderInterceptors: Array<NodeRenderInterceptor | undefined>
): NodeRenderInterceptor {
  const chainedRenderInterceptor: NodeRenderInterceptor = (
    nodeRenderDetails
  ) => {
    let accumulatedNodeRenderDetails = nodeRenderDetails;
    for (let i = 0; i < nodeRenderInterceptors.length; i += 1) {
      const nodeRenderInterceptor = nodeRenderInterceptors[i];
      if (nodeRenderInterceptor) {
        const renderDetails = nodeRenderInterceptor(
          accumulatedNodeRenderDetails
        );
        if (renderDetails) {
          accumulatedNodeRenderDetails = renderDetails;
        } else {
          return undefined;
        }
      }
    }
    return accumulatedNodeRenderDetails;
  };
  return chainedRenderInterceptor;
}
