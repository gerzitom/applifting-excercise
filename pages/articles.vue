<template>
<div class="articles">
  <div v-for="article in articles" class="article">
    {{article}}
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Article from '~/types/Article'

@Component
export default class Articles extends Vue{
  // public articles: Array<Article> = []
  get articles():Array<Article>{
    return this.$store.state.articles
  }
  async fetch(){
    // const userInfo = await this.$store.dispatch("user/getUserInfo", '23a10b02-7fcd-460a-995f-936e95edadea')
    const articles = await this.$store.dispatch("articles/getArticles")
    console.log(articles)
  }
}
</script>

<style scoped>

</style>
