<template>
  <div>
    <LightGallery
      :images="images"
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
        <img :src="thumb" />
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
  mounted() {
    const list = this.$slots.default[0];
    this.images = list.children
      .filter((n) => n.tag === "li")
      .map((li) => {
        const img = li.children[0];
        return img.data.attrs.src;
      });
    this.loaded = true;
    console.log(this);
  },
  data() {
    return {
      loaded: false,
      images: [],
      index: null,
    };
  },
};
</script>
