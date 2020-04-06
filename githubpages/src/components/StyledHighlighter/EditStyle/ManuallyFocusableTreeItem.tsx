import React, { useContext, useEffect } from 'react';
import { TreeItem, TreeItemProps } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const TreeViewContext = require('@material-ui/lab/esm/TreeView/TreeViewContext');

export type ManuallyFocusableTreeItemProps = TreeItemProps & {
  doFocus?: number;
};

export const manuallyFocusableTreeItemUseStyles = makeStyles((theme) => ({
  iconContainer: {
    width: '24px',
    marginRight: theme.spacing(),
    '& svg': {
      fontSize: '24px',
      fill: theme.palette.primary.main,
    },
    transitionProperty: 'transform',
    transitionDuration: '0.3s',
    transform: ({ expanded }: { expanded: boolean }): string =>
      expanded ? 'rotate(0deg)' : 'rotate(360deg)',
  },
  expanded: {
    '& svg': {
      fill: theme.palette.primary.dark,
    },
  },
  selected: {},
  content: {},
  label: {},
  root: {
    // overriding theirs that sets to transparent - https://github.com/mui-org/material-ui/issues/20311
    '&$selected > $content $label:hover, &$selected:focus > $content $label': {
      '@media (hover: none)': {
        backgroundColor: fade(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));
export function ManuallyFocusableTreeItem(
  props: ManuallyFocusableTreeItemProps
): JSX.Element {
  const { doFocus, ...other } = props;
  const { nodeId } = props;
  const { isExpanded, focus } = useContext(TreeViewContext.default);

  const classes = manuallyFocusableTreeItemUseStyles({
    expanded: isExpanded(nodeId),
  });
  useEffect(() => {
    if (doFocus !== undefined) {
      focus(nodeId);
    }
  }, [doFocus]);
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <TreeItem classes={classes} {...other} />;
}
