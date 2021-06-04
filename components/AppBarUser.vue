<template>
  <div class="app-bar-user">
    <v-menu offset-y v-if="loggedIn">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on"> Tomáš Geržičák </v-btn>
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
    <v-btn to="/login" class="secondary" v-else>Log in</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
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
