<template>
  <main>
    <v-container>
      <h1 class="text-h1 mb-4">Recent articles</h1>
      <v-row>
        <v-col cols="10">
          <article-preview
            v-for="article in articles"
            :key="article.articleId"
            :article-data="article"
          />
        </v-col>
      </v-row>
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
    return [...this.$store.state.articles.articles].sort((a, b) => {
      const createdA = this.$moment(a.createdAt)
      const createdB = this.$moment(b.createdAt)
      return createdB.valueOf() - createdA.valueOf()
    })
  }
  async fetch() {
    await this.$store.dispatch('articles/getArticles')
  }
}
</script>
