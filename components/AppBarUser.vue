<template>
  <div class="app-bar-user">
    <div class="d-flex" v-if="loggedIn">
      <div class="d-none d-sm-block">
        <v-btn text to="/admin/my-articles" id="my-articles-button">
          My articles</v-btn
        >
        <v-btn
          color="primary"
          text
          to="/admin/new-article"
          id="new-article-button"
        >
          New article</v-btn
        >
      </div>

      <div class="d-flex">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on">
              <div class="d-flex align-center">
                <template v-if="$auth.user.name">
                  <span class="mr-2">{{ $auth.user.name }}</span>
                  <user-avatar />
                </template>
                <template v-else>
                  <v-skeleton-loader type="text,avatar"></v-skeleton-loader>
                </template>
              </div>
            </v-btn>
          </template>
          <v-list>
            <div class="d-block d-sm-none">
              <v-list-item>
                <v-btn text to="/admin/my-articles" id="my-articles-button">
                  My articles</v-btn
                >
              </v-list-item>
              <v-list-item>
                <v-btn
                  color="primary"
                  text
                  to="/admin/new-article"
                  id="new-article-button"
                >
                  New article</v-btn
                >
              </v-list-item>
            </div>
            <v-list-item>
              <v-btn text class="error" @click="logout">Log out</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <v-btn
      to="/login"
      class="secondary logout-button"
      jest-id="logout-button"
      v-else
      >Log in</v-btn
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import UserAvatar from '~/components/UserAvatar.vue'

@Component({
  components: {
    UserAvatar,
  },
})
export default class AppBarUser extends Vue {
  get loggedIn(): boolean {
    return this.$auth.loggedIn
  }
  logout() {
    this.$auth.logout()
    this.$store.commit('articles/REMOVE_ALL_ARTICLES')
  }
}
</script>

<style scoped></style>
