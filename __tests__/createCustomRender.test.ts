import {
  createCustomRenderer,
  CustomRendererDetails,
  NodeRenderDetails,
  StyleCreator,
  NodeRenderInterceptor,
  ElementNode,
} from '../src/index';
import { createElement } from '../src/createElement';
import {
  expectToBeArray,
  expectToBeArrayStrict,
} from '../__test_helpers/expectExtensions';
jest.mock('../src/createElement');
describe('createCustomRenderer', () => {
  const createdElement1 = {};
  const createdElement2 = {};
  const mockCreateElement = createElement as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    mockCreateElement
      .mockReturnValueOnce(createdElement1)
      .mockReturnValueOnce(createdElement2);
  });
  const useInlineStylesOptions = [true, false];
  useInlineStylesOptions.forEach((useInlineStyles) => {
    it(`should return a function that will map rows with createElement - useInlineStyles ${useInlineStyles}`, () => {
      const styleCreator = {} as any;
      const nodeRenderInterceptor = {} as any;
      const row1 = {} as any;
      const row2 = {} as any;
      const customRendererDetails: CustomRendererDetails = {
        stylesheet: {},
        useInlineStyles,
        rows: [row1, row2],
      };
      function expectCreateElementCall(callArgs: Array<any>, isFirst: boolean) {
        expectToBeArray(callArgs, nodeRenderInterceptor, styleCreator);
        const nodeRenderDetails: NodeRenderDetails = callArgs[2];
        expect(nodeRenderDetails.node).toBe(isFirst ? row1 : row2);
        expect(nodeRenderDetails.stylesheet).toBe(
          customRendererDetails.stylesheet
        );
        expect(nodeRenderDetails.useInlineStyles).toBe(
          customRendererDetails.useInlineStyles
        );
        expect(nodeRenderDetails.key).toBe(`code-segment-${isFirst ? 0 : 1}`);
      }
      const customRenderer = createCustomRenderer(
        styleCreator,
        nodeRenderInterceptor
      );
      const rendered = customRenderer(customRendererDetails);
      expectToBeArrayStrict(rendered, createdElement1, createdElement2);
      const createElementCalls = mockCreateElement.mock.calls;
      expectCreateElementCall(createElementCalls[0], true);
      expectCreateElementCall(createElementCalls[1], false);
    });
  });
  describe('default style creator and node render interceptor', () => {
    describe('style creator', () => {
      it('should return the style, and not change the arguments', () => {
        const customRenderer = createCustomRenderer();
        customRenderer({
          rows: [
            {
              type: 'element',
              tagName: 'sometag',
              properties: {
                className: [],
              },
              children: [],
            },
          ],
          stylesheet: {},
          useInlineStyles: true,
        });
        const defaultStyleCreator: StyleCreator =
          mockCreateElement.mock.calls[0][1];
        const style = { color: 'white' };
        const className = ['class1'];
        const node: ElementNode = {
          type: 'element',
          tagName: 'sometag',
          properties: {
            className: ['class1'],
            style: {
              backgroundColor: 'white',
            },
          },
          children: [
            {
              type: 'text',
              value: 'value',
            },
          ],
        };
        const expectedNodeToEqual = {
          type: 'element',
          tagName: 'sometag',
          properties: {
            className: ['class1'],
            style: {
              backgroundColor: 'white',
            },
          },
          children: [
            {
              type: 'text',
              value: 'value',
            },
          ],
        };
        const defaultReturnedStyle = defaultStyleCreator(
          style,
          className,
          node
        );
        expect(defaultReturnedStyle).toBe(style);
        expect(defaultReturnedStyle).toEqual(style);
        expect(className).toEqual(['class1']);
        expect(node).toEqual(expectedNodeToEqual);
      });
    });
    describe('node render interceptor', () => {
      it('should return without changing the node render details', () => {
        const customRenderer = createCustomRenderer();
        customRenderer({
          rows: [
            {
              type: 'element',
              tagName: 'sometag',
              properties: {
                className: [],
              },
              children: [],
            },
          ],
          stylesheet: {},
          useInlineStyles: true,
        });
        const defaultNodeRenderInterceptor: NodeRenderInterceptor =
          mockCreateElement.mock.calls[0][0];
        const textNodeRenderDetails: NodeRenderDetails = {
          stylesheet: { class1: { color: 'red' } },
          useInlineStyles: false,
          key: '1',
          node: {
            type: 'text',
            value: 'value',
          },
        };
        const expectedTextNodeEquals = {
          stylesheet: { class1: { color: 'red' } },
          useInlineStyles: false,
          key: '1',
          node: {
            type: 'text',
            value: 'value',
          },
        };
        const elementNodeRenderDetails: NodeRenderDetails = {
          key: '1',
          stylesheet: { class1: { color: 'red' } },
          useInlineStyles: false,
          node: {
            type: 'element',
            tagName: 'sometag',
            properties: {
              className: ['class1'],
              style: {
                backgroundColor: 'white',
              },
            },
            children: [
              {
                type: 'text',
                value: 'value',
              },
            ],
          },
        };
        const expectedElementNodeRenderDetailsToEqual: NodeRenderDetails = {
          key: '1',
          stylesheet: { class1: { color: 'red' } },
          useInlineStyles: false,
          node: {
            type: 'element',
            tagName: 'sometag',
            properties: {
              className: ['class1'],
              style: {
                backgroundColor: 'white',
              },
            },
            children: [
              {
                type: 'text',
                value: 'value',
              },
            ],
          },
        };
        let defaultTextNodeRenderDetails = defaultNodeRenderInterceptor(
          textNodeRenderDetails
        );
        expect(defaultTextNodeRenderDetails).toBe(textNodeRenderDetails);
        expect(defaultTextNodeRenderDetails).toEqual(expectedTextNodeEquals);

        defaultTextNodeRenderDetails = defaultNodeRenderInterceptor(
          elementNodeRenderDetails
        );
        expect(defaultTextNodeRenderDetails).toBe(elementNodeRenderDetails);
        expect(defaultTextNodeRenderDetails).toEqual(
          expectedElementNodeRenderDetailsToEqual
        );
      });
    });
  });
});
