export default class Article {
  articleId: string
  author: string
  commentId: string
  postedAt: string
  score: number

  constructor(
    articleId: string,
    author: string,
    commentId: string,
    postedAt: string,
    score: number
  ) {
    this.articleId = articleId
    this.author = author
    this.commentId = commentId
    this.postedAt = postedAt
    this.score = score
  }
}
