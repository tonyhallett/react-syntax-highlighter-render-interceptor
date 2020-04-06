import { createChildren } from '../src/createChildren';
import { createElement } from '../src/createElement';
import { NodeRenderDetails, TextNode } from '../src';

jest.mock('../src/createElement');
describe('createChildren', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  [true, false].forEach((useInlineStyles) => {
    it('should map children with createElement and keys to be parent key - index', () => {
      const mockCreateElement = createElement as jest.Mock;
      mockCreateElement.mockReturnValueOnce(1).mockReturnValueOnce(2);
      const nodeRenderInterceptor = { cat: 'dog' } as any;
      const styleCreator = {} as any;
      const stylesheet = {};

      const createChildrenFunction = createChildren(
        nodeRenderInterceptor,
        styleCreator,
        stylesheet,
        useInlineStyles,
        'parent-key'
      );
      const nodes: TextNode[] = [
        {
          type: 'text',
          value: 'value',
        },
        {
          type: 'text',
          value: 'value2',
        },
      ];
      const children = createChildrenFunction(nodes);
      expect(children).toEqual([1, 2]);

      function expectCreateElementCall(isFirst: boolean) {
        const index = isFirst ? 0 : 1;
        const call = mockCreateElement.mock.calls[index];
        expect(call[0]).toBe(nodeRenderInterceptor);
        expect(call[1]).toBe(styleCreator);

        const nodeRenderDetails: NodeRenderDetails = call[2];
        expect(nodeRenderDetails.node).toBe(nodes[index]);
        expect(nodeRenderDetails.stylesheet).toBe(stylesheet);
        expect(nodeRenderDetails.useInlineStyles).toBe(useInlineStyles);
        expect(nodeRenderDetails.key).toBe(`parent-key-${index}`);

        expect(call[3]).toBe(`parent-key-${index}`);
      }
      expectCreateElementCall(true);
      expectCreateElementCall(false);
    });
  });
});
