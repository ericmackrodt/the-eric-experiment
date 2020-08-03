<template>
  <div class="mobile-friendly-menu" v-click-outside="closeMenu">
    <a
      class="menuitem mobile"
      v-on:click="toggleMenu"
      v-bind:class="{ active: isOpen }"
      >Menu</a
    >
    <div class="main-menu-items" v-bind:class="{ open: isOpen }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import ClickOutside from "vue-click-outside";

export default {
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

  directives: {
    ClickOutside,
  },
};
</script>
