import {
  createChainedStyleCreator,
  createChainedNodeRenderInterceptor,
} from '../src/chaining';
import { expectMockFirstCallArgsToBe } from '../__test_helpers/expectExtensions';

describe('chaining', () => {
  describe('createChainedStyleCreator', () => {
    it('should create a style creator that calls each with the result of previous, undefined is ignored', () => {
      const initialStyle: React.CSSProperties = {
        color: 'red',
      };
      const secondStyle: React.CSSProperties = {
        color: 'white',
      };
      const className = ['class1', 'class2'];
      const node = {} as any;
      const initialStyleCreator = jest.fn().mockReturnValue(secondStyle);
      const undefinedStyleCreator = jest.fn();
      const finalStyleCreator = jest.fn().mockImplementation((style) => {
        style.backgroundColor = 'orange';
        return style;
      });
      const chainedStyleCreator = createChainedStyleCreator(
        initialStyleCreator,
        undefinedStyleCreator,
        finalStyleCreator
      );
      const chainedStyle = chainedStyleCreator(initialStyle, className, node);

      expectMockFirstCallArgsToBe(
        initialStyleCreator,
        initialStyle,
        className,
        node
      );
      expectMockFirstCallArgsToBe(
        undefinedStyleCreator,
        secondStyle,
        className,
        node
      );
      expectMockFirstCallArgsToBe(
        finalStyleCreator,
        secondStyle,
        className,
        node
      );
      expect(chainedStyle).toEqual({
        color: 'white',
        backgroundColor: 'orange',
      });
    });
  });
  describe('createChainedNodeRenderInterceptor', () => {
    it('should create a node render interceptor that calls each with the defined result of previous', () => {
      const initialNodeRenderDetails = {} as any;
      const secondNodeRenderDetails = {};
      const finalNodeRenderDetails = {};
      const initialNodeRenderInterceptor = jest
        .fn()
        .mockReturnValue(secondNodeRenderDetails);
      const finalNodeRenderInterceptor = jest
        .fn()
        .mockReturnValue(finalNodeRenderDetails);
      const chainedNodeRenderInterceptor = createChainedNodeRenderInterceptor(
        initialNodeRenderInterceptor,
        finalNodeRenderInterceptor
      );

      const chainedNodeRenderDetails = chainedNodeRenderInterceptor(
        initialNodeRenderDetails
      );

      expectMockFirstCallArgsToBe(
        initialNodeRenderInterceptor,
        initialNodeRenderDetails
      );
      expectMockFirstCallArgsToBe(
        finalNodeRenderInterceptor,
        secondNodeRenderDetails
      );
      expect(chainedNodeRenderDetails).toBe(finalNodeRenderDetails);
    });
    const undefinedNull: Array<undefined | null> = [undefined, null];
    undefinedNull.forEach((undefinedOrNull) => {
      it(`should break and return undefined when a node render interceptor returns ${
        undefinedOrNull === undefined ? 'undefined' : 'null'
      }`, () => {
        const initialNodeRenderInterceptor = jest.fn();
        const finalNodeRenderInterceptor = jest.fn().mockReturnValue({});
        const chainedNodeRenderInterceptor = createChainedNodeRenderInterceptor(
          initialNodeRenderInterceptor,
          finalNodeRenderInterceptor
        );

        const chainedNodeRenderDetails = chainedNodeRenderInterceptor(
          {} as any
        );

        expect(chainedNodeRenderDetails).toBeUndefined();
        expect(finalNodeRenderInterceptor).not.toHaveBeenCalled();
      });
    });
  });
});
