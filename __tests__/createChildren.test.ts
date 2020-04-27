import { createChildren } from '../src/createChildren';
import { createElement } from '../src/createElement';
import { getDescendantKey } from '../src/keyProvider';
import { NodeRenderDetails, TextNode } from '../src';

jest.mock('../src/createElement');
jest.mock('../src/keyProvider');
describe('createChildren', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  [true, false].forEach((useInlineStyles) => {
    it('should map children with createElement and keys from keyProvider getDescendantKey', () => {
      const mockCreateElement = createElement as jest.Mock;
      const mockGetDescendantKey = getDescendantKey as jest.Mock;
      mockGetDescendantKey
        .mockReturnValueOnce('Descendant1')
        .mockReturnValueOnce('Descendant2');
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
        const expectedDescendantKey = `Descendant${isFirst ? '1' : '2'}`;
        expect(nodeRenderDetails.key).toBe(expectedDescendantKey);

        expect(call[3]).toBe(expectedDescendantKey);
      }
      expect(getDescendantKey).toHaveBeenNthCalledWith<[string, number]>(
        1,
        'parent-key',
        0
      );
      expect(getDescendantKey).toHaveBeenNthCalledWith<[string, number]>(
        2,
        'parent-key',
        1
      );
      expectCreateElementCall(true);
      expectCreateElementCall(false);
    });
  });
});
