import React from 'react';

// import { HashRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import { createTheme, StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import '../styles/App.css';
import { version } from '../../package.json';
import { PropsFromRedux } from '../containers/AppContainer';
import BlockNumberIndicator from './BlockNumberIndicator';
import VersionNumberIndicator from './VersionNumberIndicator';

import { SnackbarProvider } from 'notistack';

import PageContainerContainer from '../containers/PageContainerContainer';
declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const App = (props: PropsFromRedux) => {

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          secondary: {
            main: '#ff1493'
          },
          mode: props.darkMode ? 'dark' : 'light',
          ...(props.darkMode && {
            background: {
              default: "#131313",
              paper: "#2b2b2b"
            }
          })
        },
      }),
    [props.darkMode],
  );

  return (
    <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline/>
            <SnackbarProvider 
              maxSnack={3}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              autoHideDuration={4000}
            >
              <PageContainerContainer/>
            </SnackbarProvider>
            <BlockNumberIndicator/>
            <VersionNumberIndicator version={version}/>
          </ThemeProvider>
        </StyledEngineProvider>
    </BrowserRouter>
  );
}

export default App;
