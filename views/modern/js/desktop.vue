<template>
  <div class="desktop">
    <slot v-bind:minimize="minimize" v-bind:isMinimized="isMinimized"></slot>

    <div class="icons" v-if="minimizedWindows.length > 0">
      <div
        class="icon"
        v-for="window in minimizedWindows"
        :key="window.windowId"
        v-on:dblclick="restore(window.windowId)"
      >
        <img v-bind:src="window.icon" v-bind:alt="window.title" />
        <div class="text">{{ window.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  props: ["deskId"],
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
};
</script>
