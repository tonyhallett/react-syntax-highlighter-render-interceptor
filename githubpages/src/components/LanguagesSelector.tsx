import * as React from 'react';
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Paper,
  Theme,
  makeStyles,
} from '@material-ui/core';
import {
  commonLanguages,
  prismOnlyLanguages,
  hljsOnlyLanguages,
  LanguageDetails,
} from './helpers/syntax-highlighter-helpers/commonLanguageProvider';
import { SmallSingleAutoComplete } from './helpers/base-components/SmallSingleAutoComplete';

const useStyles = makeStyles((theme: Theme) => ({
  commonStyle: {
    '& .MuiInputBase-root': {
      color: theme.palette.grey[600],
    },
  },
}));
export interface LanguagesSelectorProps {
  prismLanguageChanged: (language: LanguageDetails | null) => void;
  hljsLanguageChanged: (language: LanguageDetails | null) => void;
  commonLanguageChanged: (language: LanguageDetails | null) => void;
  prismLanguage: LanguageDetails | null;
  hljsLanguage: LanguageDetails | null;
  commonLanguage: LanguageDetails | null;
  languageChangeClearsCode: boolean;
  languageChangeClearsCodeChanged: (clearsCode: boolean) => void;
}

export class LanguagesSelector extends React.Component<LanguagesSelectorProps> {
  commonLanguageChanged = (
    selectedCommonLanguage: LanguageDetails | null
  ): void => {
    const {
      hljsLanguageChanged,
      prismLanguageChanged,
      commonLanguageChanged,
    } = this.props;
    hljsLanguageChanged(selectedCommonLanguage);
    prismLanguageChanged(selectedCommonLanguage);
    commonLanguageChanged(selectedCommonLanguage);
  };

  prismLanguageChanged = (
    selectedPrismLanguage: LanguageDetails | null
  ): void => {
    const {
      hljsLanguageChanged,
      prismLanguageChanged,
      commonLanguageChanged,
    } = this.props;
    prismLanguageChanged(selectedPrismLanguage);
    hljsLanguageChanged(null); // as only have a single code editor
    commonLanguageChanged(null);
  };

  hljsLanguageChanged = (
    selectedHljsLanguage: LanguageDetails | null
  ): void => {
    const {
      hljsLanguageChanged,
      prismLanguageChanged,
      commonLanguageChanged,
    } = this.props;
    hljsLanguageChanged(selectedHljsLanguage);
    prismLanguageChanged(null); // as only have a single code editor
    commonLanguageChanged(null);
  };

  render(): JSX.Element {
    const {
      languageChangeClearsCode,
      languageChangeClearsCodeChanged,
      commonLanguage,
      prismLanguage,
      hljsLanguage,
    } = this.props;
    return (
      <Paper>
        <Box p={1}>
          <Box mb={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={languageChangeClearsCode}
                  onChange={(evt): void =>
                    languageChangeClearsCodeChanged(evt.target.checked)
                  }
                />
              }
              label="Language Change Clears Code"
            />
          </Box>
          <LanguageSelection
            language={commonLanguage}
            languages={commonLanguages}
            languageChanged={this.commonLanguageChanged}
            textLabel="Common"
          />
          <LanguageSelection
            language={prismLanguage}
            languages={prismOnlyLanguages}
            languageChanged={this.prismLanguageChanged}
            isCommon
            textLabel="Prism Only"
          />
          <LanguageSelection
            language={hljsLanguage}
            languages={hljsOnlyLanguages}
            languageChanged={this.hljsLanguageChanged}
            isCommon
            textLabel="Hljs Only"
          />
        </Box>
      </Paper>
    );
  }
}
function LanguageSelection({
  language,
  languages,
  languageChanged,
  isCommon,
  textLabel,
}: {
  language: LanguageDetails | null;
  languages: LanguageDetails[];
  languageChanged: (language: LanguageDetails | null) => void;
  isCommon?: true;
  textLabel: string;
}): JSX.Element {
  const classes = useStyles();
  let textClassName: string | undefined;
  if (isCommon && language && language.isCommon) {
    textClassName = classes.commonStyle;
  }
  const getOptionLabel = isCommon
    ? (languageDetails: LanguageDetails): string => {
        if (languageDetails.isCommon) {
          return `${languageDetails.language} ( common )`;
        }
        return languageDetails.language;
      }
    : (languageDetails: LanguageDetails): string => languageDetails.language;

  return (
    <Box mb={1}>
      <SmallSingleAutoComplete
        value={language}
        options={languages}
        getOptionLabel={getOptionLabel}
        renderInput={(params): JSX.Element => (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            className={textClassName}
            label={`Select ${textLabel} Language`}
            variant="outlined"
            fullWidth
          />
        )}
        onChange={(_, value): void => {
          languageChanged(value);
        }}
      />
    </Box>
  );
}
