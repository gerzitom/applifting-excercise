<template>
  <div class="comment">
    <v-row>
      <v-col cols="1">
        <user-avatar />
      </v-col>
      <v-col>
        <v-col>
          <p>{{ comment.author }}</p>
          <p>{{ comment.content }}</p>
          <v-row>
            <v-col cols="auto">
              <span>{{ comment.score }}</span>
            </v-col>
            <v-col cols="auto">
              <v-btn icon><v-icon>mdi-chevron-up</v-icon></v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn icon><v-icon>mdi-chevron-down</v-icon></v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import Comment from '@/types/Comment'
import UserAvatar from '~/components/UserAvatar.vue'

@Component({
  components: {
    UserAvatar,
  },
})
export default class ArticleComment extends Vue {
  @Prop() comment!: Comment
}
</script>

<style scoped></style>
