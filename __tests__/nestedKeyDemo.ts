import {
  ElementNode,
  RenderNode,
  createCustomRenderer,
  TextNode,
} from '../src';

jest.mock('../src/reactCreateElement', () => {
  return {
    reactCreateElement: (
      node: ElementNode,
      props: any,
      key: string,
      childrenCreator: (children: RenderNode[]) => any
    ) => {
      return {
        key,
        children: childrenCreator(node.children),
      };
    },
  };
});
describe.skip('demo nested keys', () => {
  const customRenderer = createCustomRenderer();
  function createElementNodeNoChildren(): ElementNode {
    return {
      tagName: 'Tag',
      type: 'element' as 'element',
      properties: {
        className: [],
      },
      children: [],
    };
  }
  function createGrandchild() {
    const gc = createElementNodeNoChildren();
    gc.children.push({ type: 'text', value: 'gc', children: [] } as TextNode);
    return gc;
  }
  function createRowChild() {
    const child = createElementNodeNoChildren();
    child.children.push(createGrandchild(), createGrandchild());
    return child;
  }
  function createRow() {
    const row = createElementNodeNoChildren();
    row.children.push(createRowChild(), createRowChild());
    return row;
  }
  test('what are the keys?', () => {
    interface TestNode {
      key: string;
      children: TestNode[];
    }
    const rendered = (customRenderer({
      rows: [createRow(), createRow()],
      useInlineStyles: true,
      stylesheet: {},
    }) as any) as Array<TestNode>;
    const tabSize = 4;
    let keyDetails = '';
    rendered.forEach((n) => {
      logNode(n, 0);
    });
    function logKey(key: string, level: number) {
      if (key) {
        const numTabs = tabSize * level;
        let indent = '';
        for (let i = 0; i < numTabs; i++) {
          indent += ' ';
        }
        keyDetails += `${indent}${key}`;
        keyDetails += '\n';
      }
    }
    function logNode(testNode: TestNode, level: number) {
      logKey(testNode.key, level);

      if (testNode.children) {
        testNode.children.forEach((c) => logNode(c, level + 1));
      }
    }
    console.log(keyDetails);
  });
});
