import { prismLangs, hljsLangs } from './languagesAndStylesProvider';

export interface LanguageDetails {
  language: string;
  isCommon: boolean;
}
export const commonLanguageNames = prismLangs.filter(
  (pl) => hljsLangs.indexOf(pl) !== -1
);
export const commonLanguages = commonLanguageNames.map((n) => ({
  language: n,
  isCommon: true,
}));

function onlyLanguages(
  languages: string[]
): { language: string; isCommon: boolean }[] {
  return languages
    .filter((l) => commonLanguageNames.indexOf(l) === -1)
    .map((n) => ({ language: n, isCommon: false }));
}
export const prismOnlyLanguages = onlyLanguages(prismLangs);
export const hljsOnlyLanguages = onlyLanguages(hljsLangs);
