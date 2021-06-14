<template>
  <div class="my-articles">
    <h1 class="text-h1 mt-10 mb-8">My articles</h1>
    <v-data-table
      :headers="headers"
      :items="articles"
      sort-by="calories"
      class="elevation-1"
      :disable-pagination="true"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-dialog v-model="dialogDelete" max-width="320px">
            <v-card class="pb-3 pt-2">
              <v-card-title class="text-h5 text-center"
                >Are you sure you want to delete this article?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" @click="deleteItemConfirm"
                  >Yes</v-btn
                >
                <v-btn color="error darken-1" text @click="closeDelete"
                  >No</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon :to="`/admin/edit-article/${item.articleId}`">
          <v-icon small class="mr-2">mdi-pencil</v-icon>
        </v-btn>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ArticleDetail from '~/types/ArticleDetail'

@Component({})
export default class MyArticles extends Vue {
  dialogDelete = false
  articleIdToDelete!: string
  indexToDelete!: number

  get headers() {
    return [
      {
        text: 'Article title',
        align: 'start',
        sortable: false,
        value: 'title',
      },
      { text: 'Perex', value: 'perex' },
      { text: 'Comments', value: 'comments' },
      { text: 'Actions', value: 'actions', sortable: false },
    ]
  }

  get articles(): ArticleTableItem[] {
    return this.sortedArticles.map((article) => {
      return new ArticleTableItem(
        article.articleId,
        article.title,
        article.perex.substr(0, 30),
        article.createdAt,
        article.lastUpdatedAt,
        article.comments.length
      )
    })
  }

  get sortedArticles(): ArticleDetail[] {
    return [...this.$store.state.articles.articleDetails].sort((a, b) => {
      const createdA = this.$moment(a.createdAt)
      const createdB = this.$moment(b.createdAt)
      return createdB.valueOf() - createdA.valueOf()
    })
  }

  mounted() {
    this.$store.dispatch('articles/getArticleDetails')
  }

  deleteItem(item: ArticleTableItem) {
    this.indexToDelete = this.$store.state.articles.articleDetails.findIndex(
      (article: ArticleDetail) => article.articleId === item.articleId
    )
    this.articleIdToDelete = item.articleId
    this.dialogDelete = true
  }

  closeDelete() {
    this.dialogDelete = false
  }

  deleteItemConfirm() {
    if (this.indexToDelete > 0) {
      this.$store.dispatch('articles/removeArticle', this.articleIdToDelete)
    }
    this.closeDelete()
  }
}

class ArticleTableItem {
  articleId: string
  title: string
  perex: string
  createdAt: string
  lastUpdatedAt: string
  comments: number

  constructor(
    articleId: string,
    title: string,
    perex: string,
    createdAt: string,
    lastUpdatedAt: string,
    comments: number
  ) {
    this.articleId = articleId
    this.title = title
    this.perex = perex
    this.createdAt = createdAt
    this.lastUpdatedAt = lastUpdatedAt
    this.comments = comments
  }
}
</script>

<style scoped></style>
