<template>
  <div class="my-articles">
    <h1 class="text-h1">My articles</h1>
    <v-data-table
      :headers="headers"
      :items="articles"
      sort-by="calories"
      class="elevation-1"
      :disable-pagination="true"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
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
      <template v-slot:no-data>
        <!--        <v-btn color="primary" @click="initialize"> Reset </v-btn>-->
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ArticleDetail from '~/types/ArticleDetail'
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

@Component({
  middleware: 'auth',
})
export default class MyArticles extends Vue {
  dialogDelete = false

  get headers() {
    return [
      {
        text: 'Article title',
        align: 'start',
        sortable: false,
        value: 'title',
      },
      { text: 'Perex', value: 'perex' },
      // { text: 'Author', value: 'fat' },
      { text: 'Comments', value: 'comments' },
      { text: 'Actions', value: 'actions', sortable: false },
    ]
  }

  get articles(): ArticleDetail[] {
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

  created() {
    this.$store.dispatch('articles/getArticleDetails')
  }

  deleteItem(item) {
    this.editedIndex = this.articles.indexOf(item)
    this.editedItem = Object.assign({}, item)
    this.dialogDelete = true
  }

  closeDelete() {
    this.dialogDelete = false
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    })
  }

  deleteItemConfirm() {
    this.desserts.splice(this.editedIndex, 1)
    this.closeDelete()
  }
}
</script>

<style scoped></style>
