<template>
  <div class="single-article">
    <v-breadcrumbs :items="breadcrumbsItems" class="mt-1 pl-0" />
    <h1 class="pb-2 mt-8 text-h1">
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
    />
    <section class="text-body-1">
      <template v-if="!loading">
        {{ articleData.perex }}
      </template>
      <template v-else>
        <v-skeleton-loader type="paragraph"></v-skeleton-loader>
      </template>
    </section>
    <section class="mb-10 mt-5 text-body-2">
      <template v-if="!loading">
        {{ articleData.content }}
      </template>
      <template v-else>
        <v-skeleton-loader type="paragraph@4"></v-skeleton-loader>
      </template>
    </section>
    <v-divider class="mb-9" />
    <article-comments
      v-if="!loading"
      :comments="articleData.comments"
      :article-id="$route.params.articleId"
    ></article-comments>
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
  get articleData(): ArticleDetail {
    return this.$store.state.articles.articleDetails.find(
      (storedArticle: ArticleDetail) =>
        storedArticle.articleId === this.$route.params.articleId
    )
  }
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
  get formatedDate(): string {
    return this.$moment(this.articleData.createdAt).format('DD. MM. YYYY')
  }
  created() {
    this.$store
      .dispatch('articles/getArticleDetail', this.$route.params.articleId)
      .then((response) => {
        // console.log(response)
      })
      .finally(() => {
        this.loading = false
        // console.log('haha')
      })
  }
}
</script>

<style scoped></style>
