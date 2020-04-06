import { createElement } from './createElement';

export {
  createChainedNodeRenderInterceptor,
  createChainedStyleCreator,
} from './chaining';

export type RenderNode = ElementNode | TextNode;
export interface ElementNode {
  type: 'element';
  tagName: React.FunctionComponent | React.ComponentClass | string;
  properties: {
    className: Array<string>;
    style?: React.CSSProperties;
    [index: string]: unknown;
  };
  children: Array<RenderNode>;
  [index: string]: unknown;
}
export interface TextNode {
  type: 'text';
  value: string;
}
export interface Stylesheet {
  [key: string]: React.CSSProperties;
}

export interface NodeRenderDetails {
  key: string;
  node: RenderNode;
  stylesheet: Stylesheet;
  useInlineStyles: boolean;
}

export interface StyleCreator {
  (currentStyle: React.CSSProperties, classNames: string[], node: ElementNode):
    | React.CSSProperties
    | undefined;
}
export interface NodeRenderInterceptor {
  (nodeRenderDetails: NodeRenderDetails): NodeRenderDetails | undefined;
}

export interface CustomRendererDetails {
  rows: Array<RenderNode>;
  stylesheet: Stylesheet;
  useInlineStyles: boolean;
}
export function createCustomRenderer(
  styleCreator: StyleCreator = (style): React.CSSProperties => style,
  interceptor: NodeRenderInterceptor = (d): NodeRenderDetails => d
): CustomRenderer {
  return (details: CustomRendererDetails): React.ReactNode[] => {
    return details.rows.map((node, i) => {
      const key = `code-segment-${i}`;
      return createElement(
        interceptor,
        styleCreator,
        {
          node,
          stylesheet: details.stylesheet,
          useInlineStyles: details.useInlineStyles,
          key,
        },
        key
      );
    });
  };
}

export interface CustomRenderer {
  (details: CustomRendererDetails): React.ReactNode[];
}
