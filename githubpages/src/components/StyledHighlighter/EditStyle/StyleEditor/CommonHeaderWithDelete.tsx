import React from 'react';
import { Box, IconButton, Typography, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { fade } from '@material-ui/core/styles/colorManipulator';

export const useHeaderStyles = makeStyles((theme) => {
  return {
    root: {
      backgroundColor: fade(
        theme.palette.primary.main,
        theme.palette.action.selectedOpacity
      ),
    },
  };
});
export function CommonHeaderWithDelete(props: {
  header: string;
  delete: () => void;
}): JSX.Element {
  const { header, delete: performDelete } = props;
  const headerClass = useHeaderStyles().root;
  return (
    <Box display="flex" alignItems="center">
      <Typography className={headerClass} component="h5">
        {header}
      </Typography>
      <div style={{ flexGrow: 1 }} />
      <IconButton onClick={performDelete}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}
