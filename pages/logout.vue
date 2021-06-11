<template>
  <div class="logout">
    <v-container class="text-center">
      <h1 class="text-h2 mt-10 mb-6">You are logged out</h1>
      <v-btn to="/">Go to main page</v-btn>
      <v-btn to="/login" color="primary">Login</v-btn>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'logout',
  auth: false,
}
</script>

<style scoped></style>
