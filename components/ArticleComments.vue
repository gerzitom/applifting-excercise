<template>
  <section class="comments">
    <h3 class="text-h4 mb-7">Comments ({{ comments.length }})</h3>
    <div class="add-comment" v-if="$auth.loggedIn">
      <v-row align="center">
        <v-col cols="1">
          <user-avatar></user-avatar>
        </v-col>
        <v-col>
          <form
            onsubmit="return false"
            @submit="addComment"
            class="d-flex align-center"
          >
            <v-text-field
              placeholder="Join the discusion"
              v-model="newComment"
              data-test-id="comment_content"
            ></v-text-field>
            <v-btn
              class="ml-5"
              :loading="loading"
              type="submit"
              data-test-id="add_comment"
              >Send</v-btn
            >
          </form>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <p class="text mb-7">
        If you want to add comment, <nuxt-link to="/login">log in</nuxt-link>.
      </p>
    </div>
    <div data-test-id="comments">
      <article-comment
        v-for="comment in sortedComments"
        :key="comment.commentId"
        :comment="comment"
        :article-id="articleId"
      ></article-comment>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import Comment from '../types/Comment'
import ArticleComment from '~/components/ArticleComment.vue'
import UserAvatar from '~/components/UserAvatar.vue'
import NewCommentDto from '~/types/NewCommentDto'

@Component({
  components: {
    ArticleComment,
    UserAvatar,
  },
})
export default class ArticleCommnets extends Vue {
  @Prop() comments!: Comment[]
  @Prop() articleId!: string
  private newComment: string = ''
  private loading = false

  /**
   * Sort comment by crated date
   */
  get sortedComments(): Comment[] {
    return [...this.comments].sort((a, b) => {
      const createdA = this.$moment(a.createdAt)
      const createdB = this.$moment(b.createdAt)
      return createdB.valueOf() - createdA.valueOf()
    })
  }

  /**
   * Sends API request to save new comment.
   */
  public addComment() {
    this.loading = true
    const dto = new NewCommentDto(
      this.articleId,
      this.$auth.user!.name as string,
      this.newComment
    )
    this.$store
      .dispatch('articles/addComment', dto)
      .then((response) => {
        this.newComment = ''
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>

<style scoped></style>
