<template>
  <div
    class="window-border"
    v-show="!isMinimized"
    v-bind:class="{ maximized: maximized }"
  >
    <div class="window">
      <div class="title">
        <div class="close">
          <span class="shadow">&#8212;</span>
          <span class="text">&#8212;</span>
        </div>
        {{ title }}
        <div class="button-container">
          <div class="button maximise" v-on:click="maximizeWindow">
            <span>&#9650;</span>
          </div>
        </div>
        <div class="button-container">
          <div class="button minimise" v-on:click="minimizeWindow">
            <span>&#9660;</span>
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
</template>

<script>
import Vue from "vue";

export default {
  props: ["desktop", "windowId", "icon", "title"],
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
};
</script>
