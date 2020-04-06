/* eslint-disable @typescript-eslint/no-var-requires */
import * as HljsStyles from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import * as PrismStyles from 'react-syntax-highlighter/dist/cjs/styles/prism';

const PrismLanguages = require('react-syntax-highlighter/dist/cjs/languages/prism');
const HljsLanguages = require('react-syntax-highlighter/dist/cjs/languages/hljs');

export type HighlighterStyle = Record<string, Record<string, string>>;
export interface StyleDetails {
  name: string;
  isBuiltIn: boolean;
  style: HighlighterStyle;
}

function getNames(obj: object): string[] {
  return Object.getOwnPropertyNames(obj).filter((sheet) => {
    return sheet !== '__esModule';
  });
}

function getStyleDetails(
  obj: Record<string, HighlighterStyle>
): StyleDetails[] {
  return getNames(obj).map((name) => {
    const style = obj[name];
    return {
      isBuiltIn: true,
      name,
      style,
    };
  });
}

export const prismStyles = getStyleDetails(PrismStyles);
export const hljsStyles = getStyleDetails(HljsStyles);
export const prismLangs = getNames(PrismLanguages);
export const hljsLangs = getNames(HljsLanguages);
