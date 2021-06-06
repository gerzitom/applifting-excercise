<template>
  <div class="app-bar-user">
    <div class="d-flex" v-if="loggedIn">
      <v-btn text to="/admin/my-articles"> My articles</v-btn>
      <v-btn color="primary" text to="/admin/new-article"> New article</v-btn>
      <div class="d-flex">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on">
              <div class="d-flex align-center">
                <span class="mr-2">{{ $auth.user.name }}</span>
                <user-avatar />
              </div>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn text>Settings</v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn text class="error" @click="logout">Log out</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <v-btn to="/login" class="secondary" v-else>Log in</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import UserAvatar from '~/components/UserAvatar.vue'

@Component({
  components: {
    UserAvatar,
  },
})
export default class AppBarUser extends Vue {
  mounted() {
    console.log(this.$auth)
  }
  get loggedIn(): boolean {
    return this.$auth.loggedIn
  }
  logout() {
    this.$auth
      .logout()
      .then((response) => {
        console.log('DONE')
      })
      .catch((err) => {
        console.log('ERR')
      })
  }
}
</script>

<style scoped></style>
