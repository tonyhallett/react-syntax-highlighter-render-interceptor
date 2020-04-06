import React from 'react';
import { reactCreateElement } from '../src/reactCreateElement';
import { createChildren } from '../src/createChildren';

jest.mock('../src/createChildren');

describe('reactCreateElement', () => {
  let createdReactElement = {};
  const mockReactCreateElement = jest.fn().mockReturnValue(createdReactElement);
  React.createElement = mockReactCreateElement;
  const props = { prop: 'value' };
  const propsWithChildren = { prop: 'value', children: 'Children' };
  const key = '999';
  const node = {
    tagName: 'SomeTag',
    children: [{ child: 'node' }],
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  function expectChildrenArgument(expected: any) {
    expect(mockReactCreateElement.mock.calls[0][2]).toBe(expected);
  }
  function expectReactCreateElementCalledCommon(pWithChildren: boolean) {
    const createElementCallArgs = mockReactCreateElement.mock.calls[0];
    expect(createElementCallArgs[0]).toBe(node.tagName);
    expect(createElementCallArgs[1]).toEqual({
      key,
      ...(pWithChildren ? propsWithChildren : props),
    });
  }
  it('should not use the child creator if children on props', () => {
    expect(
      reactCreateElement(
        node as any,
        propsWithChildren as any,
        key,
        undefined as any
      )
    ).toBe(createdReactElement);
    expectReactCreateElementCalledCommon(true);
    expectChildrenArgument(propsWithChildren.children);
  });
  it('should use the child creator for children if children not on props', () => {
    const mockCreateChildren = createChildren as jest.Mock;
    const mockChildren: any[] = [];
    mockCreateChildren.mockReturnValue(mockChildren);
    expect(
      reactCreateElement(node as any, props as any, key, mockCreateChildren)
    ).toBe(createdReactElement);
    expectReactCreateElementCalledCommon(false);
    expectChildrenArgument(mockChildren);
    expect(mockCreateChildren).toHaveBeenCalledWith(node.children);
  });
});
