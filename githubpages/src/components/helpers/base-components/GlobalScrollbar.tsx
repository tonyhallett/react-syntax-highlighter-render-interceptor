/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Theme, makeStyles } from '@material-ui/core';

/* 
  manual using the theme
  
  const globalScrollbars = makeStyles(theme => {
  
  const thumbColor = theme.palette.grey[400]
  const trackColor = theme.palette.grey[300]
  return {
  '@global': {
    '*': {
      scrollbarWidth: 'thin',
      scrollbarColor: `${thumbColor} ${trackColor} `,
    },
    '*::-webkit-scrollbar-thumb':{
      backgroundColor: thumbColor,
    },
    '*::-webkit-scrollbar':{width:'8px'},
    '*::-webkit-scrollbar-track': {
      background: trackColor
    }
  }

  export function CustomScrollbar(props:{children:any}){
    globalScrollbars();
    return props.children;
  }
}}); */

function getProp(
  theme: Theme,
  scrollbarProps: GlobalScrollbarProps,
  propName: keyof ScrollbarProps
) {
  let props: ScrollbarProps;
  if (typeof scrollbarProps === 'function') {
    props = scrollbarProps(theme) as ScrollbarProps;
  } else {
    props = scrollbarProps;
  }
  return props[propName];
}
function getScrollbarColor(
  theme: Theme,
  scrollbarProps: GlobalScrollbarProps
): string {
  return `${getProp(theme, scrollbarProps, 'thumbColor')} ${getProp(
    theme,
    scrollbarProps,
    'trackColor'
  )}`;
}
export const globalScrollbarsStyles = makeStyles((theme) => {
  // cannot do @global : (props)=>....
  // would have to look at source for https://cssinjs.org/jss-plugin-rule-value-function?v=v10.0.4
  // https://cssinjs.org/jss-plugin-global?v=v10.0.4
  return {
    '@global': {
      '*': {
        scrollbarWidth: (props: GlobalScrollbarProps) =>
          getProp(theme, props, 'scrollbarWidth'),
        scrollbarColor: (props: GlobalScrollbarProps) =>
          getScrollbarColor(theme, props),
      },
      '*::-webkit-scrollbar-thumb': (props: GlobalScrollbarProps) =>
        getProp(theme, props, 'webkitThumb'),
      '*::-webkit-scrollbar': (props: GlobalScrollbarProps) =>
        getProp(theme, props, 'webkitScrollbar'),
      '*::-webkit-scrollbar-track': (props: GlobalScrollbarProps) =>
        getProp(theme, props, 'webkitTrack'),
    },
  };
});
export type GlobalScrollbarProps =
  | ScrollbarProps
  | { (theme: Theme): GlobalScrollbarProps };
export interface ScrollbarProps {
  scrollbarWidth: 'auto' | 'thin' | 'none'; // no need for auto ?
  thumbColor: string; // thumb should be darker
  trackColor: string;
  webkitScrollbar: React.CSSProperties;
  webkitThumb: React.CSSProperties;
  webkitTrack: React.CSSProperties;
  // others to add
}
export function GlobalScrollbar(props: {
  children: React.ReactNode;
  scrollbar: GlobalScrollbarProps;
}) {
  globalScrollbarsStyles(props.scrollbar);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return props.children as any;
}
