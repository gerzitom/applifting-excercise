<template>
  <nuxt-link
    :to="`/articles/${articleData.articleId}`"
    class="article-preview text-decoration-none"
  >
    <v-card class="my-4 py-6 px-3" :hover="true">
      <v-row>
        <v-col cols="3">
          <article-image :image-id="articleData.imageId"></article-image>
        </v-col>
        <v-col cols="9">
          <h2 class="text-h3">{{ articleData.title }}</h2>
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
          <!--          <v-row class="mt-3 mb-1">-->
          <!--            <v-col cols="auto">-->
          <!--              <v-icon>mdi-comment</v-icon>-->
          <!--              <span>4</span>-->
          <!--            </v-col>-->
          <!--          </v-row>-->
          <!--          <v-btn class="primary">Read whole article</v-btn>-->
        </v-col>
      </v-row>
    </v-card>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Article from '~/types/Article'
import { PropType } from 'vue'
import ArticleImage from '~/components/ArticleImage.vue'

const ArticlePreviewProps = Vue.extend({
  props: {
    articleData: {
      type: Article,
    },
  },
})

enum LoadingState {
  LOADING,
  FAILED,
  LOADED,
}

@Component({
  components: {
    ArticleImage,
  },
})
export default class ArticlePreview extends Vue {
  @Prop() articleData!: Article
  imageLoaded: boolean = false
  loadingState: LoadingState = LoadingState.LOADING
  LoadingState = LoadingState
  private src: string = ''

  get createdTime(): string {
    return this.$moment(this.articleData.createdAt).format('MM/DD/YYYY')
  }
}
</script>

<style scoped lang="scss">
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
    &-placeholder {
      //width: 50%;
    }
  }
}
</style>
