<template>
  <main>
    <v-container>
      <h1 class="text-h1 mb-4">Recent articles</h1>
      <v-row>
        <v-col cols="10" data-test-id="articles-list">
          <article-preview
            v-for="article in articles"
            :key="article.articleId"
            :article-data="article"
          />
          <client-only>
            <infinite-loading @infinite="infiniteHandler">
              <div slot="no-more">No more articles</div>
              <div slot="no-results">No articles found</div>
            </infinite-loading>
          </client-only>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script lang="ts">
import Article from '@/types/Article'
import { Component, Vue } from 'nuxt-property-decorator'
import ArticlePreview from '~/components/ArticlePreview.vue'
import ArticlesLoadDto from '~/types/ArticlesLoadDto'
import InfiniteLoading from 'vue-infinite-loading'

@Component({
  components: {
    ArticlePreview,
    InfiniteLoading,
  },
})
export default class MainPage extends Vue {
  /**
   * Settings of how many articles should be loaded
   */
  get articlesToLoad(): number {
    return 5
  }
  loadedArticles = 0

  /**
   * Gets all available articles from store and sort them by created date.
   */
  get articles(): Article[] {
    return [...this.$store.state.articles.articles].sort((a, b) => {
      const createdA = this.$moment(a.createdAt)
      const createdB = this.$moment(b.createdAt)
      return createdB.valueOf() - createdA.valueOf()
    })
  }
  async fetch() {
    try {
      await this.loadNextArticles()
    } catch (err) {
      this.$nuxt.$emit('temporary-error', {
        title: 'Error',
        message: err.message,
      })
    }
  }

  /**
   * Loads next part of articles from API
   */
  async loadNextArticles() {
    const options = new ArticlesLoadDto(
      this.loadedArticles,
      this.articlesToLoad
    )
    const newArticles = await this.$store.dispatch(
      'articles/getArticles',
      options
    )
    this.loadedArticles += this.articlesToLoad
    return newArticles
  }

  /**
   * Handler for infinite scrolling plugin
   * Call, when user scroll at the bottom of the page.
   * Loads next part of articles
   * @param $state state of infinite scrolling plugin
   */
  infiniteHandler($state: any) {
    this.loadNextArticles().then((newArticles) => {
      if (newArticles.length > 0) {
        $state.loaded()
      } else {
        $state.complete()
      }
    })
  }
}
</script>
