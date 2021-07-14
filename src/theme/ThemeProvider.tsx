import React, { useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { themeCreator } from './base';
import { StylesProvider } from '@material-ui/core/styles';
// import { CacheProvider } from '@emotion/react';
// import createCache from '@emotion/cache';
// import rtlPlugin from 'stylis-plugin-rtl';

// const cacheRtl = createCache({
//   key: 'bloom-ui'
//   // @ts-ignore
//   stylisPlugins: [rtlPlugin]
// });

export const ThemeContext = React.createContext(
  (themeName: string): void => {}
);

const ThemeProvider: React.FC = (props) => {
  const curThemeName = 'PureLightTheme';
  const [themeName, _setThemeName] = useState(curThemeName);
  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    _setThemeName(themeName);
  };

  return (
    <StylesProvider injectFirst>
      {/* <CacheProvider value={cacheRtl}> */}
      <ThemeContext.Provider value={setThemeName}>
        <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
      </ThemeContext.Provider>
      {/* </CacheProvider> */}
    </StylesProvider>
  );
};

export default ThemeProvider;
