export default class Comment {
  articleId: string
  author: string
  commentId: string
  createdAt: string
  score: number
  content: string

  constructor(
    articleId: string,
    author: string,
    commentId: string,
    createdAt: string,
    score: number,
    content: string
  ) {
    this.articleId = articleId
    this.author = author
    this.commentId = commentId
    this.createdAt = createdAt
    this.score = score
    this.content = content
  }
}
