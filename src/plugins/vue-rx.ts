// plugins/vue-rx.js
import { App } from 'vue';
import VueRx from 'vue-rx';
import { Observable, Subscription } from 'rxjs';

export default {
  install(app: App) {
    app.config.globalProperties.$rx = { Observable, Subscription };
    app.provide('VueRx', { Observable, Subscription });
  }
};
