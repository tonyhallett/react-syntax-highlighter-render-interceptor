export function expectMockFirstCallArgsToBe(mock: jest.Mock, ...args: any[]) {
  const callArgs = mock.mock.calls[0];
  expect(callArgs.length).toBe(args.length);
  for (let i = 0; i < args.length; i++) {
    expect(callArgs[i]).toBe(args[i]);
  }
}
export function expectToBeArray(array: Array<any>, ...expected: Array<any>) {
  for (let i = 0; i < expected.length; i++) {
    expect(array[i]).toBe(expected[i]);
  }
}
export function expectToBeArrayStrict(
  array: Array<any>,
  ...expected: Array<any>
) {
  expect(array.length).toBe(expected.length);
  expectToBeArray(array, ...expected);
}
