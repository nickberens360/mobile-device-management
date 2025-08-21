import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

const nbcTheme = {
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

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'nbcTheme',
    themes: {
      nbcTheme,
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