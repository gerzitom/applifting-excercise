<template>
  <nuxt-link
    :to="`/articles/${createSlug(articleData)}`"
    class="article-preview text-decoration-none"
  >
    <v-card class="my-4 py-6 px-3" :hover="true">
      <v-row>
        <v-col cols="12" sm="3">
          <article-image :image-id="articleData.imageId"></article-image>
        </v-col>
        <v-col cols="12" sm="9">
          <h2 class="text-h3 pb-3">{{ articleData.title }}</h2>
          <v-row>
            <v-col cols="auto">
              <p class="text-caption">Tomáš Geržičák</p>
            </v-col>
            <v-col cols="auto">
              <p class="text-caption">{{ createdTime }}</p>
            </v-col>
          </v-row>
          <div class="text">
            {{ articleData.perex }}
          </div>
        </v-col>
      </v-row>
    </v-card>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Article from '~/types/Article'
import ArticleImage from '~/components/ArticleImage.vue'

@Component({
  components: {
    ArticleImage,
  },
})
export default class ArticlePreview extends Vue {
  @Prop() articleData!: Article

  /**
   * Format created time
   */
  get createdTime(): string {
    return this.$moment(this.articleData.createdAt).format('MM/DD/YYYY')
  }

  createSlug(articleData: Article): string {
    console.log(articleData)
    const slug = articleData.title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
    return slug + '_' + articleData.articleId
  }
}
</script>

<style lang="scss">
.image-placeholder {
  //height: 150px;
  display: flex;
  justify-content: center;
}
.article-preview {
  &__picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
    @media (max-width: 599px) {
      max-height: 200px;
    }
    &-placeholder {
      //width: 50%;
    }
  }
}
</style>
