import * as React from 'react';
import { Box, Paper, Typography } from '@material-ui/core';

export const DemoDescription = (): JSX.Element => {
  return (
    <Box width="500px" m={1}>
      <Paper>
        <Box p="1">
          <Typography
            color="textPrimary"
            variant="h5"
            component="h2"
            gutterBottom
          >
            About
          </Typography>
          <Typography color="textSecondary" variant="body1" gutterBottom>
            This is a demo of react-syntax-highlighter-renderer-interceptor and
            also react-syntax-highlighter. There are multiple highlighters on
            this page displaying the same code.
          </Typography>
          <Typography
            color="textPrimary"
            variant="h5"
            component="h2"
            gutterBottom
          >
            Syntax highlighted code
          </Typography>
          <Typography color="textSecondary" variant="body1" gutterBottom>
            The code can be displayed and hidden by pressing the code button at
            the bottom of the page. The code can be changed by typing in the
            text area. To change languages click the Language button. The
            initial code is in typescript which is supported by both Prism and
            Light.
          </Typography>
          <Typography
            color="textPrimary"
            variant="h5"
            component="h2"
            gutterBottom
          >
            Syntax highlighters
          </Typography>
          <Typography color="textSecondary" variant="body1" gutterBottom>
            There are 4 syntax highlighters, 2 combinations of Prism and Light.
            If you select a language that is common to both then both will be
            shown.
          </Typography>
          <Typography
            color="textPrimary"
            component="h3"
            variant="h5"
            gutterBottom
          >
            Style view
          </Typography>
          <Typography color="textSecondary" variant="body1" gutterBottom>
            Here you will find a regular Prism and a regular Light highlighter.
            Each highlighter has a corresponding combobox that contains each of
            the built-in styles. The selected Prism style will be applied to
            both Prism highlighters, similarly for the selected Light style. You
            can create new editable styles ( built-in styles can only be
            viewed). They can be empty or be based on the selected style. The
            edit style dialog also has a copy to clipboard button.
          </Typography>

          <Typography
            color="textPrimary"
            component="h3"
            variant="h5"
            gutterBottom
          >
            Node view
          </Typography>
          <Typography color="textSecondary" variant="body1" gutterBottom>
            Once again there is a Prism and Light highlighter. This time though
            the custom renderer from react-syntax-highlighter-render-interceptor
            has been used.
          </Typography>
          <Typography color="textSecondary" variant="body1" gutterBottom>
            The custom renderer has an interceptor that creates a TreeItem for
            each of the nodes that it is passed. Element nodes will have their
            class names ( or --- if no class names ) displayed and can be
            expanded to show their children. Text nodes will display the text or
            the character codes if just whitespace is present.
          </Typography>
          <Typography color="textSecondary" variant="body1" gutterBottom>
            To aid with testing you can copy the array of root RenderNode to the
            clipboard.
          </Typography>
          <Typography color="error" gutterBottom>
            There is a checkbox for toggling the wrapLines prop. With the
            initial code and initially selected custom prism style you can see
            there is an issue with wrapLines = true by toggling. Both Prism
            syntax highlighters will show the effect.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
