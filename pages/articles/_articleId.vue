<template>
  <div class="single-article">
    <template v-if="!error">
      <v-breadcrumbs :items="breadcrumbsItems" class="mt-1 pl-0" />
      <h1 class="pb-2 mt-8 text-h1" data-test-id="heading">
        <span v-if="!loading">{{ articleData.title }}</span>
        <v-skeleton-loader v-else type="heading" height="45" class="mt-9" />
      </h1>
      <v-row class="mb-3">
        <v-col cols="auto">
          <p>
            <template v-if="!loading">Tomáš Geržičák</template>
            <v-skeleton-loader v-else type="text" width="100" />
          </p>
        </v-col>
        <v-col cols="auto">
          <p>
            <template v-if="!loading">
              {{ formatedDate }}
            </template>
            <v-skeleton-loader v-else type="text" width="120" />
          </p>
        </v-col>
      </v-row>
      <article-image
        v-if="!loading"
        :image-id="articleData.imageId"
        :display-placeholder="false"
        height="350px"
        class="mb-6"
      />
      <section class="text-body-1 pb-2" data-test-id="perex">
        <template v-if="!loading">
          {{ articleData.perex }}
        </template>
        <template v-else>
          <v-skeleton-loader type="paragraph"></v-skeleton-loader>
        </template>
      </section>
      <section class="mb-10 mt-5 text-body-2">
        <div
          v-if="!loading"
          v-html="$md.render(articleData.content)"
          data-test-id="content"
        ></div>
        <template v-else>
          <v-skeleton-loader type="paragraph@4"></v-skeleton-loader>
        </template>
      </section>
      <v-divider class="mb-9" />
      <article-comments
        v-if="!loading"
        :comments="articleData.comments"
        :article-id="articleId"
      ></article-comments>
    </template>
    <template v-else>
      <h2 class="text-h2">Error occured</h2>
    </template>
  </div>
</template>

<script lang="ts">
import ArticleDetail from '@/types/ArticleDetail'
import { Component, Vue } from 'nuxt-property-decorator'
import ArticleImage from '~/components/ArticleImage.vue'
import ArticleComments from '~/components/ArticleComments.vue'

@Component({
  components: {
    ArticleImage,
    ArticleComments,
  },
})
export default class SingleArticle extends Vue {
  loading = true
  imageSrc = ''
  error = false

  /**
   * Computed property, that gets article detail from store
   */
  get articleData(): ArticleDetail {
    return this.$store.state.articles.articleDetails.find(
      (storedArticle: ArticleDetail) =>
        storedArticle.articleId === this.articleId
    )
  }

  /**
   * Parse url and gets article ID
   * If there is any problem in the url, error message is displayed
   */
  get articleId(): string {
    const parts = this.$route.params.articleId.split('_')
    if (parts.length > 1) {
      return parts[1]
    } else {
      this.error = true
      return ''
    }
  }

  /**
   * Specification for navigation breadcrumbs.
   */
  get breadcrumbsItems() {
    if (this.articleData) {
      return [
        {
          text: 'Articles',
          href: '/',
        },
        {
          text: this.articleData.title,
          disabled: true,
        },
      ]
    } else return []
  }

  /**
   * Formated date using moment.js
   */
  get formatedDate(): string {
    return this.$moment(this.articleData.createdAt).format('DD. MM. YYYY')
  }

  /**
   * Gets article detail
   */
  created() {
    this.$store
      .dispatch('articles/getArticleDetail', this.articleId)
      .catch((err) => {
        this.error = true
        this.$nuxt.$emit('temporary-error', {
          title: 'API error',
          message: err.message,
        })
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>

<style scoped></style>
