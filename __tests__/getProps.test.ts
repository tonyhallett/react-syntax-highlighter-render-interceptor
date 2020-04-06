import { getProps } from '../src/getProps';
import { getInlineStyle } from '../src/getInlineStyle';
import { expectToBeArray } from '../__test_helpers/expectExtensions';
jest.mock('../src/getInlineStyle');

describe('getProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('inlineStyle', () => {
    interface InlineStyleTest {
      stylesheet: object | undefined;
      description: string;
      className: string[];
      expectedClassName: string;
    }
    describe('should have node.properties, joined class names not in stylesheet and style from getStyle', () => {
      const inlineStyleTests: InlineStyleTest[] = [
        {
          className: ['notin1', 'in', 'notin2'],
          description: 'filtering out class name in stylesheet',
          expectedClassName: 'notin1 notin2',
          stylesheet: {
            in: {},
          },
        },
        {
          className: ['notin'],
          description: 'no stylesheet does not throw',
          expectedClassName: 'notin',
          stylesheet: undefined,
        },
      ];
      inlineStyleTests.forEach((test) => {
        it(test.description, () => {
          const mockGetInlineStyle = getInlineStyle as jest.Mock;
          const mockStyle = {
            color: 'red',
          };
          mockGetInlineStyle.mockReturnValue(mockStyle);
          const styleCreator = {} as any;
          const propertiesStyle = { some: 'style' };
          const elementNode = {
            properties: {
              className: test.className,
              customProp: 'Custom',
              style: propertiesStyle,
            },
          };
          const props = getProps(
            true,
            elementNode as any,
            test.stylesheet as any,
            styleCreator
          );
          expect(props).toEqual({
            className: test.expectedClassName,
            style: { ...mockStyle },
            customProp: 'Custom',
          });

          const mockGetStyleArgs = mockGetInlineStyle.mock.calls[0];
          expectToBeArray(
            mockGetStyleArgs,
            styleCreator,
            test.className,
            propertiesStyle
          );
          if (test.stylesheet) {
            expect(mockGetStyleArgs[3]).toBe(test.stylesheet);
          } else {
            expect(mockGetStyleArgs[3]).toEqual({}); //default stylesheet
          }
          expect(mockGetStyleArgs[4]).toBe(elementNode);
        });
      });
    });
  });
  describe('class name style', () => {
    it('should have node.properties and joined class names', () => {
      const props = getProps(
        false,
        {
          properties: {
            className: ['One', 'Two'],
            customProp: 'Custom',
          },
        } as any,
        undefined as any,
        undefined as any
      );
      expect(props).toEqual({ className: 'One Two', customProp: 'Custom' });
    });
  });
});
