<template>
  <div class="comment py-5">
    <v-row>
      <v-col cols="2" sm="1">
        <user-avatar />
      </v-col>
      <v-col cols="10" sm="11">
        <div class="d-flex align-center">
          <p class="font-weight-bold text-body-1">{{ comment.author }}</p>
          <p class="ml-3 text-caption">{{ formatedCreatedTime }}</p>
        </div>
        <p class="text-body-2">{{ comment.content }}</p>
        <div class="d-flex align-center">
          <span class="d-block">{{ comment.score }}</span>
          <v-divider vertical class="mx-3" />
          <v-btn icon @click="voteComment(VoteValue.UP)" :loading="loading"
            ><v-icon>mdi-chevron-up</v-icon></v-btn
          >
          <v-divider vertical class="mx-3" />
          <v-btn
            icon
            @click="voteComment(VoteValue.DOWM)"
            :loading="loading"
            data-jest-id="upvote_button"
            ><v-icon>mdi-chevron-down</v-icon></v-btn
          >
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Comment from '@/types/Comment'
import UserAvatar from '~/components/UserAvatar.vue'
import { VoteDetails, VoteValue } from '~/store/articles'

@Component({
  components: {
    UserAvatar,
  },
})
export default class ArticleComment extends Vue {
  @Prop() comment!: Comment
  @Prop() articleId!: string
  loading = false
  VoteValue = VoteValue

  /**
   * Gets amount of time, from creating of the article
   */
  get formatedCreatedTime(): string {
    return this.$moment(this.comment.createdAt).fromNow()
  }

  /**
   * Voting for comment.
   * Sends API request to vote for comment.
   * If user has already voted or if there is any error, global error is dispatched.
   * @param value:VoteValue choose from enum
   */
  public voteComment(value: VoteValue) {
    this.loading = false
    const details = new VoteDetails(
      this.comment.commentId,
      this.articleId,
      value
    )
    this.$store
      .dispatch('articles/voteComment', details)
      .catch((err) => {
        this.$nuxt.$emit('temporary-error', {
          message: err.message,
          err,
        })
      })
      .finally(() => {
        this.loading = false
      })
  }
}
</script>

<style scoped></style>
