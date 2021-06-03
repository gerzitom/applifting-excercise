<template>
  <article class="article-preview">
    <v-row>
      <v-col cols="4">
        <img :src="src" alt="" />
      </v-col>
      <v-col cols="8">
        <h2 class="text-h3">{{ articleData.title }}</h2>
        <div class="text">
          {{ articleData.perex }}
        </div>
      </v-col>
    </v-row>
  </article>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Article from '~/types/Article'
import { PropType } from 'vue'

const ArticlePreviewProps = Vue.extend({
  props: {
    articleData: {
      type: Article,
    },
  },
})

@Component({})
export default class ArticlePreview extends Vue {
  @Prop() articleData!: Article

  private src: string = ''
  async created() {
    try {
      const response = await this.$axios.get(
        `/images/${this.articleData.imageId}`,
        { responseType: 'arraybuffer' }
      )
      let blob = new Blob([response.data], {
        type: response.headers['content-type'],
      })
      this.src = URL.createObjectURL(blob)
    } catch (e) {
      console.log(e)
    }
  }
}
</script>

<style scoped></style>
