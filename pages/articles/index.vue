<template>
  <div class="articles">
    <div v-for="article in articles" class="article">
      {{ article }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Article from '~/types/Article'

@Component
export default class Articles extends Vue {
  /**
   * Computed property, that
   */
  get articles(): Array<Article> {
    return this.$store.state.articles
  }
  async fetch() {
    await this.$store.dispatch('articles/getArticles')
  }
}
</script>

<style scoped></style>
