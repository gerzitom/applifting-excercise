<template>
  <div class="user-avatar">
    <img src="https://picsum.photos/50/50" alt="User avatar" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
@Component
export default class UserAvatar extends Vue {}
</script>

<style scoped lang="scss">
$size: 40px;
.user-avatar {
  border-radius: 50%;
  width: $size;
  height: $size;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
