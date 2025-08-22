import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import componentDocs from 'vue-atomic-docs';
import './assets/styles/main.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
if (import.meta.env.VITE_ENABLE_ATOMIC_DOCS === 'true') {
  app.use(componentDocs, {
    componentModules: import.meta.glob('@/components/**/*.vue'),
    rawComponentSourceModules: import.meta.glob('@/components/**/*.vue', { as: 'raw' }),
    exampleModules: import.meta.glob('@/component-examples/**/*.vue'),
    componentsDirName: 'components',
    examplesDirName: 'component-examples',
    mainAppID: 'app',
    enableDocs: true,
    plugins: [vuetify]
  });
}

app.mount('#app');