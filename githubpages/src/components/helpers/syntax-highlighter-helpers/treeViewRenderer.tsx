/* eslint-disable no-param-reassign */
import * as React from 'react';
import { TreeItem } from '@material-ui/lab';
import {
  NodeRenderDetails,
  ElementNode,
  NodeRenderInterceptor,
  createCustomRenderer,
} from '../../../../../dist';

function TextLabel({ value }: { value: string }): JSX.Element {
  let text = '';
  if (value === '') {
    text = 'NO VALUE';
  } else {
    const showCarCodes = value.trim() === '';
    // eslint-disable-next-line no-cond-assign
    for (let x = 0, c = ''; (c = value.charAt(x)); x += 1) {
      if (showCarCodes) {
        if (c.trim() === '') {
          text += `${c.charCodeAt(0).toString()} `;
        } else {
          text += c;
        }
      } else {
        text += c;
      }
    }
  }

  return <span style={{ color: 'green' }}>{text}</span>;
}
function ElementLabel(props: {
  className: string[];
  rshKey: string;
  wrapLines: boolean;
}): JSX.Element {
  const { wrapLines, rshKey, className } = props;
  let prefix = '';
  let isLine = false;
  if (wrapLines) {
    const end = rshKey.substring(13);
    if (end.indexOf('-') === -1) {
      isLine = true;
      prefix = `line: ${end}: `;
    }
  }
  const classNames = className.join(' ');
  if (classNames === '' && !isLine) {
    return (
      <span>
        <span>{prefix}</span>
        <span style={{ color: 'red' }}>---</span>
      </span>
    );
  }
  return <span>{prefix + classNames}</span>;
}
function createTextNodeTreeItem(key: string, value: string): ElementNode {
  return {
    type: 'element',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tagName: TreeItem as any,
    properties: {
      nodeId: key,
      label: <TextLabel value={value} />,
      className: [],
    },
    children: [],
  };
}
function mapElementNodeToTreeItem(
  node: ElementNode,
  key: string,
  isWrapLines: boolean
): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node.tagName = TreeItem as any;
  node.properties = {
    nodeId: key,
    label: (
      <ElementLabel
        wrapLines={isWrapLines}
        rshKey={key}
        className={node.properties.className}
      />
    ),
    className: node.properties.className,
  };
}
const mapNode = (
  nodeRenderDetails: NodeRenderDetails,
  isWrapLines: boolean
): NodeRenderDetails => {
  const { key, node } = nodeRenderDetails;
  if (node.type === 'text') {
    nodeRenderDetails.node = createTextNodeTreeItem(key, node.value);
  } else {
    mapElementNodeToTreeItem(node, key, isWrapLines);
  }
  return nodeRenderDetails;
};
const treeViewInterceptor: NodeRenderInterceptor = (nodeRenderDetails) => {
  return mapNode(nodeRenderDetails, false);
};
const wrapLinesTreeViewInterceptor: NodeRenderInterceptor = (
  nodeRenderDetails
) => {
  return mapNode(nodeRenderDetails, true);
};
export const treeViewRenderer = createCustomRenderer(
  undefined,
  treeViewInterceptor
);
export const treeViewRendererWrapLinesRenderer = createCustomRenderer(
  undefined,
  wrapLinesTreeViewInterceptor
);
