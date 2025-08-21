import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

const nbcLightTheme = {
  dark: false,
  colors: {
    primary: '#5E2C91',
    secondary: '#F37021',
    accent: '#0089D0',
    error: '#D32F2F',
    info: '#1976D2',
    success: '#388E3C',
    warning: '#F57C00',
    background: '#F5F5F5',
    surface: '#FFFFFF',
  },
};

const nbcDarkTheme = {
  dark: true,
  colors: {
    primary: '#7C4DFF',
    secondary: '#F37021',
    accent: '#40C4FF',
    error: '#F44336',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FF9800',
    background: '#121212',
    surface: '#1E1E1E',
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: nbcLightTheme,
      dark: nbcDarkTheme,
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});