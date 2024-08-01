import Vue from "vue";
import { ToastPlugin, ModalPlugin } from "bootstrap-vue";
import VueCompositionAPI from "@vue/composition-api";

import { init, vueRouterInstrumentation } from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import router from "./router";
import store from "./store";
import App from "./App.vue";

// Sentry Library

// Global Components
import "./global-components";

// 3rd party plugins
import "@axios";
import "@/libs/acl";
import "@/libs/portal-vue";
import "@/libs/clipboard";
import "@/libs/toastification";
import "@/libs/sweet-alerts";
import "@/libs/vue-select";

// BSV Plugin Registration
Vue.use(ToastPlugin);
Vue.use(ModalPlugin);

// Composition API
Vue.use(VueCompositionAPI);

// Tracking using sentry
init({
  Vue,
  dsn: process.env.VUE_APP_SENTRY_DSN,
  logErrors: false,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: vueRouterInstrumentation(router),
      tracingOrigins: [process.env.VUE_APP_SENTRY_TRACING, /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// import core styles
require("@core/scss/core.scss");

// import assets styles
require("@/assets/scss/style.scss");

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
