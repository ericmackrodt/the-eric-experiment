import Vue from "vue";
import Desktop from "./desktop";
import Window from "./window";
import MobileMenu from "./mobile-menu";

Vue.component("desktop", Desktop);
Vue.component("window", Window);
Vue.component("mobileMenu", MobileMenu);

const vueApp = new Vue({
  el: "#root",
});

console.log("WHAT");
