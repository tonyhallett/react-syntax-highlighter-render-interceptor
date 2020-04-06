import { createElement } from '../src/createElement';
import { getProps } from '../src/getProps';
import { reactCreateElement } from '../src/reactCreateElement';
import { NodeRenderDetails } from '../src';
import { createChildren } from '../src/createChildren';
import { expectMockFirstCallArgsToBe } from '../__test_helpers/expectExtensions';
jest.mock('../src/getProps');
jest.mock('../src/reactCreateElement');
jest.mock('../src/createChildren');
describe('createElement', () => {
  const mockGetProps = getProps as jest.Mock;
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const undefinedNull: [undefined, null] = [undefined, null];
  function undefinedNullString(undefinedOrNull: undefined | null) {
    return undefinedOrNull === undefined ? 'undefined' : 'null';
  }
  it('should call the nodeRenderInterceptor with the NodeRenderDetails', () => {
    const nodeRenderInterceptor = jest.fn();
    const nodeRenderDetails = {} as any;
    createElement(
      nodeRenderInterceptor,
      undefined as any,
      nodeRenderDetails,
      '1'
    );
    expect(nodeRenderInterceptor.mock.calls[0][0]).toBe(nodeRenderDetails);
  });
  undefinedNull.forEach((undefinedOrNull) => {
    it(`should return undefined if the NodeRenderInterceptor returns ${undefinedNullString(
      undefinedOrNull
    )} `, () => {
      const nodeRenderInterceptor = jest.fn().mockReturnValue(undefinedOrNull);
      expect(
        createElement(
          nodeRenderInterceptor,
          undefined as any,
          undefined as any,
          '1'
        )
      ).toBeUndefined();
    });
  });
  describe('using the intercepted NodeRenderDetails', () => {
    it('should return the node value if a text node', () => {
      const nodeRenderInterceptor = jest.fn().mockReturnValue({
        node: {
          type: 'text',
          value: 'Some text',
        },
      });
      expect(
        createElement(
          nodeRenderInterceptor,
          undefined as any,
          undefined as any,
          '1'
        )
      ).toBe('Some text');
    });
    describe('element node', () => {
      undefinedNull.forEach((undefinedOrNull) => {
        it(`should return undefined if tagName ${undefinedNullString(
          undefinedOrNull
        )}`, () => {
          const nodeRenderInterceptor = jest.fn().mockReturnValue({
            node: {
              type: 'element',
              tagName: undefinedOrNull,
            },
          });
          expect(
            createElement(
              nodeRenderInterceptor,
              undefined as any,
              undefined as any,
              '1'
            )
          ).toBeUndefined();
        });
      });

      [true, false].forEach((useInlineStyles) => {
        it('should get props', () => {
          const styleCreator = {} as any;
          const nodeRenderDetails: NodeRenderDetails = {
            key: '0',
            useInlineStyles,
            stylesheet: {},
            node: {
              type: 'element',
              tagName: 'SomeTag',
            } as any,
          };
          const nodeRenderInterceptor = jest
            .fn()
            .mockReturnValue(nodeRenderDetails);
          createElement(
            nodeRenderInterceptor,
            styleCreator,
            undefined as any,
            '1'
          );
          expectMockFirstCallArgsToBe(
            mockGetProps,
            useInlineStyles,
            nodeRenderDetails.node,
            nodeRenderDetails.stylesheet,
            styleCreator
          );
        });
      });

      [true, false].forEach((useInlineStyles) => {
        it('should call reactCreateElement with node, props, key and childCreator', () => {
          const mockCreateChildren = createChildren as jest.Mock;
          const mockCreateChildrenFn = () => {};
          mockCreateChildren.mockReturnValue(mockCreateChildrenFn);
          const mockReactCreateElement = reactCreateElement as jest.Mock;
          const mockCreatedElement = {};
          mockReactCreateElement.mockReturnValue(mockCreatedElement);
          const mockProps = { some: 'prop' };
          mockGetProps.mockReturnValue(mockProps);
          const nodeRenderDetails: NodeRenderDetails = {
            key: '999',
            useInlineStyles: useInlineStyles,
            stylesheet: {},
            node: {
              type: 'element',
              tagName: 'SomeTag',
            } as any,
          };
          const styleCreator = {} as any;
          const nodeRenderInterceptor = jest
            .fn()
            .mockReturnValue(nodeRenderDetails);
          expect(
            createElement(
              nodeRenderInterceptor,
              styleCreator,
              undefined as any,
              '2'
            )
          ).toBe(mockCreatedElement);
          expectMockFirstCallArgsToBe(
            mockReactCreateElement,
            nodeRenderDetails.node,
            mockProps,
            '999',
            mockCreateChildrenFn
          );
          expectMockFirstCallArgsToBe(
            mockCreateChildren,
            nodeRenderInterceptor,
            styleCreator,
            nodeRenderDetails.stylesheet,
            nodeRenderDetails.useInlineStyles,
            '2'
          );
        });
      });
    });
  });
});
