import Vue from "vue";
import Desktop from "./desktop";
import Window from "./window";
import MobileMenu from "./mobile-menu";
import Gallery from "./gallery";

Vue.component("desktop", Desktop);
Vue.component("window", Window);
Vue.component("mobileMenu", MobileMenu);
Vue.component("gallery", Gallery);

const vueApp = new Vue({
  el: "#root",
});
