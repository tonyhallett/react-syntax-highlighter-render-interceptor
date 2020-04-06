import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import { TickConfirmIcon } from '../../../../helpers/base-components/TickConfirmIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block !important',
    '& .th-apply-svg': {
      display: 'block !important',
    },
    '& .th-apply-path': {
      display: 'block !important',
    },
  },
  confirmIcon: {
    color: theme.palette.success.light,
  },
}));

export function TickConfirmButton({
  onClick,
}: {
  onClick?: () => void;
}): JSX.Element {
  const styles = useStyles();
  const overrideCss = styles.root;
  const ref = React.useCallback((node: SVGElement | null) => {
    if (node !== null) {
      const { classList } = node.firstChild as SVGPathElement;
      classList.add('e-apply');
      classList.add('th-apply-path');
    }
  }, []);
  return (
    <IconButton
      onClick={onClick}
      className={`e-apply th-apply-btn ${overrideCss}`}
      edge="end"
    >
      <TickConfirmIcon
        ref={ref}
        className={`e-apply th-apply-svg ${styles.confirmIcon}`}
      />
    </IconButton>
  );
}
