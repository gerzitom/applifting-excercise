<template>
  <main>
    <v-container>
      <h1 class="text-h1">Recent articles</h1>
      <article-preview
        v-for="article in articles"
        :key="article.articleId"
        :article-data="article"
      />
    </v-container>
  </main>
</template>

<script lang="ts">
import Article from '@/types/Article'
import { Component, Vue } from 'nuxt-property-decorator'
import ArticlePreview from '~/components/ArticlePreview.vue'

@Component({
  components: {
    ArticlePreview,
  },
})
export default class MainPage extends Vue {
  get articles(): Article[] {
    const all = this.$store.state.articles.articles
    return all
  }
  async fetch() {
    await this.$store.dispatch('articles/getArticles')
  }
}
</script>
