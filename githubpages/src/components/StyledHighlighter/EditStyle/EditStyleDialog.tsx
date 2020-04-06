import React from 'react';
import {
  DialogContent,
  Checkbox,
  FormControlLabel,
  Box,
  Theme,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { CopyToClipboardWithIcon } from '../../helpers/base-components/copy-to-clipboard/CopyToClipboardWithIcon';
import { StyleEditor } from './StyleEditor/StyleEditor';
import { SyntaxHighlighter } from '../../SyntaxHighlighter';
import { FullScreenDialog } from '../../helpers/base-components/dialogs/FullScreenDialog';
import { SmallElevationPaddedPaper } from '../../helpers/base-components/SmallElevationPaddedPaper';
import { HighlighterStyle } from '../../helpers/syntax-highlighter-helpers/languagesAndStylesProvider';

export interface EditStyleProps {
  style: HighlighterStyle;
  editStyle: HighlighterStyle;
  finishedEditing: () => void;
  styleChanged: (style: HighlighterStyle) => void;
  liveEdit: boolean;
  liveEditChanged: (liveEdit: boolean) => void;

  isPrism: boolean;
  wrapLines: SyntaxHighlighterProps['wrapLines'];
  language: SyntaxHighlighterProps['language'];
  code: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    objectPropertyTreeItem: {
      '& .MuiTreeItem-iconContainer': {
        '& .MuiIconButton-root': {
          color: theme.palette.primary.main,
        },
      },
    },
    newPropertyTreeItem: {
      '& .MuiTreeItem-label': {
        '& .MuiButtonBase-root:not(.Mui-disabled)': {
          color: theme.palette.primary.main,
        },
      },
    },
    clipboardIcon: {
      color: theme.palette.primary.main,
    },
    syntaxHighlighterDialogContent: {
      overflow: 'unset',
    },
  })
);

export const EditStyleDialog = ({
  finishedEditing,
  liveEdit,
  liveEditChanged,
  editStyle,
  styleChanged,
  isPrism,
  code,
  language,
  style,
  wrapLines,
}: EditStyleProps): JSX.Element => {
  const classes = useStyles();
  return (
    <FullScreenDialog
      close={(): void => finishedEditing()}
      transition
      open
      title="Edit Style"
    >
      <Box mx="auto">
        <DialogContent>
          <Box px={0.5}>
            <SmallElevationPaddedPaper>
              <Box display="flex" bgcolor="secondary">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={liveEdit}
                      onChange={(evt): void =>
                        liveEditChanged(evt.target.checked)
                      }
                    />
                  }
                  label="Live edit"
                />
                <Box flexGrow={1} />
                <CopyToClipboardWithIcon
                  iconButtonClassName={classes.clipboardIcon}
                  tooltipPlacement="left"
                  value={editStyle}
                />
              </Box>
            </SmallElevationPaddedPaper>
          </Box>
        </DialogContent>
        <DialogContent>
          <Box display="flex" flexWrap="wrap" justifyContent="center">
            <Box flex={1} padding={0.5}>
              <StyleEditor
                liveEdit={liveEdit}
                style={editStyle}
                styleChanged={styleChanged}
              />
            </Box>
            <Box mb={1} padding={0.5}>
              <Box flex={1}>
                <SmallElevationPaddedPaper>
                  <SyntaxHighlighter
                    isPrism={isPrism}
                    wrapLines={wrapLines}
                    language={language}
                    style={style}
                  >
                    {code}
                  </SyntaxHighlighter>
                </SmallElevationPaddedPaper>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Box>
    </FullScreenDialog>
  );
};
