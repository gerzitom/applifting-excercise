<template>
  <div class="comment">
    <v-row>
      <v-col cols="1">
        <user-avatar />
      </v-col>
      <v-col>
        <v-col>
          <div class="d-flex align-center">
            <p class="font-weight-bold text-body-1">{{ comment.author }}</p>
            <p class="ml-3 text-caption">{{ comment.commentId }}</p>
          </div>
          <p class="text-body-2">{{ comment.content }}</p>
          <div class="d-flex align-center">
            <span class="d-block">{{ comment.score }}</span>
            <v-divider vertical class="mx-3" />
            <v-btn icon @click="upvoteComment" :loading="loading"
              ><v-icon>mdi-chevron-up</v-icon></v-btn
            >
            <v-divider vertical class="mx-3" />
            <v-btn icon @click="downvoteComment" :loading="loading"
              ><v-icon>mdi-chevron-down</v-icon></v-btn
            >
          </div>
        </v-col>
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
  @Prop() articleId!: number
  loading = false
  public upvoteComment() {
    this.loading = false
    const details = new VoteDetails(
      this.comment.commentId,
      this.articleId,
      VoteValue.UP
    )
    this.$store
      .dispatch('articles/voteComment', details)
      .catch((err) => {
        this.$nuxt.$emit('error', {
          title: 'Connection error',
          message: 'Could not upvote comment, please ty it later',
          err,
        })
      })
      .finally(() => {
        this.loading = false
      })
  }

  public downvoteComment() {
    this.loading = false
    const details = new VoteDetails(
      this.comment.commentId,
      this.articleId,
      VoteValue.DOWM
    )
    this.$store
      .dispatch('articles/voteComment', details)
      .catch((err) => {
        this.$nuxt.$emit('error', {
          title: 'Connection error',
          message: 'Could not downvote comment, please ty it later',
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
