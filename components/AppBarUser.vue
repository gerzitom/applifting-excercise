<template>
  <div class="app-bar-user">
    <template v-if="loggedIn">
      <p>Tomáš Geržičák</p>
    </template>
    <v-btn to="/login" class="secondary" v-else>Log in</v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class AppBarUser extends Vue {
  get loggedIn(): boolean {
    return this.$auth.loggedIn
  }
}
</script>

<style scoped></style>
