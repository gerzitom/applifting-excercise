<template>
  <div class="edit-article mt-10">
    <template v-if="!loading">
      <h1 class="text-h2 pb-5">Edit article</h1>
      <v-form onsubmit="return false" @submit="updateArticle">
        <v-text-field
          label="Article title"
          v-model="articleTitle"
          :disabled="uploading"
        />
        <v-textarea
          outlined
          label="Perex"
          v-model="articlePerex"
          :disabled="uploading"
        ></v-textarea>
        <img
          v-if="previewPictureSrc"
          :src="previewPictureSrc"
          alt="picture preview"
          class="new-article__picture-preview"
        />
        <v-file-input
          accept="image/png, image/jpeg"
          prepend-icon="mdi-camera"
          label="Upload new image"
          @change="handleAvatarChange"
        />
        <v-row class="mt-7 mb-3">
          <v-col>
            <h3 class="pb-3">Markdown</h3>
            <v-textarea
              label="Article content"
              v-model="articleContent"
              :disabled="uploading"
              outlined
            ></v-textarea>
          </v-col>
          <v-col>
            <h3 class="pb-8">Result</h3>
            <div v-html="$md.render(articleContent)"></div>
          </v-col>
        </v-row>
        <v-btn type="submit" :loading="uploading">Update article</v-btn>
        <v-btn color="error" text :disabled="uploading">Delete article</v-btn>
      </v-form>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ArticleDetail from '~/types/ArticleDetail'
import ArticleUpdateDto from '~/types/ArticleUpdateDto'
@Component({
  middleware: 'auth',
})
export default class UpdateArticle extends Vue {
  public previewPictureSrc: string = ''
  avatarImage!: File
  loading = true
  uploading = false
  articleId!: string
  articleContent: string = ''
  articleTitle: string = ''
  articlePerex: string = ''
  defaultImageSrc: string = ''
  created() {
    this.loadData()
  }

  /**
   * Load data about article by articleId
   */
  async loadData() {
    const articleData = (await this.$store.dispatch(
      'articles/getArticleDetail',
      this.$route.params.articleId
    )) as ArticleDetail
    this.setData(articleData)
    if (articleData.imageId) {
      await this.loadImage(articleData.imageId)
    }
    this.loading = false
  }

  /**
   * Sets data to form variables
   */
  setData(articleData: ArticleDetail) {
    this.articleId = articleData.articleId
    this.articleTitle = articleData.title
    this.articlePerex = articleData.perex
    this.articleContent = articleData.content
  }

  /**
   * Load image from API  by imageId.
   * Update image preview
   */
  async loadImage(imageId: string) {
    const imageSrc = await this.$store.dispatch('pictures/getImage', imageId)
    this.previewPictureSrc = imageSrc
    this.defaultImageSrc = imageSrc
  }

  /**
   * Updates article
   * If new image is present, upload it first and get new image ID.
   * Build dto for updating article
   * Send API request to update article.
   * Global messages are displayed after API request is done (error or success)
   */
  async updateArticle() {
    this.uploading = true
    let newImageId = null
    if (this.avatarImage) {
      console.log(this.avatarImage)
      newImageId = await this.$store.dispatch(
        'pictures/uploadPicture',
        this.avatarImage
      )
    }
    const updateDto = new ArticleUpdateDto(
      this.articleId,
      this.articleTitle,
      this.articlePerex,
      newImageId,
      this.articleContent
    )
    this.$store
      .dispatch('articles/updateArticle', updateDto)
      .then((response) => {
        console.log(response)
        this.$nuxt.$emit('info', {
          message: 'Article updated',
        })
      })
      .catch((err) => {
        this.$nuxt.$emit('temporary-error', {
          message: err.message,
          err,
        })
      })
      .finally(() => {
        this.uploading = false
      })
  }

  /**
   * Called when picture input is changed
   * Updates preview
   * @param file
   */
  handleAvatarChange(file: File) {
    this.avatarImage = file
    if (file) {
      this.previewPictureSrc = URL.createObjectURL(file)
    } else {
      this.previewPictureSrc = this.defaultImageSrc
    }
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
