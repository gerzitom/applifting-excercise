/**
 * ArticlesLoadDto
 * Specifies offset and limit of articles to be get by API
 */
export default class ArticlesLoadDto {
  offset: number
  limit: number

  /**
   * Constructor of ArticlesLoadDto
   * @param offset from start of articles
   * @param limit of articles to be loaded
   */
  constructor(offset: number, limit: number) {
    this.offset = offset
    this.limit = limit
  }
}
