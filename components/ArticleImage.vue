<template>
  <div class="article-image">
    <v-skeleton-loader
      v-if="state === LoadingState.LOADING"
      type="image"
      height="150"
    />
    <div
      class="image-placeholder"
      v-if="state === LoadingState.FAILED && this.displayPlaceholder"
    >
      <v-icon class="article-preview__picture-placeholder" size="150"
        >mdi-image-area</v-icon
      >
    </div>
    <img
      v-if="state === LoadingState.LOADED"
      :src="src"
      alt="Blah"
      class="article-preview__picture"
      :style="'height:' + this.height"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

enum LoadingState {
  LOADING,
  FAILED,
  LOADED,
}
@Component
export default class ArticleImage extends Vue {
  @Prop() imageId!: string
  @Prop({ default: true }) displayPlaceholder!: Boolean
  @Prop({ default: 'auto' }) height!: string
  LoadingState = LoadingState
  state: LoadingState = LoadingState.LOADING
  src: string = ''
  created() {
    this.$store
      .dispatch('articles/getImage', this.imageId)
      .then((response) => {
        this.src = response
        this.state = LoadingState.LOADED
      })
      .catch((err) => {
        this.state = LoadingState.FAILED
      })
  }
}
</script>

<style scoped>
.image-placeholder {
  display: flex;
  justify-content: center;
}
img {
  width: 100%;
  object-fit: cover;
}
</style>
