<template>
  <div>
    <LightGallery
      :images="fullImages"
      :index="index"
      :disable-scroll="true"
      @close="index = null"
    />
    <ul>
      <li
        v-for="(thumb, thumbIndex) in images"
        :key="thumbIndex"
        @click="index = thumbIndex"
      >
        <img :src="getThumb(thumbIndex)" />
      </li>
    </ul>
    <slot v-if="!loaded"></slot>
  </div>
</template>

<script>
import Vue from "vue";
import { LightGallery } from "vue-light-gallery";

export default {
  components: {
    LightGallery,
  },
  computed: {
    fullImages() {
      return this.images.map((i) => `/assets${i}`);
    },
  },
  mounted() {
    const list = this.$slots.default[0];
    this.images = list.children
      .filter((n) => n.tag === "li")
      .map((li) => {
        const img = li.children[0];
        return img.data.attrs.src;
      });
    this.loaded = true;
  },
  data() {
    return {
      loaded: false,
      images: [],
      index: null,
    };
  },
  methods: {
    getThumb(index) {
      if (index === null) {
        return;
      }
      const img = this.images[index];
      return `/img/200/200${img}`;
    },
  },
};
</script>