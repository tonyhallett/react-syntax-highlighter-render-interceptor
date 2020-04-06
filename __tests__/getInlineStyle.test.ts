import { getInlineStyle } from '../src/getInlineStyle';
import { Stylesheet } from '../src';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/agate';
import { expectMockFirstCallArgsToBe } from '../__test_helpers/expectExtensions';

describe('getInlineStyle', () => {
  describe('should call the styleCreator with merged styles from stylesheet with node properties style', () => {
    interface MergedStylesTest {
      description: string;
      nodeClassNames: string[];
      nodePropertiesStyle: React.CSSProperties | undefined;
      stylesheet: Stylesheet;
      expectedMergedStyle: React.CSSProperties;
    }
    const mergedStylesTests: MergedStylesTest[] = [
      {
        description: 'Does not throw with no node properties style',
        nodeClassNames: [],
        stylesheet: {},
        nodePropertiesStyle: undefined,
        expectedMergedStyle: {},
      },
      {
        description: 'Stylesheet overrides node properties style',
        nodeClassNames: ['nodeClass'],
        stylesheet: {
          nodeClass: {
            color: 'red',
            backgroundColor: 'white',
          },
        },
        nodePropertiesStyle: {
          color: 'orange',
          fontWeight: 'bolder',
        },
        expectedMergedStyle: {
          color: 'red',
          backgroundColor: 'white',
          fontWeight: 'bolder',
        },
      },
    ];
    mergedStylesTests.forEach((test) => {
      it(test.description, () => {
        const styleCreator = jest.fn();
        const node = {} as any;
        getInlineStyle(
          styleCreator,
          test.nodeClassNames,
          test.nodePropertiesStyle,
          test.stylesheet,
          node
        );
        const styleCreatorCallArgs = styleCreator.mock.calls[0];
        expect(styleCreatorCallArgs[0]).toEqual(test.expectedMergedStyle);
        expect(styleCreatorCallArgs[1]).toBe(test.nodeClassNames);
        expect(styleCreatorCallArgs[2]).toBe(node);
      });
    });
  });
  it('should return the style from the style creator if defined', () => {
    const styleCreatorStyle = {};
    const styleCreator = jest.fn().mockReturnValue(styleCreatorStyle);

    expect(getInlineStyle(styleCreator, [], undefined, {}, {} as any)).toBe(
      styleCreatorStyle
    );
  });
  it('should return the merged styles if the style creator returns undefined', () => {
    const styleCreator = jest.fn();
    expect(getInlineStyle(styleCreator, [], undefined, {}, {} as any)).toEqual(
      {}
    );
  });
});
