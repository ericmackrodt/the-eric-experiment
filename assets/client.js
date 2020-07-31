Vue.component("window", {
  props: ["desktop", "windowId", "icon", "title"],
  template: `
  <div class="window-border" v-show="!isMinimized"  v-bind:class="{ maximized: maximized }">
    <div class="window">
      <div class="title">
        <div class="close">
          <span class="shadow">
            &#8212;
          </span>
          <span class="text">
            &#8212;
          </span>
        </div>
        {{title}}
        <div class="button-container">
          <div class="button maximise" v-on:click="maximizeWindow">
            <span>
              &#9650;
            </span>
          </div>
        </div>
        <div class="button-container">
          <div class="button minimise" v-on:click="minimizeWindow">
            <span>
              &#9660;
            </span>
          </div>
        </div>
      </div>
      <slot name="top"></slot>

      <div class="content">
        <slot></slot>
      </div>
    </div>

    <div class="handle topright"></div>
    <div class="handle bottomright"></div>
    <div class="handle topleft"></div>
    <div class="handle bottomleft"></div>
  </div>
  `,

  data() {
    return {
      maximized: false,
    };
  },
  computed: {
    isMinimized() {
      return this.desktop.isMinimized(this.windowId);
    },
  },
  methods: {
    maximizeWindow() {
      this.maximized = !this.maximized;
    },
    minimizeWindow() {
      this.desktop.minimize({
        title: this.title,
        icon: this.icon,
        windowId: this.windowId,
      });
    },
  },
});

Vue.component("desktop", {
  props: ["deskId"],
  template: `
  <div class="desktop">
    <slot v-bind:minimize="minimize" v-bind:isMinimized="isMinimized"></slot>

    <div class="icons">
      <div class="icon" v-for="window in minimizedWindows" :key="window.windowId" v-on:dblclick="restore(window.windowId)">
        <img v-bind:src="window.icon" v-bind:alt="window.title" />
        <div class="text">{{window.title}}</div>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      minimizedWindows: [],
    };
  },
  methods: {
    isMinimized(windowId) {
      const window = this.minimizedWindows.find((o) => o.windowId === windowId);
      return !!window;
    },
    restore(id) {
      this.minimizedWindows = this.minimizedWindows.filter(
        (o) => o.windowId !== id
      );
    },
    minimize(windowData) {
      this.minimizedWindows = [...this.minimizedWindows, windowData];
    },
  },
});

Vue.directive("click-outside", {
  bind: function (el, binding, vnode) {
    this.event = function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", this.event);
  },
  unbind: function (el) {
    document.body.removeEventListener("click", this.event);
  },
});

Vue.component("mobileMenu", {
  template: `
    <div class="mobile-friendly-menu" v-click-outside="closeMenu">
      <a class="menuitem mobile" v-on:click="toggleMenu" v-bind:class="{ active: isOpen }">
        Menu
      </a>
      <div class="main-menu-items" v-bind:class="{ open: isOpen }">
        <slot></slot>
      </div>
    </div>
  `,
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    closeMenu() {
      this.isOpen = false;
    },
  },
});

const vueApp = new Vue({
  el: "#root",
});
