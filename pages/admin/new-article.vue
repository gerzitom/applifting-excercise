<template>
  <div class="new-article">
    <h1>Create new article</h1>
    <v-form onsubmit="return false" @submit="saveArticle">
      <v-text-field label="Article title" v-model="articleTitle" />
      <v-textarea label="Perex" v-model="articlePerex"></v-textarea>
      <img
        v-if="imagePreviewSrc"
        :src="imagePreviewSrc"
        alt="picture preview"
        class="new-article__picture-preview"
      />
      <v-file-input
        accept="image/png, image/jpeg"
        prepend-icon="mdi-camera"
        label="Article image"
        @change="handleAvatarChange"
      />
      <v-row class="mt-7">
        <v-col>
          <h3 class="pb-3">Markdown</h3>
          <v-textarea v-model="articleContent"></v-textarea>
        </v-col>
        <v-col>
          <h3 class="pb-8">Result</h3>
          <div v-html="$md.render(articleContent)"></div>
        </v-col>
      </v-row>
      <v-btn type="submit">Save article</v-btn>
    </v-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import NewArticleDto from '~/types/NewArticleDto'
@Component({})
export default class NewArticle extends Vue {
  articleTitle: string = ''
  articlePerex: string = ''
  articleContent: string = ''
  avatarImage!: File
  imagePreviewSrc: string = ''

  /**
   * Saving article.
   * Try to upload picture, if picture is chosen.
   * Then try to save article with id of uploaded picture with other data.
   * After successful upload, user is routed to list of all users articles.
   * When error occur, global error event is dispatched
   */
  async saveArticle() {
    const newImageId = await this.tryToUploadPicture()
    const newArticleDto = new NewArticleDto(
      this.articleTitle,
      this.articlePerex,
      newImageId,
      this.articleContent
    )
    this.$store
      .dispatch('articles/saveArticle', newArticleDto)
      .then((response) => {
        this.$router.push('/admin/my-articles')
      })
      .catch((err) => {
        this.$nuxt.$emit('temporary-error', {
          message: err.message,
          err,
        })
      })
  }

  /**
   * Uploads picture if new picture is available to backend.
   * When upload fails, global error is dispatched
   */
  tryToUploadPicture(): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve) => {
      if (this.imagePreviewSrc) {
        const formData = new FormData()
        formData.append('image', this.avatarImage)
        this.$store
          .dispatch('pictures/uploadPicture', formData)
          .then((newImageId) => {
            resolve(newImageId)
          })
          .catch((err) => {
            this.$nuxt.$emit('temporary-error', {
              title: 'Failed uploading image',
              message: err.message,
              err,
            })
          })
      } else resolve(undefined)
    })
  }

  /**
   * Called when picture input is changed
   * Updates
   * @param file
   */
  handleAvatarChange(file: File) {
    this.avatarImage = file
    this.imagePreviewSrc = URL.createObjectURL(file)
  }
}
</script>

<style scoped lang="scss">
.new-article {
  &__picture-preview {
    max-height: 400px;
    max-width: 100%;
  }
}
</style>
